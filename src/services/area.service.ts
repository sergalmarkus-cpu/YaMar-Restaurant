import {
  and,
  asc,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  areas,
  tables,
} from "@/db/schema";

import type {
  AreaCreateInput,
  AreaUpdateInput,
} from "@/validations/area.validation";

export class AreaHasTablesError extends Error {
  constructor() {
    super(
      "AREA_HAS_TABLES"
    );

    this.name =
      "AreaHasTablesError";
  }
}

export class AreaService {
  /*
   * ==========================================================
   * LISTAR ÁREAS DEL ESTABLECIMIENTO
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId: number
  ) {
    return db
      .select()
      .from(
        areas
      )
      .where(
        eq(
          areas.establishmentId,
          establishmentId
        )
      )
      .orderBy(
        asc(
          areas.id
        )
      );
  }

  /*
   * ==========================================================
   * OBTENER ÁREA POR ID
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
          areas
        )
        .where(
          and(
            eq(
              areas.id,
              id
            ),

            eq(
              areas.establishmentId,
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
   * CREAR ÁREA
   * ==========================================================
   */

  static async createForEstablishment(
    establishmentId: number,
    data: AreaCreateInput
  ) {
    const inserted =
      await db
        .insert(
          areas
        )
        .values({
          establishmentId,

          name:
            data.name,

          description:
            data.description ??
            null,

          latitude:
            data.latitude ===
              undefined ||
            data.latitude ===
              null
              ? null
              : data.latitude.toFixed(
                  7
                ),

          longitude:
            data.longitude ===
              undefined ||
            data.longitude ===
              null
              ? null
              : data.longitude.toFixed(
                  7
                ),

          radius:
            data.radius ??
            20,

          active:
            data.active,
        })
        .returning();

    return (
      inserted[0] ??
      null
    );
  }

  /*
   * ==========================================================
   * ACTUALIZAR ÁREA
   * ==========================================================
   */

  static async updateForEstablishment(
    id: number,
    establishmentId: number,
    data: AreaUpdateInput
  ) {
    const existing =
      await this
        .getByIdForEstablishment(
          id,
          establishmentId
        );

    if (
      !existing
    ) {
      return null;
    }

    const updateData: Record<
      string,
      unknown
    > = {};

    if (
      data.name !==
      undefined
    ) {
      updateData.name =
        data.name;
    }

    if (
      data.description !==
      undefined
    ) {
      updateData.description =
        data.description;
    }

    if (
      data.latitude !==
      undefined
    ) {
      updateData.latitude =
        data.latitude ===
        null
          ? null
          : data.latitude.toFixed(
              7
            );
    }

    if (
      data.longitude !==
      undefined
    ) {
      updateData.longitude =
        data.longitude ===
        null
          ? null
          : data.longitude.toFixed(
              7
            );
    }

    if (
      data.radius !==
      undefined
    ) {
      updateData.radius =
        data.radius;
    }

    if (
      data.active !==
      undefined
    ) {
      updateData.active =
        data.active;
    }

    const updated =
      await db
        .update(
          areas
        )
        .set(
          updateData
        )
        .where(
          and(
            eq(
              areas.id,
              id
            ),

            eq(
              areas.establishmentId,
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
   * DESACTIVAR ÁREA
   * ==========================================================
   *
   * Se mantiene para los flujos que necesiten
   * una desactivación lógica.
   */

  static async deactivateForEstablishment(
    id: number,
    establishmentId: number
  ) {
    const updated =
      await db
        .update(
          areas
        )
        .set({
          active:
            false,
        })
        .where(
          and(
            eq(
              areas.id,
              id
            ),

            eq(
              areas.establishmentId,
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
   * ELIMINAR ÁREA
   * ==========================================================
   *
   * Una zona solo puede eliminarse físicamente
   * cuando no tiene mesas asociadas.
   *
   * La comprobación incluye establishmentId para
   * mantener el aislamiento multi-tenant.
   */

  static async deleteForEstablishment(
    id: number,
    establishmentId: number
  ) {
    return db.transaction(
      async (
        tx
      ) => {
        const existing =
          await tx
            .select({
              id:
                areas.id,
            })
            .from(
              areas
            )
            .where(
              and(
                eq(
                  areas.id,
                  id
                ),

                eq(
                  areas.establishmentId,
                  establishmentId
                )
              )
            )
            .limit(1);

        if (
          !existing[0]
        ) {
          return null;
        }

        const linkedTables =
          await tx
            .select({
              id:
                tables.id,
            })
            .from(
              tables
            )
            .where(
              and(
                eq(
                  tables.areaId,
                  id
                ),

                eq(
                  tables.establishmentId,
                  establishmentId
                )
              )
            )
            .limit(1);

        if (
          linkedTables[0]
        ) {
          throw new AreaHasTablesError();
        }

        const deleted =
          await tx
            .delete(
              areas
            )
            .where(
              and(
                eq(
                  areas.id,
                  id
                ),

                eq(
                  areas.establishmentId,
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
    );
  }
}
