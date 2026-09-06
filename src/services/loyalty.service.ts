import {
  and,
  asc,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  loyaltyPoints,
  sessions,
} from "@/db/schema";

import type {
  LoyaltyCreateInput,
  LoyaltyUpdateInput,
} from "@/validations/loyalty.validation";

export class LoyaltyService {
  /*
   * ==========================================================
   * NORMALIZAR EMAIL
   * ==========================================================
   */

  private static normalizeEmail(
    email: string
  ) {
    return email
      .trim()
      .toLowerCase();
  }

  /*
   * ==========================================================
   * VALIDAR SESIÓN DEL ESTABLECIMIENTO
   * ==========================================================
   */

  private static async validateSessionForEstablishment(
    sessionId: string,
    establishmentId: number,
    customerEmail?: string
  ) {
    const session =
      await db.query.sessions.findFirst({
        where:
          and(
            eq(
              sessions.id,
              sessionId
            ),

            eq(
              sessions.establishmentId,
              establishmentId
            )
          ),
      });

    if (!session) {
      throw new Error(
        "LOYALTY_SESSION_NOT_FOUND"
      );
    }

    /*
     * Si la sesión ya tiene un email,
     * no permitimos asociarla posteriormente
     * a otro cliente distinto.
     */
    if (
      customerEmail &&
      session.customerEmail
    ) {
      const requestedEmail =
        this.normalizeEmail(
          customerEmail
        );

      const sessionEmail =
        this.normalizeEmail(
          session.customerEmail
        );

      if (
        requestedEmail !==
        sessionEmail
      ) {
        throw new Error(
          "LOYALTY_EMAIL_MISMATCH"
        );
      }
    }

    return session;
  }

  /*
   * ==========================================================
   * EVITAR DUPLICADO PARA LA MISMA SESIÓN
   * ==========================================================
   */

  private static async validateDuplicate(
    establishmentId: number,
    sessionId: string,
    excludeId?: number
  ) {
    const existing =
      await db.query.loyaltyPoints.findFirst({
        where:
          and(
            eq(
              loyaltyPoints.establishmentId,
              establishmentId
            ),

            eq(
              loyaltyPoints.sessionId,
              sessionId
            )
          ),
      });

    if (
      existing &&
      existing.id !==
        excludeId
    ) {
      throw new Error(
        "LOYALTY_ENTRY_EXISTS"
      );
    }
  }

  /*
   * ==========================================================
   * LISTAR POR ESTABLECIMIENTO
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId: number,
    filters?: {
      sessionId?: string;
      customerEmail?: string;
    }
  ) {
    if (
      filters?.sessionId
    ) {
      return db
        .select()
        .from(
          loyaltyPoints
        )
        .where(
          and(
            eq(
              loyaltyPoints.establishmentId,
              establishmentId
            ),

            eq(
              loyaltyPoints.sessionId,
              filters.sessionId
            )
          )
        )
        .orderBy(
          asc(
            loyaltyPoints.id
          )
        );
    }

    if (
      filters?.customerEmail
    ) {
      const email =
        this.normalizeEmail(
          filters.customerEmail
        );

      return db
        .select()
        .from(
          loyaltyPoints
        )
        .where(
          and(
            eq(
              loyaltyPoints.establishmentId,
              establishmentId
            ),

            eq(
              loyaltyPoints.customerEmail,
              email
            )
          )
        )
        .orderBy(
          asc(
            loyaltyPoints.id
          )
        );
    }

    return db
      .select()
      .from(
        loyaltyPoints
      )
      .where(
        eq(
          loyaltyPoints.establishmentId,
          establishmentId
        )
      )
      .orderBy(
        asc(
          loyaltyPoints.id
        )
      );
  }

  /*
   * ==========================================================
   * OBTENER POR ID + TENANT
   * ==========================================================
   */

  static async getByIdForEstablishment(
    id: number,
    establishmentId: number
  ) {
    const rows =
      await db
        .select()
        .from(
          loyaltyPoints
        )
        .where(
          and(
            eq(
              loyaltyPoints.id,
              id
            ),

            eq(
              loyaltyPoints.establishmentId,
              establishmentId
            )
          )
        )
        .limit(
          1
        );

    return (
      rows[0] ??
      null
    );
  }

  /*
   * ==========================================================
   * CREAR
   * ==========================================================
   */

  static async createForEstablishment(
    establishmentId: number,
    data: LoyaltyCreateInput
  ) {
    const normalizedEmail =
      this.normalizeEmail(
        data.customerEmail
      );

    await this.validateSessionForEstablishment(
      data.sessionId,
      establishmentId,
      normalizedEmail
    );

    await this.validateDuplicate(
      establishmentId,
      data.sessionId
    );

    const inserted =
      await db
        .insert(
          loyaltyPoints
        )
        .values({
          establishmentId,

          sessionId:
            data.sessionId,

          customerEmail:
            normalizedEmail,

          points:
            data.points,

          totalSpent:
            Number(
              data.totalSpent
            ).toFixed(2),

          lastVisit:
            data.lastVisit ??
            new Date(),
        })
        .returning();

    return (
      inserted[0] ??
      null
    );
  }

  /*
   * ==========================================================
   * ACTUALIZAR
   * ==========================================================
   */

  static async updateForEstablishment(
    id: number,
    establishmentId: number,
    data: LoyaltyUpdateInput
  ) {
    const existing =
      await this.getByIdForEstablishment(
        id,
        establishmentId
      );

    if (!existing) {
      return null;
    }

    const nextSessionId =
      data.sessionId ??
      existing.sessionId;

    const nextEmail =
      this.normalizeEmail(
        data.customerEmail ??
          existing.customerEmail
      );

    /*
     * La sesión nueva o existente siempre
     * debe pertenecer al tenant autenticado.
     */
    await this.validateSessionForEstablishment(
      nextSessionId,
      establishmentId,
      nextEmail
    );

    if (
      nextSessionId !==
      existing.sessionId
    ) {
      await this.validateDuplicate(
        establishmentId,
        nextSessionId,
        id
      );
    }

    const updateData: Record<
      string,
      unknown
    > = {};

    if (
      data.sessionId !==
      undefined
    ) {
      updateData.sessionId =
        data.sessionId;
    }

    if (
      data.customerEmail !==
      undefined
    ) {
      updateData.customerEmail =
        nextEmail;
    }

    if (
      data.points !==
      undefined
    ) {
      updateData.points =
        data.points;
    }

    if (
      data.totalSpent !==
      undefined
    ) {
      updateData.totalSpent =
        Number(
          data.totalSpent
        ).toFixed(2);
    }

    if (
      data.lastVisit !==
      undefined
    ) {
      updateData.lastVisit =
        data.lastVisit;
    }

    if (
      Object.keys(
        updateData
      ).length ===
      0
    ) {
      return existing;
    }

    const updated =
      await db
        .update(
          loyaltyPoints
        )
        .set({
          ...updateData,

          updatedAt:
            new Date(),
        })
        .where(
          and(
            eq(
              loyaltyPoints.id,
              id
            ),

            eq(
              loyaltyPoints.establishmentId,
              establishmentId
            )
          )
        )
        .returning();

    return (
      updated[0] ??
      null
    );
  }

  /*
   * ==========================================================
   * ELIMINAR
   * ==========================================================
   */

  static async deleteForEstablishment(
    id: number,
    establishmentId: number
  ) {
    const deleted =
      await db
        .delete(
          loyaltyPoints
        )
        .where(
          and(
            eq(
              loyaltyPoints.id,
              id
            ),

            eq(
              loyaltyPoints.establishmentId,
              establishmentId
            )
          )
        )
        .returning();

    return (
      deleted[0] ??
      null
    );
  }
}