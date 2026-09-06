import { z } from "zod";

export const ReceiptSchema =
  z.object({
    sessionId:
      z.string().uuid(),

    /*
     * Compatibilidad temporal.
     *
     * El backend no utiliza este valor como
     * fuente de autoridad. El establecimiento
     * real se obtiene de la sesión.
     */
    establishmentId:
      z
        .number()
        .int()
        .positive()
        .optional(),

    receiptNumber:
      z.string().min(1),

    pdfUrl:
      z.string().min(1),

    emailSent:
      z
        .boolean()
        .default(false),

    total:
      z
        .string()
        .regex(
          /^\d+(\.\d{1,2})?$/
        ),

    items:
      z
        .array(
          z.any()
        )
        .default([]),
  });

export const ReceiptUpdateSchema =
  z.object({
    pdfUrl:
      z
        .string()
        .min(1)
        .optional(),

    emailSent:
      z
        .boolean()
        .optional(),

    items:
      z
        .array(
          z.any()
        )
        .optional(),
  });

export type ReceiptInput =
  z.infer<
    typeof ReceiptSchema
  >;

export type ReceiptUpdateInput =
  z.infer<
    typeof ReceiptUpdateSchema
  >;