import { z } from 'zod';

export const CategoryCreateSchema = z.object({
  menuId: z.number().int().positive(),

  name: z.record(
    z.string(),
    z.string()
  ),

  description: z
    .record(
      z.string(),
      z.string()
    )
    .optional()
    .default({}),

  displayOrder: z.number().int().nonnegative().default(0),

  active: z.boolean().default(true),
});

export const CategoryUpdateSchema = z.object({
  menuId: z.number().int().positive().optional(),

  name: z.record(
    z.string(),
    z.string()
  ).optional(),

  description: z
    .record(
      z.string(),
      z.string()
    )
    .optional(),

  displayOrder: z.number().int().nonnegative().optional(),

  active: z.boolean().optional(),
});

export type CategoryCreateInput = z.infer<
  typeof CategoryCreateSchema
>;

export type CategoryUpdateInput = z.infer<
  typeof CategoryUpdateSchema
>;
