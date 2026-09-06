import { z } from "zod";

export const menuScheduleTimeSchema = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    "La hora debe tener el formato HH:mm."
  );

export const MenuScheduleCreateSchema =
  z
    .object({
      menuId: z
        .number()
        .int()
        .positive(),

      dayOfWeek: z
        .number()
        .int()
        .min(0)
        .max(6),

      openTime:
        menuScheduleTimeSchema,

      closeTime:
        menuScheduleTimeSchema,

      active: z
        .boolean()
        .optional()
        .default(true),
    })
    .refine(
      (data) =>
        data.openTime !==
        data.closeTime,
      {
        message:
          "La hora de apertura y cierre no pueden ser iguales.",
        path: ["closeTime"],
      }
    );

export const MenuScheduleUpdateSchema =
  z.object({
    menuId: z
      .number()
      .int()
      .positive()
      .optional(),

    dayOfWeek: z
      .number()
      .int()
      .min(0)
      .max(6)
      .optional(),

    openTime:
      menuScheduleTimeSchema
        .optional(),

    closeTime:
      menuScheduleTimeSchema
        .optional(),

    active: z
      .boolean()
      .optional(),
  });

export const ApplyMenuScheduleSchema =
  z
    .object({
      menuId: z
        .number()
        .int()
        .positive(),

      daysOfWeek: z
        .array(
          z
            .number()
            .int()
            .min(0)
            .max(6)
        )
        .min(
          1,
          "Debe indicarse al menos un día."
        ),

      openTime:
        menuScheduleTimeSchema,

      closeTime:
        menuScheduleTimeSchema,

      active: z
        .boolean()
        .optional()
        .default(true),
    })
    .refine(
      (data) =>
        data.openTime !==
        data.closeTime,
      {
        message:
          "La hora de apertura y cierre no pueden ser iguales.",
        path: ["closeTime"],
      }
    );

export type CreateMenuScheduleInput =
  z.infer<
    typeof MenuScheduleCreateSchema
  >;

export type UpdateMenuScheduleInput =
  z.infer<
    typeof MenuScheduleUpdateSchema
  >;

export type ApplyMenuScheduleInput =
  z.infer<
    typeof ApplyMenuScheduleSchema
  >;