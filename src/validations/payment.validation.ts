import { z } from "zod";

export const PaymentStatusSchema =
  z.enum([
    "pending",
    "partial",
    "paid",
    "refunded",
  ]);

export const PaymentMethodSchema =
  z.enum([
    "card",
    "cash",
    "transfer",
    "paypal",
    "apple_pay",
    "google_pay",
  ]);

export const PaymentSchema =
  z.object({
    sessionId:
      z.string().uuid(),

    /*
     * Compatibilidad temporal.
     *
     * El backend NO utilizará este campo como
     * fuente de autoridad. El establecimiento
     * se obtendrá siempre de la sesión.
     */
    establishmentId:
      z
        .number()
        .int()
        .positive()
        .optional(),

    billSplitId:
      z
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),

    amount:
      z
        .string()
        .regex(
          /^\d+(\.\d{1,2})?$/
        ),

    method:
      PaymentMethodSchema,

    stripePaymentIntentId:
      z
        .string()
        .nullable()
        .optional(),

    transactionId:
      z
        .string()
        .nullable()
        .optional(),

    receiptUrl:
      z
        .string()
        .nullable()
        .optional(),

    metadata:
      z
        .record(
          z.string(),
          z.any()
        )
        .optional(),
  });

export const PaymentUpdateSchema =
  z.object({
    status:
      PaymentStatusSchema
        .optional(),

    stripePaymentIntentId:
      z
        .string()
        .nullable()
        .optional(),

    transactionId:
      z
        .string()
        .nullable()
        .optional(),

    receiptUrl:
      z
        .string()
        .nullable()
        .optional(),

    metadata:
      z
        .record(
          z.string(),
          z.any()
        )
        .optional(),
  });

export type PaymentInput =
  z.infer<
    typeof PaymentSchema
  >;

export type PaymentUpdateInput =
  z.infer<
    typeof PaymentUpdateSchema
  >;