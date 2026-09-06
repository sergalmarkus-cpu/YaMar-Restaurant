import { z } from "zod";

const nullableCoordinateSchema =
  z
    .union([
      z.number(),
      z.string(),
    ])
    .transform((value) =>
      typeof value === "number"
        ? value
        : Number(value)
    )
    .refine(
      (value) =>
        Number.isFinite(value),
      "La coordenada no es válida."
    )
    .nullable()
    .optional();

export const AreaCreateSchema =
  z.object({
    name:
      z
        .string()
        .trim()
        .min(
          1,
          "El nombre del área es obligatorio."
        )
        .max(
          100,
          "El nombre del área no puede superar los 100 caracteres."
        ),

    description:
      z
        .string()
        .trim()
        .max(
          500,
          "La descripción no puede superar los 500 caracteres."
        )
        .nullable()
        .optional(),

    latitude:
      nullableCoordinateSchema,

    longitude:
      nullableCoordinateSchema,

    radius:
      z
        .number()
        .int()
        .positive()
        .max(
          10000,
          "El radio no puede superar los 10000 metros."
        )
        .optional(),

    active:
      z
        .boolean()
        .optional()
        .default(true),
  });

export const AreaUpdateSchema =
  z.object({
    name:
      z
        .string()
        .trim()
        .min(
          1,
          "El nombre del área no puede estar vacío."
        )
        .max(
          100,
          "El nombre del área no puede superar los 100 caracteres."
        )
        .optional(),

    description:
      z
        .string()
        .trim()
        .max(
          500,
          "La descripción no puede superar los 500 caracteres."
        )
        .nullable()
        .optional(),

    latitude:
      nullableCoordinateSchema,

    longitude:
      nullableCoordinateSchema,

    radius:
      z
        .number()
        .int()
        .positive()
        .max(
          10000,
          "El radio no puede superar los 10000 metros."
        )
        .optional(),

    active:
      z
        .boolean()
        .optional(),
  })
  .refine(
    (data) =>
      Object.keys(data).length >
      0,
    {
      message:
        "Debes indicar al menos un campo para actualizar.",
    }
  );

export type AreaCreateInput =
  z.infer<
    typeof AreaCreateSchema
  >;

export type AreaUpdateInput =
  z.infer<
    typeof AreaUpdateSchema
  >;