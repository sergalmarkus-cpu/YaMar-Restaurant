import { z } from "zod";

const optionalNullableString =
  z
    .string()
    .trim()
    .nullable()
    .optional();

const coordinateSchema =
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
      Number.isFinite,
      "La coordenada no es válida."
    )
    .nullable()
    .optional();

export const EstablishmentFeaturesSchema =
  z
    .object({
      geolocation:
        z
          .boolean()
          .optional(),

      onlinePayment:
        z
          .boolean()
          .optional(),

      splitBill:
        z
          .boolean()
          .optional(),

      ratings:
        z
          .boolean()
          .optional(),

      loyalty:
        z
          .boolean()
          .optional(),

      reservations:
        z
          .boolean()
          .optional(),

      callWaiter:
        z
          .boolean()
          .optional(),
    })
    .strict();

export const EstablishmentUpdateSchema =
  z
    .object({
      name:
        z
          .string()
          .trim()
          .min(
            1,
            "El nombre es obligatorio."
          )
          .max(150)
          .optional(),

      slug:
        z
          .string()
          .trim()
          .min(1)
          .max(150)
          .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "El slug solo puede contener letras minúsculas, números y guiones."
          )
          .optional(),

      description:
        optionalNullableString,

      address:
        optionalNullableString,

      phone:
        optionalNullableString,

      email:
        z
          .string()
          .trim()
          .email(
            "El email no es válido."
          )
          .nullable()
          .optional(),

      latitude:
        coordinateSchema,

      longitude:
        coordinateSchema,

      maxDeliveryDistance:
        z
          .number()
          .int()
          .positive()
          .max(100000)
          .optional(),

      geoFenceEnabled:
        z
          .boolean()
          .optional(),

      logo:
        optionalNullableString,

      primaryColor:
        z
          .string()
          .trim()
          .regex(
            /^#[0-9A-Fa-f]{6}$/,
            "El color primario debe tener formato hexadecimal."
          )
          .optional(),

      secondaryColor:
        z
          .string()
          .trim()
          .regex(
            /^#[0-9A-Fa-f]{6}$/,
            "El color secundario debe tener formato hexadecimal."
          )
          .optional(),

      currency:
        z
          .string()
          .trim()
          .length(
            3,
            "La moneda debe tener exactamente 3 caracteres."
          )
          .transform(
            (value) =>
              value.toUpperCase()
          )
          .optional(),

      timezone:
        z
          .string()
          .trim()
          .min(1)
          .max(100)
          .optional(),

      features:
        EstablishmentFeaturesSchema
          .optional(),

      active:
        z
          .boolean()
          .optional(),
    })
    .strict()
    .refine(
      (data) =>
        Object.keys(data).length >
        0,
      {
        message:
          "Debes indicar al menos un campo para actualizar.",
      }
    );

export type EstablishmentFeaturesInput =
  z.infer<
    typeof EstablishmentFeaturesSchema
  >;

export type EstablishmentUpdateInput =
  z.infer<
    typeof EstablishmentUpdateSchema
  >;