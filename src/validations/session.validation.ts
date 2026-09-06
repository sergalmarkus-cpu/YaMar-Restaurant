import { z } from 'zod';

export const SessionSchema = z.object({
  tableId: z.number().int().positive(),

  establishmentId: z.number().int().positive(),

  customerName: z.string().optional(),

  customerEmail: z.string().email().optional(),

  customerPhone: z.string().optional(),

  roomNumber: z.string().optional(),

  latitude: z
  .string()
  .optional(),

longitude: z
  .string()
  .optional(),

  deviceId: z.string().optional(),

  language: z.string().default('es'),

  active: z.boolean().default(true),
});

export type SessionInput = z.infer<
  typeof SessionSchema
>;