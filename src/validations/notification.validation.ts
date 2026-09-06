import { z } from "zod";

export const NotificationCreateSchema =
  z.object({
    userId:
      z
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),

    type:
      z
        .string()
        .trim()
        .min(1)
        .max(100),

    title:
      z
        .string()
        .trim()
        .min(1)
        .max(255),

    message:
      z
        .string()
        .trim()
        .min(1),

    data:
      z
        .record(
          z.string(),
          z.unknown()
        )
        .nullable()
        .optional(),

    read:
      z
        .boolean()
        .optional()
        .default(false),
  });

export const NotificationUpdateSchema =
  z.object({
    userId:
      z
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),

    type:
      z
        .string()
        .trim()
        .min(1)
        .max(100)
        .optional(),

    title:
      z
        .string()
        .trim()
        .min(1)
        .max(255)
        .optional(),

    message:
      z
        .string()
        .trim()
        .min(1)
        .optional(),

    data:
      z
        .record(
          z.string(),
          z.unknown()
        )
        .nullable()
        .optional(),

    read:
      z
        .boolean()
        .optional(),
  });

export type NotificationCreateInput =
  z.infer<
    typeof NotificationCreateSchema
  >;

export type NotificationUpdateInput =
  z.infer<
    typeof NotificationUpdateSchema
  >;