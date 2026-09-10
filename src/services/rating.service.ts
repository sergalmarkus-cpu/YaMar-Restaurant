import {
  and,
  desc,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  establishments,
  notifications,
  orders,
  ratings,
  sessions,
  users,
} from "@/db/schema";

import type {
  CreateRatingInput,
  RatingModerationInput,
  RatingResponseInput,
} from "@/validations/rating.validation";

const MANAGEMENT_ROLES = [
  "admin",
  "manager",
] as const;

function isManagementRole(
  role: string
): role is (typeof MANAGEMENT_ROLES)[number] {
  return MANAGEMENT_ROLES.includes(
    role as (typeof MANAGEMENT_ROLES)[number]
  );
}

export class RatingService {
  /*
   * ==========================================================
   * CREAR VALORACIÓN DESDE UNA SESIÓN DE CLIENTE
   * ==========================================================
   */

  static async create(
    data: CreateRatingInput
  ) {
    const [session] = await db
      .select({
        id: sessions.id,
        establishmentId:
          sessions.establishmentId,
        establishmentActive:
          establishments.active,
      })
      .from(sessions)
      .innerJoin(
        establishments,
        eq(
          establishments.id,
          sessions.establishmentId
        )
      )
      .where(
        eq(
          sessions.id,
          data.sessionId
        )
      )
      .limit(1);

    if (!session) {
      throw new Error(
        "SESSION_NOT_FOUND"
      );
    }

    if (!session.establishmentActive) {
      throw new Error(
        "ESTABLISHMENT_INACTIVE"
      );
    }

    /*
     * La sesión debe haber tenido consumo real.
     * No basta con un pedido pending/cancelled.
     */
    const [deliveredOrder] = await db
      .select({
        id: orders.id,
      })
      .from(orders)
      .where(
        and(
          eq(
            orders.sessionId,
            data.sessionId
          ),
          eq(
            orders.establishmentId,
            session.establishmentId
          ),
          eq(
            orders.status,
            "delivered"
          )
        )
      )
      .limit(1);

    if (!deliveredOrder) {
      throw new Error(
        "NO_DELIVERED_ORDER"
      );
    }

    const [existingRating] = await db
      .select({
        id: ratings.id,
      })
      .from(ratings)
      .where(
        eq(
          ratings.sessionId,
          data.sessionId
        )
      )
      .limit(1);

    if (existingRating) {
      throw new Error(
        "SESSION_ALREADY_RATED"
      );
    }

    return await db.transaction(
      async (
        tx
      ) => {
        const [rating] = await tx
          .insert(ratings)
          .values({
            sessionId:
              data.sessionId,

            establishmentId:
              session.establishmentId,

            foodRating:
              data.foodRating,

            serviceRating:
              data.serviceRating,

            attentionRating:
              data.attentionRating,

            comment:
              data.comment,

            photos:
              data.photos,

            approved:
              false,
          })
          .returning();

        /*
         * ======================================================
         * NOTIFICACIÓN: NUEVA VALORACIÓN
         * ======================================================
         *
         * La valoración y su notificación se crean dentro
         * de la misma transacción.
         *
         * Así evitamos:
         * - valoraciones creadas sin notificación;
         * - notificaciones de valoraciones que hagan rollback.
         */

        await tx
          .insert(
            notifications
          )
          .values({
            establishmentId:
              session.establishmentId,

            userId:
              null,

            type:
              "new_rating",

            title:
              "Nueva valoración",

            message:
              "Se ha recibido una nueva valoración de un cliente.",

            data: {
              ratingId:
                rating.id,

              sessionId:
                rating.sessionId,

              foodRating:
                rating.foodRating,

              serviceRating:
                rating.serviceRating,

              attentionRating:
                rating.attentionRating,

              approved:
                rating.approved,
            },

            read:
              false,
          });

        return rating;
      }
    );
  }

  /*
   * ==========================================================
   * VALORACIONES PÚBLICAS APROBADAS
   * ==========================================================
   */

  static async getApprovedByEstablishment(
    establishmentId: number
  ) {
    return db
      .select()
      .from(ratings)
      .where(
        and(
          eq(
            ratings.establishmentId,
            establishmentId
          ),
          eq(
            ratings.approved,
            true
          )
        )
      )
      .orderBy(
        desc(
          ratings.createdAt
        )
      );
  }

  /*
   * ==========================================================
   * LISTADO ADMINISTRATIVO
   * ==========================================================
   */

  static async getByEstablishment(
    establishmentId: number,
    approved?: boolean
  ) {
    const conditions = [
      eq(
        ratings.establishmentId,
        establishmentId
      ),
    ];

    if (approved !== undefined) {
      conditions.push(
        eq(
          ratings.approved,
          approved
        )
      );
    }

    return db
      .select()
      .from(ratings)
      .where(
        and(...conditions)
      )
      .orderBy(
        desc(
          ratings.createdAt
        )
      );
  }

  /*
   * ==========================================================
   * OBTENER POR ID CON AISLAMIENTO MULTI-TENANT
   * ==========================================================
   */

  static async getById(
    id: number,
    establishmentId: number
  ) {
    const [rating] = await db
      .select()
      .from(ratings)
      .where(
        and(
          eq(
            ratings.id,
            id
          ),
          eq(
            ratings.establishmentId,
            establishmentId
          )
        )
      )
      .limit(1);

    if (!rating) {
      throw new Error(
        "RATING_NOT_FOUND"
      );
    }

    return rating;
  }

  /*
   * ==========================================================
   * VALIDAR USUARIO ADMINISTRATIVO
   * ==========================================================
   */

  private static async validateManagementUser(
    userId: number,
    establishmentId: number,
    userRole: string
  ) {
    if (!isManagementRole(userRole)) {
      throw new Error(
        "FORBIDDEN"
      );
    }

    const [user] = await db
      .select({
        id: users.id,
        establishmentId:
          users.establishmentId,
        role: users.role,
        active: users.active,
      })
      .from(users)
      .where(
        eq(
          users.id,
          userId
        )
      )
      .limit(1);

    if (!user) {
      throw new Error(
        "USER_NOT_FOUND"
      );
    }

    if (!user.active) {
      throw new Error(
        "USER_INACTIVE"
      );
    }

    if (
      user.establishmentId !==
      establishmentId
    ) {
      throw new Error(
        "ESTABLISHMENT_ACCESS_DENIED"
      );
    }

    if (
      user.role !==
      userRole
    ) {
      throw new Error(
        "ROLE_MISMATCH"
      );
    }

    return user;
  }

  /*
   * ==========================================================
   * MODERAR
   * ==========================================================
   */

  static async moderate(
    id: number,
    data: RatingModerationInput,
    userId: number,
    establishmentId: number,
    userRole: string
  ) {
    await this.validateManagementUser(
      userId,
      establishmentId,
      userRole
    );

    await this.getById(
      id,
      establishmentId
    );

    const [updated] = await db
      .update(ratings)
      .set({
        approved:
          data.approved,

        moderatedBy:
          userId,

        moderatedAt:
          new Date(),
      })
      .where(
        and(
          eq(
            ratings.id,
            id
          ),
          eq(
            ratings.establishmentId,
            establishmentId
          )
        )
      )
      .returning();

    return updated;
  }

  /*
   * ==========================================================
   * RESPONDER
   * ==========================================================
   */

  static async respond(
    id: number,
    data: RatingResponseInput,
    userId: number,
    establishmentId: number,
    userRole: string
  ) {
    await this.validateManagementUser(
      userId,
      establishmentId,
      userRole
    );

    const rating =
      await this.getById(
        id,
        establishmentId
      );

    if (!rating.approved) {
      throw new Error(
        "RATING_NOT_APPROVED"
      );
    }

    const [updated] = await db
      .update(ratings)
      .set({
        response:
          data.response,

        respondedBy:
          userId,

        respondedAt:
          new Date(),
      })
      .where(
        and(
          eq(
            ratings.id,
            id
          ),
          eq(
            ratings.establishmentId,
            establishmentId
          )
        )
      )
      .returning();

    return updated;
  }
}