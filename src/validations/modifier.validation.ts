import { z } from 'zod';

export const ModifierCreateSchema = z.object({
  productId: z
    .number()
    .int()
    .positive(),

  name: z.record(
    z.string(),
    z.string()
  ),

  type: z.enum([
    'add',
    'remove',
    'replace',
  ]),

  price: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      'El precio debe tener un formato válido.'
    )
    .default('0'),

  active: z
    .boolean()
    .optional()
    .default(true),
});

export const ModifierUpdateSchema =
  ModifierCreateSchema.partial();

export type ModifierCreateInput =
  z.infer<typeof ModifierCreateSchema>;

export type ModifierUpdateInput =
  z.infer<typeof ModifierUpdateSchema>;