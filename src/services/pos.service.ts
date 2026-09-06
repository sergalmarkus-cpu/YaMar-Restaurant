import {
  and,
  asc,
  eq,
  inArray,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  menus,
  pointsOfSale,
} from "@/db/schema";

import type {
  PosCreateInput,
  PosUpdateInput,
} from "@/validations/pos.validation";

export class PosService {
  /*
   * ==========================================================
   * VALIDAR MENÚS DEL TENANT
   * ==========================================================
   */

  private static async validateMenusForEstablishment(
    menuIds: number[],
    establishmentId: number
  ) {
    const uniqueIds = [
      ...new Set(
        menuIds
      ),
    ];

    if (
      uniqueIds.length === 0
    ) {
      return;
    }

    const rows =
      await db
        .select({
          id:
            menus.id,
        })
        .from(
          menus
        )
        .where(
          and(
            inArray(
              menus.id,
              uniqueIds
            ),

            eq(
              menus.establishmentId,
              establishmentId
            )
          )
        );

    if (
      rows.length !==
      uniqueIds.length
    ) {
      throw new Error(
        "POS_MENU_NOT_FOUND"
      );
    }
  }

  /*
   * ==========================================================
   * LISTAR
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId: number
  ) {
    return db
      .select()
      .from(
        pointsOfSale
      )
      .where(
        eq(
          pointsOfSale.establishmentId,
          establishmentId
        )
      )
      .orderBy(
        asc(
          pointsOfSale.id
        )
      );
  }

  /*
   * ==========================================================
   * OBTENER POR ID
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
          pointsOfSale
        )
        .where(
          and(
            eq(
              pointsOfSale.id,
              id
            ),

            eq(
              pointsOfSale.establishmentId,
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
   * CREAR
   * ==========================================================
   */

  static async createForEstablishment(
    establishmentId: number,
    data: PosCreateInput
  ) {
    await this.validateMenusForEstablishment(
      data.menus,
      establishmentId
    );

    const inserted =
      await db
        .insert(
          pointsOfSale
        )
        .values({
          establishmentId,

          name:
            data.name,

          description:
            data.description ??
            null,

          latitude:
            data.latitude.toFixed(
              7
            ),

          longitude:
            data.longitude.toFixed(
              7
            ),

          radius:
            data.radius,

          menus:
            [
              ...new Set(
                data.menus
              ),
            ],

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
   * ACTUALIZAR
   * ==========================================================
   */

  static async updateForEstablishment(
    id: number,
    establishmentId: number,
    data: PosUpdateInput
  ) {
    const existing =
      await this.getByIdForEstablishment(
        id,
        establishmentId
      );

    if (
      !existing
    ) {
      return null;
    }

    if (
      data.menus !==
      undefined
    ) {
      await this.validateMenusForEstablishment(
        data.menus,
        establishmentId
      );
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
        data.latitude.toFixed(
          7
        );
    }

    if (
      data.longitude !==
      undefined
    ) {
      updateData.longitude =
        data.longitude.toFixed(
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
      data.menus !==
      undefined
    ) {
      updateData.menus =
        [
          ...new Set(
            data.menus
          ),
        ];
    }

    if (
      data.active !==
      undefined
    ) {
      updateData.active =
        data.active;
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
          pointsOfSale
        )
        .set(
          updateData
        )
        .where(
          and(
            eq(
              pointsOfSale.id,
              id
            ),

            eq(
              pointsOfSale.establishmentId,
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
          pointsOfSale
        )
        .where(
          and(
            eq(
              pointsOfSale.id,
              id
            ),

            eq(
              pointsOfSale.establishmentId,
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

  /*
   * ==========================================================
   * DISTANCIA HAVERSINE
   * ==========================================================
   */

  private static calculateDistance(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number
  ) {
    const earthRadius =
      6371000;

    const toRadians = (
      value: number
    ) =>
      value *
      Math.PI /
      180;

    const lat1 =
      toRadians(
        latitude1
      );

    const lat2 =
      toRadians(
        latitude2
      );

    const deltaLat =
      toRadians(
        latitude2 -
        latitude1
      );

    const deltaLon =
      toRadians(
        longitude2 -
        longitude1
      );

    const a =
      Math.sin(
        deltaLat / 2
      ) ** 2 +
      Math.cos(
        lat1
      ) *
        Math.cos(
          lat2
        ) *
        Math.sin(
          deltaLon / 2
        ) ** 2;

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(
          1 - a
        )
      );

    return (
      earthRadius *
      c
    );
  }

  /*
   * ==========================================================
   * POS CERCANOS DEL TENANT
   * ==========================================================
   */

  static async nearbyForEstablishment(
    establishmentId: number,
    latitude: number,
    longitude: number
  ) {
    const rows =
      await db
        .select()
        .from(
          pointsOfSale
        )
        .where(
          and(
            eq(
              pointsOfSale.establishmentId,
              establishmentId
            ),

            eq(
              pointsOfSale.active,
              true
            )
          )
        );

    return rows
      .map(
        (pos) => {
          const distance =
            this.calculateDistance(
              latitude,
              longitude,
              Number(
                pos.latitude
              ),
              Number(
                pos.longitude
              )
            );

          return {
            ...pos,

            distance:
              Math.round(
                distance
              ),

            withinRadius:
              distance <=
              (
                pos.radius ??
                50
              ),
          };
        }
      )
      .sort(
        (
          first,
          second
        ) =>
          first.distance -
          second.distance
      );
  }
}