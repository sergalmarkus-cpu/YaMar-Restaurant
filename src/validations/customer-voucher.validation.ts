import { z } from "zod";

const MoneySchema =
  z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/
    );

export const CustomerVoucherCreateSchema =
  z
    .object({
      voucherId:
        z
          .number()
          .int()
          .positive(),

      customerEmail:
        z
          .string()
          .trim()
          .email()
          .nullable()
          .optional(),

      roomNumber:
        z
          .string()
          .trim()
          .min(1)
          .nullable()
          .optional(),

      creditsUsed:
        MoneySchema
          .default("0.00"),

      creditsRemaining:
        MoneySchema,

      active:
        z
          .boolean()
          .default(true),
    })
    .refine(
      (data) =>
        Boolean(
          data.customerEmail ||
          data.roomNumber
        ),
      {
        message:
          "Debe indicarse customerEmail o roomNumber.",
      }
    );

export const CustomerVoucherUpdateSchema =
  z.object({
    customerEmail:
      z
        .string()
        .trim()
        .email()
        .nullable()
        .optional(),

    roomNumber:
      z
        .string()
        .trim()
        .min(1)
        .nullable()
        .optional(),

    creditsUsed:
      MoneySchema
        .optional(),

    creditsRemaining:
      MoneySchema
        .optional(),

    active:
      z
        .boolean()
        .optional(),
  });

export type CustomerVoucherCreateInput =
  z.infer<
    typeof CustomerVoucherCreateSchema
  >;

export type CustomerVoucherUpdateInput =
  z.infer<
    typeof CustomerVoucherUpdateSchema
  >;