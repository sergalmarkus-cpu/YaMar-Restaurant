import {
  and,
  asc,
  eq,
  inArray,
} from "drizzle-orm";

import { db } from "@/db";

import {
  menus,
  menuSchedules,
} from "@/db/schema";

import type {
  CreateMenuScheduleInput,
  UpdateMenuScheduleInput,
} from "@/validations/menu-schedule.validation";

export class MenuScheduleService {
  private static async validateMenu(
    menuId: number,
    establishmentId: number
  ) {
    const [menu] = await db
      .select({
        id: menus.id,
        establishmentId:
          menus.establishmentId,
        active: menus.active,
      })
      .from(menus)
      .where(
        and(
          eq(
            menus.id,
            menuId
          ),
          eq(
            menus.establishmentId,
            establishmentId
          )
        )
      )
      .limit(1);

    if (!menu) {
      throw new Error(
        "MENU_NOT_FOUND"
      );
    }

    return menu;
  }

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
          menuSchedules.menuId,
          menuId
        )
      );
    }

    return db
      .select({
        id: menuSchedules.id,
        menuId:
          menuSchedules.menuId,
        dayOfWeek:
          menuSchedules.dayOfWeek,
        openTime:
          menuSchedules.openTime,
        closeTime:
          menuSchedules.closeTime,
        active:
          menuSchedules.active,
      })
      .from(menuSchedules)
      .innerJoin(
        menus,
        eq(
          menuSchedules.menuId,
          menus.id
        )
      )
      .where(
        and(...conditions)
      )
      .orderBy(
        asc(
          menuSchedules.menuId
        ),
        asc(
          menuSchedules.dayOfWeek
        ),
        asc(
          menuSchedules.openTime
        )
      );
  }

  static async listByMenuPublic(
    menuId: number
  ) {
    return db
      .select()
      .from(menuSchedules)
      .where(
        eq(
          menuSchedules.menuId,
          menuId
        )
      )
      .orderBy(
        asc(
          menuSchedules.dayOfWeek
        ),
        asc(
          menuSchedules.openTime
        )
      );
  }

  static async getById(
    id: number,
    establishmentId: number
  ) {
    const [schedule] = await db
      .select({
        id: menuSchedules.id,
        menuId:
          menuSchedules.menuId,
        dayOfWeek:
          menuSchedules.dayOfWeek,
        openTime:
          menuSchedules.openTime,
        closeTime:
          menuSchedules.closeTime,
        active:
          menuSchedules.active,
      })
      .from(menuSchedules)
      .innerJoin(
        menus,
        eq(
          menuSchedules.menuId,
          menus.id
        )
      )
      .where(
        and(
          eq(
            menuSchedules.id,
            id
          ),
          eq(
            menus.establishmentId,
            establishmentId
          )
        )
      )
      .limit(1);

    return schedule ?? null;
  }

  static async getByMenuAndDay(
    menuId: number,
    dayOfWeek: number,
    establishmentId?: number
  ) {
    const conditions = [
      eq(
        menuSchedules.menuId,
        menuId
      ),
      eq(
        menuSchedules.dayOfWeek,
        dayOfWeek
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

      return db
        .select({
          id: menuSchedules.id,
          menuId:
            menuSchedules.menuId,
          dayOfWeek:
            menuSchedules.dayOfWeek,
          openTime:
            menuSchedules.openTime,
          closeTime:
            menuSchedules.closeTime,
          active:
            menuSchedules.active,
        })
        .from(menuSchedules)
        .innerJoin(
          menus,
          eq(
            menuSchedules.menuId,
            menus.id
          )
        )
        .where(
          and(...conditions)
        )
        .orderBy(
          asc(
            menuSchedules.openTime
          )
        );
    }

    return db
      .select()
      .from(menuSchedules)
      .where(
        and(...conditions)
      )
      .orderBy(
        asc(
          menuSchedules.openTime
        )
      );
  }

  static async create(
    data: CreateMenuScheduleInput,
    establishmentId: number
  ) {
    await this.validateMenu(
      data.menuId,
      establishmentId
    );

    const [inserted] =
      await db
        .insert(menuSchedules)
        .values({
          menuId:
            data.menuId,

          dayOfWeek:
            data.dayOfWeek,

          openTime:
            data.openTime,

          closeTime:
            data.closeTime,

          active:
            data.active ?? true,
        })
        .returning();

    return inserted;
  }

  static async update(
    id: number,
    data: UpdateMenuScheduleInput,
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

    await this.validateMenu(
      targetMenuId,
      establishmentId
    );

    const targetOpenTime =
      data.openTime ??
      existing.openTime;

    const targetCloseTime =
      data.closeTime ??
      existing.closeTime;

    if (
      targetOpenTime ===
      targetCloseTime
    ) {
      throw new Error(
        "INVALID_TIME_RANGE"
      );
    }

    const [updated] =
      await db
        .update(menuSchedules)
        .set({
          ...data,
          menuId:
            targetMenuId,
        })
        .where(
          eq(
            menuSchedules.id,
            id
          )
        )
        .returning();

    return updated ?? null;
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

    const [deleted] =
      await db
        .delete(menuSchedules)
        .where(
          eq(
            menuSchedules.id,
            id
          )
        )
        .returning();

    return deleted ?? null;
  }

  static async deleteAll(
    menuId: number,
    establishmentId: number
  ) {
    await this.validateMenu(
      menuId,
      establishmentId
    );

    return db
      .delete(menuSchedules)
      .where(
        eq(
          menuSchedules.menuId,
          menuId
        )
      )
      .returning();
  }

  static async applyToDays(
    menuId: number,
    daysOfWeek: number[],
    openTime: string,
    closeTime: string,
    active: boolean,
    establishmentId: number
  ) {
    await this.validateMenu(
      menuId,
      establishmentId
    );

    if (
      openTime ===
      closeTime
    ) {
      throw new Error(
        "INVALID_TIME_RANGE"
      );
    }

    const uniqueDays = [
      ...new Set(
        daysOfWeek
      ),
    ].sort(
      (a, b) =>
        a - b
    );

    if (
      uniqueDays.length === 0
    ) {
      return [];
    }

    const results = [];

    for (
      const dayOfWeek
      of uniqueDays
    ) {
      const existing =
        await this.getByMenuAndDay(
          menuId,
          dayOfWeek,
          establishmentId
        );

      const sameSchedule =
        existing.find(
          (schedule) =>
            schedule.openTime ===
              openTime &&
            schedule.closeTime ===
              closeTime
        );

      if (sameSchedule) {
        const updated =
          await this.update(
            sameSchedule.id,
            {
              openTime,
              closeTime,
              active,
            },
            establishmentId
          );

        if (updated) {
          results.push(
            updated
          );
        }

        continue;
      }

      const created =
        await this.create(
          {
            menuId,
            dayOfWeek,
            openTime,
            closeTime,
            active,
          },
          establishmentId
        );

      results.push(
        created
      );
    }

    return results;
  }

  static async deleteMany(
    ids: number[],
    establishmentId: number
  ) {
    const uniqueIds = [
      ...new Set(
        ids
      ),
    ];

    if (
      uniqueIds.length === 0
    ) {
      return [];
    }

    const ownedSchedules =
      await db
        .select({
          id:
            menuSchedules.id,
        })
        .from(menuSchedules)
        .innerJoin(
          menus,
          eq(
            menuSchedules.menuId,
            menus.id
          )
        )
        .where(
          and(
            inArray(
              menuSchedules.id,
              uniqueIds
            ),
            eq(
              menus.establishmentId,
              establishmentId
            )
          )
        );

    const ownedIds =
      ownedSchedules.map(
        (schedule) =>
          schedule.id
      );

    if (
      ownedIds.length === 0
    ) {
      return [];
    }

    return db
      .delete(menuSchedules)
      .where(
        inArray(
          menuSchedules.id,
          ownedIds
        )
      )
      .returning();
  }
}