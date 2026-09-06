import { z } from 'zod';

export const BillSplitTypeSchema = z.enum([
  'equal',
  'percentage',
  'custom',
  'items',
]);

export const BillSplitSchema = z.object({
  sessionId: z.string().uuid(),

  splitType: BillSplitTypeSchema,

  splits: z
    .array(z.record(z.string(), z.any()))
    .min(1),
});

export type BillSplitInput = z.infer<
  typeof BillSplitSchema
>;
