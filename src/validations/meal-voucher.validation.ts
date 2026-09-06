import { z } from "zod";

const MoneySchema =
  z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "El importe debe tener un formato válido."
    );

export const MealVoucherCreateSchema =
  z.object({
    name:
      z.record(
        z.string(),
        z.string()
      ),

    type:
      z.enum([
        "full_board",
        "half_board",
        "all_inclusive",
        "custom",
      ]),

    creditsPerDay:
      MoneySchema,

    validMenus:
      z
        .array(
          z
            .number()
            .int()
            .positive()
        )
        .default([]),

    validFrom:
      z.coerce.date(),

    validUntil:
      z.coerce.date(),

    active:
      z
        .boolean()
        .default(true),
  })
  .refine(
    (data) =>
      data.validUntil >
      data.validFrom,
    {
      message:
        "La fecha final debe ser posterior a la fecha inicial.",
      path: [
        "validUntil",
      ],
    }
  );

export const MealVoucherUpdateSchema =
  z.object({
    name:
      z
        .record(
          z.string(),
          z.string()
        )
        .optional(),

    type:
      z
        .enum([
          "full_board",
          "half_board",
          "all_inclusive",
          "custom",
        ])
        .optional(),

    creditsPerDay:
      MoneySchema
        .optional(),

    validMenus:
      z
        .array(
          z
            .number()
            .int()
            .positive()
        )
        .optional(),

    validFrom:
      z.coerce
        .date()
        .optional(),

    validUntil:
      z.coerce
        .date()
        .optional(),

    active:
      z
        .boolean()
        .optional(),
  });

export type MealVoucherCreateInput =
  z.infer<
    typeof MealVoucherCreateSchema
  >;

export type MealVoucherUpdateInput =
  z.infer<
    typeof MealVoucherUpdateSchema
  >;