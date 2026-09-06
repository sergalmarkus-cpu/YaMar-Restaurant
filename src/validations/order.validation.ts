import { z } from "zod";

export const OrderModifierSchema = z.object({
  id: z
    .number()
    .int()
    .positive(),
});

export const OrderItemSchema = z.object({
  /*
   * El cliente únicamente identifica el producto.
   *
   * Nunca aceptamos desde el navegador:
   * - precio
   * - establishmentId
   * - datos completos del producto
   *
   * OrderService obtiene el producto real de PostgreSQL
   * y calcula el precio en servidor.
   */
  productId: z
    .number()
    .int()
    .positive(),

  quantity: z
    .number()
    .int()
    .positive(),

  modifiers: z
    .array(
      OrderModifierSchema
    )
    .optional(),

  notes: z
    .string()
    .optional(),
});

export const OrderSchema = z.object({
  /*
   * sessionId es la única autoridad necesaria
   * enviada por el cliente QR.
   *
   * tableId y establishmentId se obtienen
   * exclusivamente desde la sesión persistida.
   */
  sessionId: z.uuid(),

  notes: z
    .string()
    .optional(),

  items: z
    .array(
      OrderItemSchema
    )
    .min(1),
});

export type OrderInput = z.infer<
  typeof OrderSchema
>;

export const OrderUpdateSchema = z.object({
  status: z
    .enum([
      "pending",
      "accepted",
      "preparing",
      "ready",
      "delivering",
      "delivered",
      "cancelled",
    ])
    .optional(),

  notes: z
    .string()
    .optional(),

  tip: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/
    )
    .optional(),

  latitude: z
    .string()
    .optional(),

  longitude: z
    .string()
    .optional(),

  estimatedTime: z
    .number()
    .int()
    .positive()
    .optional(),

  acceptedBy: z
    .number()
    .int()
    .positive()
    .optional(),

  deliveredBy: z
    .number()
    .int()
    .positive()
    .optional(),
});

export type OrderUpdateInput = z.infer<
  typeof OrderUpdateSchema
>;