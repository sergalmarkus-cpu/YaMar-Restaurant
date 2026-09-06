import { z } from "zod";

export const MenuCreateSchema = z.object({
  establishmentId:
    z.number().int().positive(),

  name:
    z.record(
      z.string(),
      z.string()
    ),

  description:
    z
      .record(
        z.string(),
        z.string()
      )
      .optional()
      .default({}),

  type:
    z.enum([
      "snacks",
      "restaurant",
      "cocktails",
      "coffee",
      "breakfast",
      "desserts",
      "custom",
    ]),

  icon:
    z
      .string()
      .nullable()
      .optional()
      .default(null),

  displayOrder:
    z
      .number()
      .int()
      .nonnegative()
      .optional()
      .default(0),

  active:
    z
      .boolean()
      .optional()
      .default(true),
});

export const MenuUpdateSchema =
  z.object({
    establishmentId:
      z
        .number()
        .int()
        .positive()
        .optional(),

    name:
      z
        .record(
          z.string(),
          z.string()
        )
        .optional(),

    description:
      z
        .record(
          z.string(),
          z.string()
        )
        .optional(),

    type:
      z
        .enum([
          "snacks",
          "restaurant",
          "cocktails",
          "coffee",
          "breakfast",
          "desserts",
          "custom",
        ])
        .optional(),

    icon:
      z
        .string()
        .nullable()
        .optional(),

    displayOrder:
      z
        .number()
        .int()
        .nonnegative()
        .optional(),

    active:
      z
        .boolean()
        .optional(),
  });

export type CreateMenuInput =
  z.infer<
    typeof MenuCreateSchema
  >;

export type UpdateMenuInput =
  z.infer<
    typeof MenuUpdateSchema
  >;

// Compatibilidad con código anterior
export const MenuSchema =
  MenuCreateSchema;

export type MenuInput =
  CreateMenuInput;