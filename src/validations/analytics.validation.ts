import { z } from "zod";

export const AnalyticsEventCreateSchema =
  z.object({
    eventType:
      z
        .string()
        .trim()
        .min(
          1,
          "El tipo de evento es obligatorio."
        )
        .max(100),

    eventData:
      z
        .unknown()
        .nullable()
        .optional(),

    sessionId:
      z
        .string()
        .uuid()
        .nullable()
        .optional(),

    userId:
      z
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),
  });

export type AnalyticsEventCreateInput =
  z.infer<
    typeof AnalyticsEventCreateSchema
  >;