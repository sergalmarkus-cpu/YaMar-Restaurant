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
  mealVouchers,
  menus,
} from "@/db/schema";

import type {
  MealVoucherCreateInput,
  MealVoucherUpdateInput,
} from "@/validations/meal-voucher.validation";

export class MealVoucherService {
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
      uniqueIds.length ===
      0
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
        "MEAL_VOUCHER_MENU_NOT_FOUND"
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
        mealVouchers
      )
      .where(
        eq(
          mealVouchers.establishmentId,
          establishmentId
        )
      )
      .orderBy(
        asc(
          mealVouchers.id
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
          mealVouchers
        )
        .where(
          and(
            eq(
              mealVouchers.id,
              id
            ),

            eq(
              mealVouchers.establishmentId,
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
    data: MealVoucherCreateInput
  ) {
    await this.validateMenusForEstablishment(
      data.validMenus,
      establishmentId
    );

    const credits =
      Number(
        data.creditsPerDay
      );

    if (
      !Number.isFinite(
        credits
      ) ||
      credits <= 0
    ) {
      throw new Error(
        "INVALID_VOUCHER_CREDITS"
      );
    }

    const inserted =
      await db
        .insert(
          mealVouchers
        )
        .values({
          establishmentId,

          name:
            data.name,

          type:
            data.type,

          creditsPerDay:
            credits.toFixed(2),

          validMenus:
            [
              ...new Set(
                data.validMenus
              ),
            ],

          validFrom:
            data.validFrom,

          validUntil:
            data.validUntil,

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
    data: MealVoucherUpdateInput
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
      data.validMenus !==
      undefined
    ) {
      await this.validateMenusForEstablishment(
        data.validMenus,
        establishmentId
      );
    }

    const nextValidFrom =
      data.validFrom ??
      existing.validFrom;

    const nextValidUntil =
      data.validUntil ??
      existing.validUntil;

    if (
      nextValidUntil <=
      nextValidFrom
    ) {
      throw new Error(
        "INVALID_VOUCHER_DATE_RANGE"
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
      data.type !==
      undefined
    ) {
      updateData.type =
        data.type;
    }

    if (
      data.creditsPerDay !==
      undefined
    ) {
      const credits =
        Number(
          data.creditsPerDay
        );

      if (
        !Number.isFinite(
          credits
        ) ||
        credits <= 0
      ) {
        throw new Error(
          "INVALID_VOUCHER_CREDITS"
        );
      }

      updateData.creditsPerDay =
        credits.toFixed(2);
    }

    if (
      data.validMenus !==
      undefined
    ) {
      updateData.validMenus =
        [
          ...new Set(
            data.validMenus
          ),
        ];
    }

    if (
      data.validFrom !==
      undefined
    ) {
      updateData.validFrom =
        data.validFrom;
    }

    if (
      data.validUntil !==
      undefined
    ) {
      updateData.validUntil =
        data.validUntil;
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
          mealVouchers
        )
        .set(
          updateData
        )
        .where(
          and(
            eq(
              mealVouchers.id,
              id
            ),

            eq(
              mealVouchers.establishmentId,
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
          mealVouchers
        )
        .where(
          and(
            eq(
              mealVouchers.id,
              id
            ),

            eq(
              mealVouchers.establishmentId,
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