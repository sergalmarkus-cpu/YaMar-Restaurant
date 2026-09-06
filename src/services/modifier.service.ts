import {
  and,
  asc,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  modifiers,
  products,
} from "@/db/schema";

import {
  ModifierCreateInput,
  ModifierUpdateInput,
} from "@/validations/modifier.validation";

export class ModifierService {
  /*
   * ==========================================================
   * VALIDAR PRODUCTO DEL ESTABLECIMIENTO
   * ==========================================================
   */

  private static async validateProductForEstablishment(
    productId: number,
    establishmentId: number
  ) {
    const product =
      await db.query.products.findFirst({
        where:
          and(
            eq(
              products.id,
              productId
            ),

            eq(
              products.establishmentId,
              establishmentId
            )
          ),
      });

    if (!product) {
      throw new Error(
        "PRODUCT_NOT_FOUND"
      );
    }

    return product;
  }

  /*
   * ==========================================================
   * LISTAR POR ESTABLECIMIENTO
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId: number,
    productId?: number
  ) {
    if (
      productId !== undefined
    ) {
      /*
       * Antes de listar por productId comprobamos
       * que ese producto pertenece al tenant.
       *
       * Esto evita usar productId como vía lateral
       * para consultar datos de otro establecimiento.
       */
      await this.validateProductForEstablishment(
        productId,
        establishmentId
      );

      const rows =
        await db
          .select({
            modifier:
              modifiers,
          })
          .from(
            modifiers
          )
          .innerJoin(
            products,
            eq(
              modifiers.productId,
              products.id
            )
          )
          .where(
            and(
              eq(
                modifiers.productId,
                productId
              ),

              eq(
                products.establishmentId,
                establishmentId
              )
            )
          )
          .orderBy(
            asc(
              modifiers.id
            )
          );

      return rows.map(
        (
          row
        ) =>
          row.modifier
      );
    }

    const rows =
      await db
        .select({
          modifier:
            modifiers,
        })
        .from(
          modifiers
        )
        .innerJoin(
          products,
          eq(
            modifiers.productId,
            products.id
          )
        )
        .where(
          eq(
            products.establishmentId,
            establishmentId
          )
        )
        .orderBy(
          asc(
            modifiers.productId
          ),
          asc(
            modifiers.id
          )
        );

    return rows.map(
      (
        row
      ) =>
        row.modifier
    );
  }

  /*
   * ==========================================================
   * OBTENER POR ID Y TENANT
   * ==========================================================
   */

  static async getByIdForEstablishment(
    id: number,
    establishmentId: number
  ) {
    const rows =
      await db
        .select({
          modifier:
            modifiers,
        })
        .from(
          modifiers
        )
        .innerJoin(
          products,
          eq(
            modifiers.productId,
            products.id
          )
        )
        .where(
          and(
            eq(
              modifiers.id,
              id
            ),

            eq(
              products.establishmentId,
              establishmentId
            )
          )
        )
        .limit(
          1
        );

    return (
      rows[0]?.modifier ??
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
    data: ModifierCreateInput
  ) {
    /*
     * Nunca permitimos asociar el modificador
     * a un producto de otro establecimiento.
     */
    await this.validateProductForEstablishment(
      data.productId,
      establishmentId
    );

    const inserted =
      await db
        .insert(
          modifiers
        )
        .values({
          productId:
            data.productId,

          name:
            data.name,

          type:
            data.type,

          price:
            data.price ??
            "0",

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
    data: ModifierUpdateInput
  ) {
    const existing =
      await this.getByIdForEstablishment(
        id,
        establishmentId
      );

    if (!existing) {
      return null;
    }

    /*
     * Si se cambia productId, el nuevo producto
     * también debe pertenecer al mismo tenant.
     */
    if (
      data.productId !==
      undefined
    ) {
      await this.validateProductForEstablishment(
        data.productId,
        establishmentId
      );
    }

    const updateData: Record<
      string,
      unknown
    > = {};

    if (
      data.productId !==
      undefined
    ) {
      updateData.productId =
        data.productId;
    }

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
      data.price !==
      undefined
    ) {
      updateData.price =
        data.price;
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
          modifiers
        )
        .set(
          updateData
        )
        .where(
          eq(
            modifiers.id,
            id
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
    const existing =
      await this.getByIdForEstablishment(
        id,
        establishmentId
      );

    if (!existing) {
      return null;
    }

    const deleted =
      await db
        .delete(
          modifiers
        )
        .where(
          eq(
            modifiers.id,
            id
          )
        )
        .returning();

    return (
      deleted[0] ??
      null
    );
  }
}