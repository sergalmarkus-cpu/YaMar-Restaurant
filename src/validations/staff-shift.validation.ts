import { z } from "zod";

export const staffShiftStatusSchema = z.enum([
  "scheduled",
  "completed",
  "cancelled",
]);

const notesSchema = z
  .string()
  .trim()
  .max(2000, "Las notas no pueden superar los 2000 caracteres.")
  .nullable()
  .optional();

export const createStaffShiftSchema = z
  .object({
    userId: z
      .number()
      .int()
      .positive("El usuario debe ser válido."),

    startAt: z.coerce.date(),

    endAt: z.coerce.date(),

    status: staffShiftStatusSchema
      .optional()
      .default("scheduled"),

    notes: notesSchema,
  })
  .superRefine((data, ctx) => {
    if (data.endAt <= data.startAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endAt"],
        message:
          "La fecha de fin debe ser posterior a la fecha de inicio.",
      });
    }
  });

export const updateStaffShiftSchema = z
  .object({
    userId: z
      .number()
      .int()
      .positive("El usuario debe ser válido.")
      .optional(),

    startAt: z.coerce
      .date()
      .optional(),

    endAt: z.coerce
      .date()
      .optional(),

    status: staffShiftStatusSchema
      .optional(),

    notes: notesSchema,
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "Debe existir al menos un campo para actualizar.",
    }
  );

export type StaffShiftStatus =
  z.infer<typeof staffShiftStatusSchema>;

export type CreateStaffShiftInput =
  z.infer<typeof createStaffShiftSchema>;

export type UpdateStaffShiftInput =
  z.infer<typeof updateStaffShiftSchema>;