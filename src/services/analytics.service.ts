import {
  and,
  desc,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  analyticsEvents,
  sessions,
  users,
} from "@/db/schema";

import type {
  AnalyticsEventCreateInput,
} from "@/validations/analytics.validation";

export class AnalyticsService {
  /*
   * ==========================================================
   * VALIDAR SESIÓN DEL TENANT
   * ==========================================================
   */

  private static async validateSessionForEstablishment(
    sessionId: string,
    establishmentId: number
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
        "ANALYTICS_SESSION_NOT_FOUND"
      );
    }

    return session;
  }

  /*
   * ==========================================================
   * VALIDAR USUARIO DEL TENANT
   * ==========================================================
   */

  private static async validateUserForEstablishment(
    userId: number,
    establishmentId: number
  ) {
    const user =
      await db.query.users.findFirst({
        where:
          and(
            eq(
              users.id,
              userId
            ),

            eq(
              users.establishmentId,
              establishmentId
            )
          ),
      });

    if (!user) {
      throw new Error(
        "ANALYTICS_USER_NOT_FOUND"
      );
    }

    return user;
  }

  /*
   * ==========================================================
   * LISTAR EVENTOS DEL TENANT
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId: number,
    filters?: {
      eventType?: string;
      sessionId?: string;
      userId?: number;
    }
  ) {
    const conditions = [
      eq(
        analyticsEvents.establishmentId,
        establishmentId
      ),
    ];

    if (
      filters?.eventType
    ) {
      conditions.push(
        eq(
          analyticsEvents.eventType,
          filters.eventType
        )
      );
    }

    if (
      filters?.sessionId
    ) {
      await this.validateSessionForEstablishment(
        filters.sessionId,
        establishmentId
      );

      conditions.push(
        eq(
          analyticsEvents.sessionId,
          filters.sessionId
        )
      );
    }

    if (
      filters?.userId !==
      undefined
    ) {
      await this.validateUserForEstablishment(
        filters.userId,
        establishmentId
      );

      conditions.push(
        eq(
          analyticsEvents.userId,
          filters.userId
        )
      );
    }

    return db
      .select()
      .from(
        analyticsEvents
      )
      .where(
        and(
          ...conditions
        )
      )
      .orderBy(
        desc(
          analyticsEvents.createdAt
        )
      );
  }

  /*
   * ==========================================================
   * OBTENER EVENTO POR ID + TENANT
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
          analyticsEvents
        )
        .where(
          and(
            eq(
              analyticsEvents.id,
              id
            ),

            eq(
              analyticsEvents.establishmentId,
              establishmentId
            )
          )
        )
        .limit(1);

    return (
      rows[0] ??
      null
    );
  }

  /*
   * ==========================================================
   * CREAR EVENTO
   * ==========================================================
   */

  static async createForEstablishment(
    establishmentId: number,
    data: AnalyticsEventCreateInput
  ) {
    if (
      data.sessionId !==
        undefined &&
      data.sessionId !==
        null
    ) {
      await this.validateSessionForEstablishment(
        data.sessionId,
        establishmentId
      );
    }

    if (
      data.userId !==
        undefined &&
      data.userId !==
        null
    ) {
      await this.validateUserForEstablishment(
        data.userId,
        establishmentId
      );
    }

    const inserted =
      await db
        .insert(
          analyticsEvents
        )
        .values({
          establishmentId,

          eventType:
            data.eventType,

          eventData:
            data.eventData ??
            null,

          sessionId:
            data.sessionId ??
            null,

          userId:
            data.userId ??
            null,
        })
        .returning();

    return (
      inserted[0] ??
      null
    );
  }

  /*
   * ==========================================================
   * ELIMINAR EVENTO
   *
   * Los eventos son inmutables:
   * no existe método UPDATE.
   * ==========================================================
   */

  static async deleteForEstablishment(
    id: number,
    establishmentId: number
  ) {
    const deleted =
      await db
        .delete(
          analyticsEvents
        )
        .where(
          and(
            eq(
              analyticsEvents.id,
              id
            ),

            eq(
              analyticsEvents.establishmentId,
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