import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";

import {
  categories,
  menus,
  products,
} from "@/db/schema";

import {
  CategoryCreateInput,
  CategoryUpdateInput,
} from "@/validations/category.validation";

export class CategoryService {
  static async list(
    establishmentId: number,
    menuId?: number
  ) {
    const conditions = [
      eq(
        menus.establishmentId,
        establishmentId
      ),
    ];

    if (menuId !== undefined) {
      conditions.push(
        eq(
          categories.menuId,
          menuId
        )
      );
    }

    return db
      .select({
        id: categories.id,
        menuId: categories.menuId,
        name: categories.name,
        description: categories.description,
        displayOrder: categories.displayOrder,
        active: categories.active,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .innerJoin(
        menus,
        eq(
          categories.menuId,
          menus.id
        )
      )
      .where(and(...conditions))
      .orderBy(
        asc(categories.displayOrder),
        asc(categories.id)
      );
  }

  static async getById(
    id: number,
    establishmentId?: number
  ) {
    const conditions = [
      eq(
        categories.id,
        id
      ),
    ];

    if (establishmentId !== undefined) {
      conditions.push(
        eq(
          menus.establishmentId,
          establishmentId
        )
      );
    }

    const result = await db
      .select({
        id: categories.id,
        menuId: categories.menuId,
        name: categories.name,
        description: categories.description,
        displayOrder: categories.displayOrder,
        active: categories.active,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .innerJoin(
        menus,
        eq(
          categories.menuId,
          menus.id
        )
      )
      .where(and(...conditions))
      .limit(1);

    return result[0] ?? null;
  }

  static async create(
    data: CategoryCreateInput,
    establishmentId: number
  ) {
    const menu =
      await db.query.menus.findFirst({
        where: eq(
          menus.id,
          data.menuId
        ),
      });

    if (!menu) {
      throw new Error(
        "El menú no existe."
      );
    }

    if (
      menu.establishmentId !==
      establishmentId
    ) {
      throw new Error(
        "El menú no pertenece al establecimiento autenticado."
      );
    }

    if (!menu.active) {
      throw new Error(
        "El menú no está activo."
      );
    }

    const inserted =
      await db
        .insert(categories)
        .values({
          ...data,
          description:
            data.description ?? {},
          displayOrder:
            data.displayOrder ?? 0,
          active:
            data.active ?? true,
        })
        .returning();

    return inserted[0];
  }

  static async update(
    id: number,
    data: CategoryUpdateInput,
    establishmentId: number
  ) {
    const existing =
      await this.getById(
        id,
        establishmentId
      );

    if (!existing) {
      return null;
    }

    const targetMenuId =
      data.menuId ??
      existing.menuId;

    if (data.menuId !== undefined) {
      const menu =
        await db.query.menus.findFirst({
          where: eq(
            menus.id,
            data.menuId
          ),
        });

      if (!menu) {
        throw new Error(
          "El menú no existe."
        );
      }

      if (
        menu.establishmentId !==
        establishmentId
      ) {
        throw new Error(
          "El menú no pertenece al establecimiento indicado."
        );
      }

      if (!menu.active) {
        throw new Error(
          "El menú no está activo."
        );
      }
    }

    const updateData = {
      ...data,
      menuId: targetMenuId,
      updatedAt: new Date(),
    };

    const updated =
      await db
        .update(categories)
        .set(updateData)
        .where(
          and(
            eq(
              categories.id,
              id
            ),
            eq(
              categories.menuId,
              existing.menuId
            )
          )
        )
        .returning();

    return updated[0] ?? null;
  }

  static async hasProducts(
    id: number,
    establishmentId?: number
  ) {
    const category =
      await this.getById(
        id,
        establishmentId
      );

    if (!category) {
      return false;
    }

    const product =
      await db.query.products.findFirst({
        where: eq(
          products.categoryId,
          id
        ),
      });

    return Boolean(product);
  }

  static async delete(
    id: number,
    establishmentId: number
  ) {
    const existing =
      await this.getById(
        id,
        establishmentId
      );

    if (!existing) {
      return null;
    }

    await db
      .delete(categories)
      .where(
        and(
          eq(
            categories.id,
            id
          ),
          eq(
            categories.menuId,
            existing.menuId
          )
        )
      );

    return existing;
  }
}