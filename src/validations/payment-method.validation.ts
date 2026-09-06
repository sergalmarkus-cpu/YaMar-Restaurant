import {
  z,
} from "zod";

export const PaymentMethodUpdateSchema =
  z
    .object({
      enabled:
        z
          .boolean()
          .optional(),

      displayName:
        z
          .string()
          .trim()
          .min(1)
          .max(80)
          .nullable()
          .optional(),

      sortOrder:
        z
          .number()
          .int()
          .min(0)
          .max(100)
          .optional(),
    })
    .refine(
      (
        data
      ) =>
        Object.keys(
          data
        ).length >
        0,
      {
        message:
          "Debes indicar al menos un campo para actualizar.",
      }
    );

export type PaymentMethodUpdateInput =
  z.infer<
    typeof PaymentMethodUpdateSchema
  >;