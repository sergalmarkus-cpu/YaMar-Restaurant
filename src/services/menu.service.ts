import { and, eq, exists } from "drizzle-orm";

import { db } from "@/db";

import {
  menus,
  categories,
  menuSchedules,
} from "@/db/schema";

import {
  CreateMenuInput,
  UpdateMenuInput,
} from "@/validations/menu.validation";

export class MenuService {
  static async list(
    establishmentId: number
  ) {
    return db
      .select({
        id: menus.id,
        establishmentId: menus.establishmentId,
        name: menus.name,
        description: menus.description,
        type: menus.type,
        icon: menus.icon,
        displayOrder: menus.displayOrder,
        active: menus.active,
        createdAt: menus.createdAt,
        updatedAt: menus.updatedAt,

        hasSchedule: exists(
          db
            .select()
            .from(menuSchedules)
            .where(
              eq(
                menuSchedules.menuId,
                menus.id
              )
            )
        ),
      })
      .from(menus)
      .where(
        eq(
          menus.establishmentId,
          establishmentId
        )
      );
  }

  static async getById(
    id: number,
    establishmentId?: number
  ) {
    const conditions = [
      eq(
        menus.id,
        id
      ),
    ];

    if (
      establishmentId !== undefined
    ) {
      conditions.push(
        eq(
          menus.establishmentId,
          establishmentId
        )
      );
    }

    const result =
      await db
        .select()
        .from(menus)
        .where(
          and(...conditions)
        )
        .limit(1);

    return result[0] ?? null;
  }

  static async create(
    data: CreateMenuInput,
    establishmentId?: number
  ) {
    if (
      establishmentId !== undefined &&
      data.establishmentId !==
        establishmentId
    ) {
      throw new Error(
        "El menú no pertenece al establecimiento autenticado."
      );
    }

    const inserted =
      await db
        .insert(menus)
        .values({
          ...data,
          description:
            data.description ?? {},
          icon:
            data.icon ?? null,
        })
        .returning();

    return inserted[0];
  }

  static async update(
    id: number,
    establishmentId: number,
    data: UpdateMenuInput
  ) {
    const existing =
      await this.getById(
        id,
        establishmentId
      );

    if (!existing) {
      return null;
    }

    if (
      data.establishmentId !==
        undefined &&
      data.establishmentId !==
        establishmentId
    ) {
      throw new Error(
        "El menú no pertenece al establecimiento autenticado."
      );
    }

    const updateData = {
      ...data,
      establishmentId,
      updatedAt: new Date(),
    };

    const updated =
      await db
        .update(menus)
        .set(updateData)
        .where(
          and(
            eq(
              menus.id,
              id
            ),
            eq(
              menus.establishmentId,
              establishmentId
            )
          )
        )
        .returning();

    return updated[0] ?? null;
  }

  static async hasCategories(
    id: number,
    establishmentId?: number
  ) {
    const menu =
      await this.getById(
        id,
        establishmentId
      );

    if (!menu) {
      return false;
    }

    const category =
      await db.query.categories.findFirst({
        where: eq(
          categories.menuId,
          id
        ),
      });

    return Boolean(category);
  }

  /**
   * Elimina un menú y todas sus franjas horarias
   * dentro de una única transacción.
   *
   * Las categorías se comprueban previamente
   * desde la ruta DELETE /api/menus/[id].
   */
  static async delete(
    id: number,
    establishmentId?: number
  ) {
    const existing =
      await this.getById(
        id,
        establishmentId
      );

    if (!existing) {
      return null;
    }

    return db.transaction(
      async (tx) => {
        await tx
          .delete(menuSchedules)
          .where(
            eq(
              menuSchedules.menuId,
              id
            )
          );

        const conditions = [
          eq(
            menus.id,
            id
          ),
        ];

        if (
          establishmentId !==
          undefined
        ) {
          conditions.push(
            eq(
              menus.establishmentId,
              establishmentId
            )
          );
        }

        const deleted =
          await tx
            .delete(menus)
            .where(
              and(...conditions)
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