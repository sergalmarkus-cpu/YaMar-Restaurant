import {
  and,
  eq,
  isNull,
  ne,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  sessions,
  tables,
} from "@/db/schema";

import type {
  SessionInput,
} from "@/validations/session.validation";

export class SessionService {
  /*
   * ==========================================================
   * LISTAR
   * ==========================================================
   */

  static async list() {
    return db
      .select()
      .from(
        sessions
      );
  }

  /*
   * ==========================================================
   * OBTENER POR ID
   * ==========================================================
   */

  static async getById(
    id: string
  ) {
    return db.query
      .sessions
      .findFirst({
        where:
          eq(
            sessions.id,
            id
          ),
      });
  }

  /*
   * ==========================================================
   * SINCRONIZAR ESTADO DE MESA
   * ==========================================================
   */

  private static async syncTableStatus(
    tableId: number,
    establishmentId: number
  ) {
    const activeSession =
      await db.query
        .sessions
        .findFirst({
          where:
            and(
              eq(
                sessions.tableId,
                tableId
              ),

              eq(
                sessions.establishmentId,
                establishmentId
              ),

              eq(
                sessions.active,
                true
              ),

              isNull(
                sessions.closedAt
              )
            ),
        });

    await db
      .update(
        tables
      )
      .set({
        status:
          activeSession
            ? "occupied"
            : "available",

        updatedAt:
          new Date(),
      })
      .where(
        and(
          eq(
            tables.id,
            tableId
          ),

          eq(
            tables.establishmentId,
            establishmentId
          )
        )
      );
  }

  /*
   * ==========================================================
   * CREAR
   * ==========================================================
   */

  static async create(
    data: SessionInput
  ) {
    const existing =
      await db.query
        .sessions
        .findFirst({
          where:
            and(
              eq(
                sessions.tableId,
                data.tableId
              ),

              eq(
                sessions.establishmentId,
                data.establishmentId
              ),

              eq(
                sessions.active,
                true
              ),

              isNull(
                sessions.closedAt
              )
            ),
        });

    if (
      existing
    ) {
      await this.syncTableStatus(
        existing.tableId,
        existing.establishmentId
      );

      throw new Error(
        "Ya existe una sesión activa para esta mesa."
      );
    }

    try {
      const inserted =
        await db
          .insert(
            sessions
          )
          .values(
            data
          )
          .returning();

      const session =
        inserted[0];

      if (
        session
      ) {
        await this.syncTableStatus(
          session.tableId,
          session.establishmentId
        );
      }

      return session;
    } catch (
      error: any
    ) {
      const postgresError =
        error?.cause ??
        error;

      if (
        postgresError?.code ===
          "23505" &&
        postgresError?.constraint ===
          "sessions_active_table_unique"
      ) {
        await this.syncTableStatus(
          data.tableId,
          data.establishmentId
        );

        throw new Error(
          "Ya existe una sesión activa para esta mesa."
        );
      }

      throw error;
    }
  }

  /*
   * ==========================================================
   * ACTUALIZAR
   * ==========================================================
   */

  static async update(
    id: string,
    data: SessionInput
  ) {
    const current =
      await this.getById(
        id
      );

    if (
      !current
    ) {
      return null;
    }

    if (
      data.active
    ) {
      const existing =
        await db.query
          .sessions
          .findFirst({
            where:
              and(
                eq(
                  sessions.tableId,
                  data.tableId
                ),

                eq(
                  sessions.establishmentId,
                  data.establishmentId
                ),

                eq(
                  sessions.active,
                  true
                ),

                isNull(
                  sessions.closedAt
                ),

                ne(
                  sessions.id,
                  id
                )
              ),
          });

      if (
        existing
      ) {
        throw new Error(
          "Ya existe una sesión activa para esta mesa."
        );
      }
    }

    const updated =
      await db
        .update(
          sessions
        )
        .set({
          ...data,

          closedAt:
            data.active
              ? null
              : current.closedAt ??
                new Date(),

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            sessions.id,
            id
          )
        )
        .returning();

    const session =
      updated[0] ??
      null;

    await this.syncTableStatus(
      current.tableId,
      current.establishmentId
    );

    if (
      session &&
      (
        session.tableId !==
          current.tableId ||
        session.establishmentId !==
          current.establishmentId
      )
    ) {
      await this.syncTableStatus(
        session.tableId,
        session.establishmentId
      );
    }

    return session;
  }

  /*
   * ==========================================================
   * CERRAR
   * ==========================================================
   */

  static async close(
    id: string
  ) {
    const current =
      await this.getById(
        id
      );

    if (
      !current
    ) {
      return null;
    }

    /*
     * Cierre idempotente.
     *
     * Si la sesión ya está cerrada no cambiamos
     * closedAt. Solo aseguramos que el estado de
     * la mesa siga sincronizado.
     */
    if (
      !current.active
    ) {
      await this.syncTableStatus(
        current.tableId,
        current.establishmentId
      );

      return current;
    }

    const updated =
      await db
        .update(
          sessions
        )
        .set({
          active:
            false,

          closedAt:
            current.closedAt ??
            new Date(),

          updatedAt:
            new Date(),
        })
        .where(
          and(
            eq(
              sessions.id,
              id
            ),

            eq(
              sessions.active,
              true
            )
          )
        )
        .returning();

    const session =
      updated[0] ??
      (
        await this.getById(
          id
        )
      );

    await this.syncTableStatus(
      current.tableId,
      current.establishmentId
    );

    return session;
  }

  /*
   * ==========================================================
   * ELIMINAR
   * ==========================================================
   */

  static async delete(
    id: string
  ) {
    const current =
      await this.getById(
        id
      );

    if (
      !current
    ) {
      return false;
    }

    await db
      .delete(
        sessions
      )
      .where(
        eq(
          sessions.id,
          id
        )
      );

    await this.syncTableStatus(
      current.tableId,
      current.establishmentId
    );

    return true;
  }
}