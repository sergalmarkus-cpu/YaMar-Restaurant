import { z } from "zod";

/*
 * ==========================================================
 * ESQUEMA BASE
 * ==========================================================
 *
 * Se mantiene establishmentId en el esquema base por
 * compatibilidad con posibles usos internos existentes.
 */

export const ProductSchema =
  z.object({
    establishmentId:
      z
        .number()
        .int()
        .positive(),

    categoryId:
      z
        .number()
        .int()
        .positive(),

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
        .optional(),

    price:
      z
        .string()
        .regex(
          /^\d+(\.\d{1,2})?$/,
          "El precio debe tener un formato válido."
        ),

    image:
      z
        .string()
        .nullable()
        .optional(),

    allergens:
      z
        .array(
          z.string()
        )
        .optional(),

    dietary:
      z
        .array(
          z.string()
        )
        .optional(),

    available:
      z.boolean(),

    stock:
      z
        .number()
        .int()
        .nonnegative()
        .nullable()
        .optional(),

    preparationTime:
      z
        .number()
        .int()
        .nonnegative()
        .optional(),

    displayOrder:
      z
        .number()
        .int()
        .nonnegative()
        .optional(),

    featured:
      z
        .boolean()
        .optional(),

    dailySpecial:
      z
        .boolean()
        .optional(),

    active:
      z
        .boolean()
        .optional(),
  });

/*
 * ==========================================================
 * ESQUEMAS INTERNOS / LEGACY
 * ==========================================================
 */

export const CreateProductSchema =
  ProductSchema.required({
    establishmentId:
      true,

    categoryId:
      true,

    name:
      true,

    price:
      true,

    available:
      true,
  });

export const UpdateProductSchema =
  ProductSchema.partial();

/*
 * ==========================================================
 * ESQUEMAS ADMINISTRATIVOS
 * ==========================================================
 *
 * IMPORTANTE:
 *
 * El frontend administrativo NO puede enviar establishmentId.
 *
 * El establecimiento se obtiene exclusivamente del JWT.
 */

export const AdminCreateProductSchema =
  ProductSchema
    .omit({
      establishmentId:
        true,
    })
    .required({
      categoryId:
        true,

      name:
        true,

      price:
        true,

      available:
        true,
    });

export const AdminUpdateProductSchema =
  ProductSchema
    .omit({
      establishmentId:
        true,
    })
    .partial();

export type ProductInput =
  z.infer<
    typeof CreateProductSchema
  >;

export type UpdateProductInput =
  z.infer<
    typeof UpdateProductSchema
  >;

export type AdminCreateProductInput =
  z.infer<
    typeof AdminCreateProductSchema
  >;

export type AdminUpdateProductInput =
  z.infer<
    typeof AdminUpdateProductSchema
  >;