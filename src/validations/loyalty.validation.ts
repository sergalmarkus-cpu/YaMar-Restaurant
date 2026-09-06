import { z } from "zod";

const MoneySchema =
  z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "El importe debe tener un formato válido."
    );

export const LoyaltyCreateSchema =
  z.object({
    sessionId:
      z.string().uuid(),

    customerEmail:
      z
        .string()
        .trim()
        .email(
          "El email del cliente no es válido."
        ),

    points:
      z
        .number()
        .int()
        .nonnegative()
        .default(0),

    totalSpent:
      MoneySchema
        .default("0.00"),

    lastVisit:
      z.coerce
        .date()
        .optional(),
  });

export const LoyaltyUpdateSchema =
  z.object({
    sessionId:
      z
        .string()
        .uuid()
        .optional(),

    customerEmail:
      z
        .string()
        .trim()
        .email(
          "El email del cliente no es válido."
        )
        .optional(),

    points:
      z
        .number()
        .int()
        .nonnegative()
        .optional(),

    totalSpent:
      MoneySchema
        .optional(),

    lastVisit:
      z.coerce
        .date()
        .nullable()
        .optional(),
  });

export type LoyaltyCreateInput =
  z.infer<
    typeof LoyaltyCreateSchema
  >;

export type LoyaltyUpdateInput =
  z.infer<
    typeof LoyaltyUpdateSchema
  >;