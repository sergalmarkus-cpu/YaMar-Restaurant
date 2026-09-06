import { z } from "zod";

export const userRoleSchema = z.enum([
  "admin",
  "manager",
  "waiter",
  "kitchen",
  "bar",
  "cashier",
]);

export const createUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .transform((value) =>
      value.toLowerCase()
    ),

  password: z
    .string()
    .min(8)
    .max(128),

  name: z
    .string()
    .trim()
    .min(1)
    .max(120),

  role: userRoleSchema,

  phone: z
    .string()
    .trim()
    .max(50)
    .optional()
    .nullable(),

  avatar: z
    .string()
    .trim()
    .max(2048)
    .optional()
    .nullable(),

  active: z
    .boolean()
    .optional(),
});

export const updateUserSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email()
      .transform((value) =>
        value.toLowerCase()
      )
      .optional(),

    password: z
      .string()
      .min(8)
      .max(128)
      .optional(),

    name: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .optional(),

    role: userRoleSchema.optional(),

    phone: z
      .string()
      .trim()
      .max(50)
      .nullable()
      .optional(),

    avatar: z
      .string()
      .trim()
      .max(2048)
      .nullable()
      .optional(),

    active: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) =>
      Object.keys(data).length > 0,
    {
      message:
        "At least one field is required",
    }
  );

export type CreateUserInput =
  z.infer<typeof createUserSchema>;

export type UpdateUserInput =
  z.infer<typeof updateUserSchema>;