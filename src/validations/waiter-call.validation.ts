import { z } from "zod";

export const waiterCallTypeSchema = z.enum([
  "waiter",
  "water",
  "cutlery",
  "napkins",
  "ice",
  "help",
  "bill",
]);

export const waiterCallStatusSchema = z.enum([
  "pending",
  "acknowledged",
  "resolved",
]);

export const createWaiterCallSchema = z.object({
  sessionId: z.string().uuid(),
  type: waiterCallTypeSchema,
  message: z
    .string()
    .trim()
    .max(500, "El mensaje no puede superar los 500 caracteres")
    .optional(),
  latitude: z
    .string()
    .trim()
    .optional(),
  longitude: z
    .string()
    .trim()
    .optional(),
});

export const updateWaiterCallSchema = z.object({
  status: z.enum(["acknowledged", "resolved"]),
});

export type WaiterCallType = z.infer<typeof waiterCallTypeSchema>;
export type WaiterCallStatus = z.infer<typeof waiterCallStatusSchema>;
export type CreateWaiterCallInput = z.infer<
  typeof createWaiterCallSchema
>;
export type UpdateWaiterCallInput = z.infer<
  typeof updateWaiterCallSchema
>;
