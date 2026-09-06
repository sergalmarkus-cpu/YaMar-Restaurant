import { z } from "zod";

const TranslatedTextSchema =
  z
    .record(
      z.string(),
      z.string()
    )
    .refine(
      (value) =>
        Object.keys(value).length > 0,
      {
        message:
          "Debe existir al menos una traducción.",
      }
    );

export const PromotionConditionsSchema =
  z
    .object({
      minAmount:
        z
          .string()
          .regex(
            /^\d+(\.\d{1,2})?$/,
            "El importe mínimo debe tener un formato válido."
          )
          .optional(),

      productIds:
        z
          .array(
            z
              .number()
              .int()
              .positive()
          )
          .optional(),

      categoryIds:
        z
          .array(
            z
              .number()
              .int()
              .positive()
          )
          .optional(),

      menuIds:
        z
          .array(
            z
              .number()
              .int()
              .positive()
          )
          .optional(),
    })
    /*
     * Permitimos campos futuros dentro de
     * conditions sin romper el contrato actual.
     */
    .catchall(
      z.unknown()
    );

const promotionFields = {
  name:
    TranslatedTextSchema,

  description:
    TranslatedTextSchema
      .nullable()
      .optional(),

  code:
    z
      .string()
      .trim()
      .min(1)
      .max(100)
      .nullable()
      .optional(),

  discountType:
    z.enum([
      "percentage",
      "fixed",
      "free_item",
    ]),

  discountValue:
    z
      .string()
      .regex(
        /^\d+(\.\d{1,2})?$/,
        "El descuento debe tener un formato válido."
      ),

  conditions:
    PromotionConditionsSchema
      .nullable()
      .optional(),

  startDate:
    z.coerce.date(),

  endDate:
    z.coerce.date(),

  usageLimit:
    z
      .number()
      .int()
      .positive()
      .nullable()
      .optional(),

  active:
    z
      .boolean()
      .optional()
      .default(true),
};

export const PromotionCreateSchema =
  z
    .object(
      promotionFields
    )
    .superRefine(
      (
        data,
        ctx
      ) => {
        if (
          data.endDate <=
          data.startDate
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "endDate",
            ],
            message:
              "La fecha de fin debe ser posterior a la fecha de inicio.",
          });
        }

        const discountValue =
          Number(
            data.discountValue
          );

        if (
          data.discountType ===
            "percentage" &&
          (
            discountValue <=
              0 ||
            discountValue >
              100
          )
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "discountValue",
            ],
            message:
              "El descuento porcentual debe ser mayor que 0 y no superar el 100%.",
          });
        }

        if (
          data.discountType ===
            "fixed" &&
          discountValue <=
            0
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "discountValue",
            ],
            message:
              "El descuento fijo debe ser mayor que cero.",
          });
        }
      }
    );

export const PromotionUpdateSchema =
  z
    .object({
      name:
        promotionFields.name
          .optional(),

      description:
        promotionFields.description,

      code:
        promotionFields.code,

      discountType:
        promotionFields.discountType
          .optional(),

      discountValue:
        promotionFields.discountValue
          .optional(),

      conditions:
        promotionFields.conditions,

      startDate:
        promotionFields.startDate
          .optional(),

      endDate:
        promotionFields.endDate
          .optional(),

      usageLimit:
        promotionFields.usageLimit,

      active:
        z
          .boolean()
          .optional(),
    });

export type PromotionCreateInput =
  z.infer<
    typeof PromotionCreateSchema
  >;

export type PromotionUpdateInput =
  z.infer<
    typeof PromotionUpdateSchema
  >;

export type PromotionConditions =
  z.infer<
    typeof PromotionConditionsSchema
  >;