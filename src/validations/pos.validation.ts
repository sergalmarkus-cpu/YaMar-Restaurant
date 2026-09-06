import { z } from "zod";

const LatitudeSchema =
  z.coerce
    .number()
    .min(-90)
    .max(90);

const LongitudeSchema =
  z.coerce
    .number()
    .min(-180)
    .max(180);

export const PosCreateSchema =
  z.object({
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
        .nullable()
        .optional(),

    latitude:
      LatitudeSchema,

    longitude:
      LongitudeSchema,

    radius:
      z
        .number()
        .int()
        .positive()
        .max(10000)
        .default(50),

    menus:
      z
        .array(
          z
            .number()
            .int()
            .positive()
        )
        .default([]),

    active:
      z
        .boolean()
        .default(true),
  });

export const PosUpdateSchema =
  z.object({
    name:
      z
        .record(
          z.string(),
          z.string()
        )
        .optional(),

    description:
      z
        .record(
          z.string(),
          z.string()
        )
        .nullable()
        .optional(),

    latitude:
      LatitudeSchema
        .optional(),

    longitude:
      LongitudeSchema
        .optional(),

    radius:
      z
        .number()
        .int()
        .positive()
        .max(10000)
        .optional(),

    menus:
      z
        .array(
          z
            .number()
            .int()
            .positive()
        )
        .optional(),

    active:
      z
        .boolean()
        .optional(),
  });

export const PosNearbyQuerySchema =
  z.object({
    latitude:
      LatitudeSchema,

    longitude:
      LongitudeSchema,
  });

export type PosCreateInput =
  z.infer<
    typeof PosCreateSchema
  >;

export type PosUpdateInput =
  z.infer<
    typeof PosUpdateSchema
  >;