import {
  and,
  desc,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  notifications,
  users,
} from "@/db/schema";

import type {
  NotificationCreateInput,
  NotificationUpdateInput,
} from "@/validations/notification.validation";

export class NotificationService {
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
        "NOTIFICATION_USER_NOT_FOUND"
      );
    }

    return user;
  }

  /*
   * ==========================================================
   * LISTAR
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId: number,
    filters?: {
      userId?: number;
      read?: boolean;
    }
  ) {
    const conditions = [
      eq(
        notifications.establishmentId,
        establishmentId
      ),
    ];

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
          notifications.userId,
          filters.userId
        )
      );
    }

    if (
      filters?.read !==
      undefined
    ) {
      conditions.push(
        eq(
          notifications.read,
          filters.read
        )
      );
    }

    return db
      .select()
      .from(
        notifications
      )
      .where(
        and(
          ...conditions
        )
      )
      .orderBy(
        desc(
          notifications.createdAt
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
          notifications
        )
        .where(
          and(
            eq(
              notifications.id,
              id
            ),

            eq(
              notifications.establishmentId,
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
    data: NotificationCreateInput
  ) {
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
          notifications
        )
        .values({
          establishmentId,

          userId:
            data.userId ??
            null,

          type:
            data.type,

          title:
            data.title,

          message:
            data.message,

          data:
            data.data ??
            null,

          read:
            data.read ??
            false,
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
    data: NotificationUpdateInput
  ) {
    const existing =
      await this.getByIdForEstablishment(
        id,
        establishmentId
      );

    if (!existing) {
      return null;
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

    const updateData: Record<
      string,
      unknown
    > = {};

    if (
      data.userId !==
      undefined
    ) {
      updateData.userId =
        data.userId;
    }

    if (
      data.type !==
      undefined
    ) {
      updateData.type =
        data.type;
    }

    if (
      data.title !==
      undefined
    ) {
      updateData.title =
        data.title;
    }

    if (
      data.message !==
      undefined
    ) {
      updateData.message =
        data.message;
    }

    if (
      data.data !==
      undefined
    ) {
      updateData.data =
        data.data;
    }

    if (
      data.read !==
      undefined
    ) {
      updateData.read =
        data.read;
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
          notifications
        )
        .set(
          updateData
        )
        .where(
          and(
            eq(
              notifications.id,
              id
            ),

            eq(
              notifications.establishmentId,
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
          notifications
        )
        .where(
          and(
            eq(
              notifications.id,
              id
            ),

            eq(
              notifications.establishmentId,
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