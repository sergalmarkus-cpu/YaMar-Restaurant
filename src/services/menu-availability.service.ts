import {
  and,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  establishments,
  menus,
} from "@/db/schema";

import {
  MenuScheduleService,
} from "./menu-schedule.service";

export interface MenuAvailability {
  isOpen: boolean;

  currentSchedule: {
    id: number;
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  } | null;

  nextOpening: {
    dayOfWeek: number;
    openTime: string;
  } | null;
}

export class MenuAvailabilityService {
  /*
   * ==========================================================
   * COMPROBAR DISPONIBILIDAD PÚBLICA DE UN MENÚ
   * ==========================================================
   */
  static async check(
    menuId: number,
    date: Date = new Date()
  ): Promise<MenuAvailability> {
    /*
     * Antes de consultar horarios comprobamos:
     *
     * - que el menú exista;
     * - que esté activo;
     * - que su establecimiento exista;
     * - que el establecimiento esté activo.
     */
    const [menu] = await db
      .select({
        id: menus.id,
        active: menus.active,

        establishmentId:
          menus.establishmentId,

        establishmentActive:
          establishments.active,
      })
      .from(menus)
      .innerJoin(
        establishments,
        eq(
          establishments.id,
          menus.establishmentId
        )
      )
      .where(
        eq(
          menus.id,
          menuId
        )
      )
      .limit(1);

    if (!menu) {
      throw new Error(
        "MENU_NOT_FOUND"
      );
    }

    if (!menu.active) {
      throw new Error(
        "MENU_INACTIVE"
      );
    }

    if (!menu.establishmentActive) {
      throw new Error(
        "ESTABLISHMENT_INACTIVE"
      );
    }

    /*
     * Este método es deliberadamente público.
     *
     * NO utilizamos MenuScheduleService.list(),
     * porque list() está reservado a administración
     * y su primer argumento es establishmentId.
     */
    const schedules =
      await MenuScheduleService.listByMenuPublic(
        menuId
      );

    const activeSchedules =
      schedules.filter(
        (schedule) =>
          schedule.active
      );

    if (
      activeSchedules.length === 0
    ) {
      return {
        isOpen: false,
        currentSchedule: null,
        nextOpening: null,
      };
    }

    const currentDay =
      date.getDay();

    const currentMinutes =
      date.getHours() * 60 +
      date.getMinutes();

    /*
     * ========================================================
     * COMPROBAR SI ESTAMOS DENTRO DE UNA FRANJA
     * ========================================================
     *
     * También soporta horarios que cruzan medianoche:
     *
     * 20:00 -> 02:00
     */
    const currentSchedule =
      activeSchedules.find(
        (schedule) => {
          if (
            schedule.dayOfWeek ===
            currentDay
          ) {
            const open =
              this.timeToMinutes(
                schedule.openTime
              );

            const close =
              this.timeToMinutes(
                schedule.closeTime
              );

            /*
             * Horario normal:
             *
             * 11:30 -> 13:00
             */
            if (close > open) {
              return (
                currentMinutes >= open &&
                currentMinutes < close
              );
            }

            /*
             * Horario nocturno:
             *
             * 20:00 -> 02:00
             */
            if (close < open) {
              return (
                currentMinutes >= open
              );
            }

            return false;
          }

          /*
           * Puede que la franja comenzara ayer
           * y termine hoy después de medianoche.
           */
          const previousDay =
            (currentDay + 6) % 7;

          if (
            schedule.dayOfWeek ===
            previousDay
          ) {
            const open =
              this.timeToMinutes(
                schedule.openTime
              );

            const close =
              this.timeToMinutes(
                schedule.closeTime
              );

            if (close < open) {
              return (
                currentMinutes < close
              );
            }
          }

          return false;
        }
      );

    if (currentSchedule) {
      return {
        isOpen: true,

        currentSchedule: {
          id:
            currentSchedule.id,

          dayOfWeek:
            currentSchedule.dayOfWeek,

          openTime:
            currentSchedule.openTime,

          closeTime:
            currentSchedule.closeTime,
        },

        nextOpening: null,
      };
    }

    /*
     * ========================================================
     * MENÚ CERRADO: BUSCAR PRÓXIMA APERTURA
     * ========================================================
     */
    const nextOpening =
      this.findNextOpening(
        activeSchedules,
        currentDay,
        currentMinutes
      );

    return {
      isOpen: false,
      currentSchedule: null,
      nextOpening,
    };
  }

  private static timeToMinutes(
    time: string
  ): number {
    const [
      hours,
      minutes,
    ] = time
      .split(":")
      .map(Number);

    return (
      hours * 60 +
      minutes
    );
  }

  private static findNextOpening(
    schedules: Awaited<
      ReturnType<
        typeof MenuScheduleService.listByMenuPublic
      >
    >,
    currentDay: number,
    currentMinutes: number
  ) {
    /*
     * Miramos como máximo una semana completa.
     */
    for (
      let offset = 0;
      offset <= 7;
      offset++
    ) {
      const day =
        (currentDay + offset) % 7;

      const candidates =
        schedules
          .filter(
            (schedule) =>
              schedule.active &&
              schedule.dayOfWeek ===
                day
          )
          .sort(
            (a, b) =>
              this.timeToMinutes(
                a.openTime
              ) -
              this.timeToMinutes(
                b.openTime
              )
          );

      for (
        const schedule
        of candidates
      ) {
        const open =
          this.timeToMinutes(
            schedule.openTime
          );

        /*
         * Si hablamos de hoy, ignoramos
         * aperturas que ya hayan pasado.
         */
        if (
          offset === 0 &&
          open <= currentMinutes
        ) {
          continue;
        }

        return {
          dayOfWeek:
            schedule.dayOfWeek,

          openTime:
            schedule.openTime,
        };
      }
    }

    return null;
  }
}