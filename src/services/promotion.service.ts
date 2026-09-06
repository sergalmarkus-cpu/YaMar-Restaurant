import {
  and,
  asc,
  eq,
  inArray,
  ne,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  promotions,
  products,
  categories,
  menus,
} from "@/db/schema";

import type {
  PromotionConditions,
  PromotionCreateInput,
  PromotionUpdateInput,
} from "@/validations/promotion.validation";

export class PromotionService {
  /*
   * ==========================================================
   * VALIDAR CÓDIGO
   * ==========================================================
   */

  private static async validateCode(
    establishmentId: number,
    code:
      | string
      | null
      | undefined,
    excludeId?: number
  ) {
    if (!code) {
      return;
    }

    const conditions = [
      eq(
        promotions.establishmentId,
        establishmentId
      ),

      eq(
        promotions.code,
        code
      ),
    ];

    if (
      excludeId !==
      undefined
    ) {
      conditions.push(
        ne(
          promotions.id,
          excludeId
        )
      );
    }

    const existing =
      await db.query.promotions.findFirst({
        where:
          and(
            ...conditions
          ),
      });

    if (existing) {
      throw new Error(
        "PROMOTION_CODE_EXISTS"
      );
    }
  }

  /*
   * ==========================================================
   * VALIDAR PRODUCTOS DE CONDITIONS
   * ==========================================================
   */

  private static async validateProductIds(
    establishmentId: number,
    productIds:
      number[]
  ) {
    const uniqueIds = [
      ...new Set(
        productIds
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
            products.id,
        })
        .from(
          products
        )
        .where(
          and(
            eq(
              products.establishmentId,
              establishmentId
            ),

            inArray(
              products.id,
              uniqueIds
            )
          )
        );

    if (
      rows.length !==
      uniqueIds.length
    ) {
      throw new Error(
        "PROMOTION_PRODUCT_NOT_FOUND"
      );
    }
  }

  /*
   * ==========================================================
   * VALIDAR MENÚS DE CONDITIONS
   * ==========================================================
   */

  private static async validateMenuIds(
    establishmentId: number,
    menuIds:
      number[]
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
            eq(
              menus.establishmentId,
              establishmentId
            ),

            inArray(
              menus.id,
              uniqueIds
            )
          )
        );

    if (
      rows.length !==
      uniqueIds.length
    ) {
      throw new Error(
        "PROMOTION_MENU_NOT_FOUND"
      );
    }
  }

  /*
   * ==========================================================
   * VALIDAR CATEGORÍAS DE CONDITIONS
   *
   * categories no tiene establishmentId.
   * Se comprueba mediante categories.menuId -> menus.
   * ==========================================================
   */

  private static async validateCategoryIds(
    establishmentId: number,
    categoryIds:
      number[]
  ) {
    const uniqueIds = [
      ...new Set(
        categoryIds
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
            categories.id,
        })
        .from(
          categories
        )
        .innerJoin(
          menus,
          eq(
            categories.menuId,
            menus.id
          )
        )
        .where(
          and(
            eq(
              menus.establishmentId,
              establishmentId
            ),

            inArray(
              categories.id,
              uniqueIds
            )
          )
        );

    if (
      rows.length !==
      uniqueIds.length
    ) {
      throw new Error(
        "PROMOTION_CATEGORY_NOT_FOUND"
      );
    }
  }

  /*
   * ==========================================================
   * VALIDAR CONDITIONS
   * ==========================================================
   */

  private static async validateConditions(
    establishmentId: number,
    conditions:
      | PromotionConditions
      | null
      | undefined
  ) {
    if (!conditions) {
      return;
    }

    if (
      Array.isArray(
        conditions.productIds
      )
    ) {
      await this.validateProductIds(
        establishmentId,
        conditions.productIds
      );
    }

    if (
      Array.isArray(
        conditions.menuIds
      )
    ) {
      await this.validateMenuIds(
        establishmentId,
        conditions.menuIds
      );
    }

    if (
      Array.isArray(
        conditions.categoryIds
      )
    ) {
      await this.validateCategoryIds(
        establishmentId,
        conditions.categoryIds
      );
    }
  }

  /*
   * ==========================================================
   * NORMALIZAR CONDITIONS
   * ==========================================================
   */

  private static normalizeConditions(
    conditions:
      | PromotionConditions
      | null
      | undefined
  ) {
    if (!conditions) {
      return (
        conditions ??
        null
      );
    }

    return {
      ...conditions,

      ...(conditions.productIds
        ? {
            productIds: [
              ...new Set(
                conditions.productIds
              ),
            ],
          }
        : {}),

      ...(conditions.menuIds
        ? {
            menuIds: [
              ...new Set(
                conditions.menuIds
              ),
            ],
          }
        : {}),

      ...(conditions.categoryIds
        ? {
            categoryIds: [
              ...new Set(
                conditions.categoryIds
              ),
            ],
          }
        : {}),
    };
  }

  /*
   * ==========================================================
   * LISTAR POR TENANT
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId: number
  ) {
    return db
      .select()
      .from(
        promotions
      )
      .where(
        eq(
          promotions.establishmentId,
          establishmentId
        )
      )
      .orderBy(
        asc(
          promotions.id
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
          promotions
        )
        .where(
          and(
            eq(
              promotions.id,
              id
            ),

            eq(
              promotions.establishmentId,
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
    data: PromotionCreateInput
  ) {
    await this.validateCode(
      establishmentId,
      data.code
    );

    await this.validateConditions(
      establishmentId,
      data.conditions
    );

    const inserted =
      await db
        .insert(
          promotions
        )
        .values({
          establishmentId,

          name:
            data.name,

          description:
            data.description ??
            null,

          code:
            data.code ??
            null,

          discountType:
            data.discountType,

          discountValue:
            data.discountValue,

          conditions:
            this.normalizeConditions(
              data.conditions
            ),

          startDate:
            data.startDate,

          endDate:
            data.endDate,

          usageLimit:
            data.usageLimit ??
            null,

          usageCount:
            0,

          active:
            data.active ??
            true,
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
    data: PromotionUpdateInput
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
      data.code !==
      undefined
    ) {
      await this.validateCode(
        establishmentId,
        data.code,
        id
      );
    }

    if (
      data.conditions !==
      undefined
    ) {
      await this.validateConditions(
        establishmentId,
        data.conditions
      );
    }

    const nextStartDate =
      data.startDate ??
      existing.startDate;

    const nextEndDate =
      data.endDate ??
      existing.endDate;

    if (
      nextEndDate <=
      nextStartDate
    ) {
      throw new Error(
        "PROMOTION_INVALID_DATE_RANGE"
      );
    }

    const nextDiscountType =
      data.discountType ??
      existing.discountType;

    const nextDiscountValue =
      data.discountValue ??
      existing.discountValue;

    const numericDiscountValue =
      Number(
        nextDiscountValue
      );

    if (
      nextDiscountType ===
        "percentage" &&
      (
        numericDiscountValue <=
          0 ||
        numericDiscountValue >
          100
      )
    ) {
      throw new Error(
        "PROMOTION_INVALID_PERCENTAGE"
      );
    }

    if (
      nextDiscountType ===
        "fixed" &&
      numericDiscountValue <=
        0
    ) {
      throw new Error(
        "PROMOTION_INVALID_FIXED_VALUE"
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
      data.code !==
      undefined
    ) {
      updateData.code =
        data.code;
    }

    if (
      data.discountType !==
      undefined
    ) {
      updateData.discountType =
        data.discountType;
    }

    if (
      data.discountValue !==
      undefined
    ) {
      updateData.discountValue =
        data.discountValue;
    }

    if (
      data.conditions !==
      undefined
    ) {
      updateData.conditions =
        this.normalizeConditions(
          data.conditions
        );
    }

    if (
      data.startDate !==
      undefined
    ) {
      updateData.startDate =
        data.startDate;
    }

    if (
      data.endDate !==
      undefined
    ) {
      updateData.endDate =
        data.endDate;
    }

    if (
      data.usageLimit !==
      undefined
    ) {
      updateData.usageLimit =
        data.usageLimit;
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
          promotions
        )
        .set(
          updateData
        )
        .where(
          and(
            eq(
              promotions.id,
              id
            ),

            eq(
              promotions.establishmentId,
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
          promotions
        )
        .where(
          and(
            eq(
              promotions.id,
              id
            ),

            eq(
              promotions.establishmentId,
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