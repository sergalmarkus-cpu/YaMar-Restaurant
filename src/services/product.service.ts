import {
  and,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  products,
  categories,
  menus,
} from "@/db/schema";

import {
  ProductInput,
  UpdateProductInput,
  AdminCreateProductInput,
  AdminUpdateProductInput,
} from "@/validations/product.validation";

import {
  Logger,
} from "./logger.service";

export class ProductService {
  /*
   * ==========================================================
   * MÉTODOS EXISTENTES
   * ==========================================================
   *
   * Se conservan para no romper posibles usos internos
   * existentes del proyecto.
   */

  static async list(
    categoryId?: number,
    menuId?: number
  ) {
    if (
      categoryId &&
      menuId
    ) {
      return db
        .select({
          product:
            products,
        })
        .from(
          products
        )
        .innerJoin(
          categories,
          eq(
            products.categoryId,
            categories.id
          )
        )
        .where(
          and(
            eq(
              products.categoryId,
              categoryId
            ),

            eq(
              categories.menuId,
              menuId
            )
          )
        )
        .then(
          (
            rows
          ) =>
            rows.map(
              (
                row
              ) =>
                row.product
            )
        );
    }

    if (categoryId) {
      return db
        .select()
        .from(
          products
        )
        .where(
          eq(
            products.categoryId,
            categoryId
          )
        );
    }

    if (menuId) {
      return db
        .select({
          product:
            products,
        })
        .from(
          products
        )
        .innerJoin(
          categories,
          eq(
            products.categoryId,
            categories.id
          )
        )
        .where(
          eq(
            categories.menuId,
            menuId
          )
        )
        .then(
          (
            rows
          ) =>
            rows.map(
              (
                row
              ) =>
                row.product
            )
        );
    }

    return db
      .select()
      .from(
        products
      );
  }

  static async getById(
    id: number
  ) {
    return db
      .query
      .products
      .findFirst({
        where:
          eq(
            products.id,
            id
          ),
      });
  }

  static async create(
    data:
      ProductInput
  ) {
    Logger.info(
      "Creando producto",
      {
        name:
          data.name,
      }
    );

    const inserted =
      await db
        .insert(
          products
        )
        .values({
          ...data,

          description:
            data.description ??
            {},

          image:
            data.image ??
            null,

          allergens:
            data.allergens ??
            [],

          dietary:
            data.dietary ??
            [],
        })
        .returning();

    const product =
      inserted[0];

    if (!product) {
      throw new Error(
        "PRODUCT_CREATE_FAILED"
      );
    }

    Logger.info(
      "Producto creado",
      {
        id:
          product.id,
      }
    );

    return product;
  }

  static async update(
    id: number,
    data:
      UpdateProductInput
  ) {
    const updateData:
      Record<
        string,
        unknown
      > = {};

    if (
      data.establishmentId !==
      undefined
    ) {
      updateData.establishmentId =
        data.establishmentId;
    }

    if (
      data.categoryId !==
      undefined
    ) {
      updateData.categoryId =
        data.categoryId;
    }

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
      data.price !==
      undefined
    ) {
      updateData.price =
        data.price;
    }

    if (
      data.image !==
      undefined
    ) {
      updateData.image =
        data.image;
    }

    if (
      data.allergens !==
      undefined
    ) {
      updateData.allergens =
        data.allergens;
    }

    if (
      data.dietary !==
      undefined
    ) {
      updateData.dietary =
        data.dietary;
    }

    if (
      data.available !==
      undefined
    ) {
      updateData.available =
        data.available;
    }

    if (
      data.stock !==
      undefined
    ) {
      updateData.stock =
        data.stock;
    }

    if (
      data.preparationTime !==
      undefined
    ) {
      updateData.preparationTime =
        data.preparationTime;
    }

    if (
      data.displayOrder !==
      undefined
    ) {
      updateData.displayOrder =
        data.displayOrder;
    }

    if (
      data.featured !==
      undefined
    ) {
      updateData.featured =
        data.featured;
    }

    if (
      data.dailySpecial !==
      undefined
    ) {
      updateData.dailySpecial =
        data.dailySpecial;
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
      return this.getById(
        id
      );
    }

    const updated =
      await db
        .update(
          products
        )
        .set({
          ...updateData,

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            products.id,
            id
          )
        )
        .returning();

    return (
      updated[0] ??
      null
    );
  }

  static async delete(
    id: number
  ) {
    await db
      .delete(
        products
      )
      .where(
        eq(
          products.id,
          id
        )
      );

    return true;
  }

  /*
   * ==========================================================
   * VALIDAR CATEGORÍA MULTI-TENANT
   * ==========================================================
   *
   * categories no contiene establishmentId.
   *
   * La relación segura es:
   *
   * category
   *   -> menu
   *   -> establishment
   */

  private static async validateCategoryForEstablishment(
    categoryId:
      number,
    establishmentId:
      number
  ) {
    const rows =
      await db
        .select({
          categoryId:
            categories.id,

          menuId:
            menus.id,

          establishmentId:
            menus.establishmentId,
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
              categories.id,
              categoryId
            ),

            eq(
              menus.establishmentId,
              establishmentId
            )
          )
        )
        .limit(
          1
        );

    const category =
      rows[0];

    if (!category) {
      throw new Error(
        "CATEGORY_NOT_FOUND"
      );
    }

    return category;
  }

  /*
   * ==========================================================
   * LISTAR PRODUCTOS DEL TENANT
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId:
      number,
    categoryId?:
      number,
    menuId?:
      number
  ) {
    /*
     * Si hay filtro por menú, hacemos join
     * product -> category -> menu.
     */

    if (
      menuId !==
      undefined
    ) {
      const conditions = [
        eq(
          products.establishmentId,
          establishmentId
        ),

        eq(
          menus.establishmentId,
          establishmentId
        ),

        eq(
          menus.id,
          menuId
        ),
      ];

      if (
        categoryId !==
        undefined
      ) {
        conditions.push(
          eq(
            categories.id,
            categoryId
          )
        );
      }

      return db
        .select({
          product:
            products,
        })
        .from(
          products
        )
        .innerJoin(
          categories,
          eq(
            products.categoryId,
            categories.id
          )
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
            ...conditions
          )
        )
        .then(
          (
            rows
          ) =>
            rows.map(
              (
                row
              ) =>
                row.product
            )
        );
    }

    /*
     * Filtro únicamente por categoría.
     *
     * También comprobamos que la categoría
     * pertenezca al tenant mediante su menú.
     */

    if (
      categoryId !==
      undefined
    ) {
      return db
        .select({
          product:
            products,
        })
        .from(
          products
        )
        .innerJoin(
          categories,
          eq(
            products.categoryId,
            categories.id
          )
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
              products.establishmentId,
              establishmentId
            ),

            eq(
              categories.id,
              categoryId
            ),

            eq(
              menus.establishmentId,
              establishmentId
            )
          )
        )
        .then(
          (
            rows
          ) =>
            rows.map(
              (
                row
              ) =>
                row.product
            )
        );
    }

    /*
     * Sin filtros:
     * únicamente productos del tenant.
     */

    return db
      .select()
      .from(
        products
      )
      .where(
        eq(
          products.establishmentId,
          establishmentId
        )
      );
  }

  /*
   * ==========================================================
   * OBTENER PRODUCTO POR ID DEL TENANT
   * ==========================================================
   */

  static async getByIdForEstablishment(
    id:
      number,
    establishmentId:
      number
  ) {
    return db
      .query
      .products
      .findFirst({
        where:
          and(
            eq(
              products.id,
              id
            ),

            eq(
              products.establishmentId,
              establishmentId
            )
          ),
      });
  }

  /*
   * ==========================================================
   * CREAR PRODUCTO EN EL TENANT
   * ==========================================================
   */

  static async createForEstablishment(
    establishmentId:
      number,
    data:
      AdminCreateProductInput
  ) {
    await this
      .validateCategoryForEstablishment(
        data.categoryId,
        establishmentId
      );

    Logger.info(
      "Creando producto",
      {
        establishmentId,

        name:
          data.name,
      }
    );

    const inserted =
      await db
        .insert(
          products
        )
        .values({
          ...data,

          establishmentId,

          description:
            data.description ??
            {},

          image:
            data.image ??
            null,

          allergens:
            data.allergens ??
            [],

          dietary:
            data.dietary ??
            [],
        })
        .returning();

    const product =
      inserted[0];

    if (!product) {
      throw new Error(
        "PRODUCT_CREATE_FAILED"
      );
    }

    return product;
  }

  /*
   * ==========================================================
   * ACTUALIZAR PRODUCTO DEL TENANT
   * ==========================================================
   */

  static async updateForEstablishment(
    id:
      number,
    establishmentId:
      number,
    data:
      AdminUpdateProductInput
  ) {
    const existing =
      await this
        .getByIdForEstablishment(
          id,
          establishmentId
        );

    if (!existing) {
      return null;
    }

    if (
      data.categoryId !==
      undefined
    ) {
      await this
        .validateCategoryForEstablishment(
          data.categoryId,
          establishmentId
        );
    }

    const updateData:
      Record<
        string,
        unknown
      > = {};

    if (
      data.categoryId !==
      undefined
    ) {
      updateData.categoryId =
        data.categoryId;
    }

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
      data.price !==
      undefined
    ) {
      updateData.price =
        data.price;
    }

    if (
      data.image !==
      undefined
    ) {
      updateData.image =
        data.image;
    }

    if (
      data.allergens !==
      undefined
    ) {
      updateData.allergens =
        data.allergens;
    }

    if (
      data.dietary !==
      undefined
    ) {
      updateData.dietary =
        data.dietary;
    }

    if (
      data.available !==
      undefined
    ) {
      updateData.available =
        data.available;
    }

    if (
      data.stock !==
      undefined
    ) {
      updateData.stock =
        data.stock;
    }

    if (
      data.preparationTime !==
      undefined
    ) {
      updateData.preparationTime =
        data.preparationTime;
    }

    if (
      data.displayOrder !==
      undefined
    ) {
      updateData.displayOrder =
        data.displayOrder;
    }

    if (
      data.featured !==
      undefined
    ) {
      updateData.featured =
        data.featured;
    }

    if (
      data.dailySpecial !==
      undefined
    ) {
      updateData.dailySpecial =
        data.dailySpecial;
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
          products
        )
        .set({
          ...updateData,

          /*
           * Nunca aceptamos establishmentId
           * procedente del frontend.
           */

          establishmentId,

          updatedAt:
            new Date(),
        })
        .where(
          and(
            eq(
              products.id,
              id
            ),

            eq(
              products.establishmentId,
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
   * ELIMINAR PRODUCTO DEL TENANT
   * ==========================================================
   */

  static async deleteForEstablishment(
    id:
      number,
    establishmentId:
      number
  ) {
    const existing =
      await this
        .getByIdForEstablishment(
          id,
          establishmentId
        );

    if (!existing) {
      return null;
    }

    const deleted =
      await db
        .delete(
          products
        )
        .where(
          and(
            eq(
              products.id,
              id
            ),

            eq(
              products.establishmentId,
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