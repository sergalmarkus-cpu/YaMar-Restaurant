import { z } from "zod";

export const CreateTableSchema = z.object({
  areaId: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional(),

  code: z
    .string()
    .trim()
    .min(
      1,
      "El código de la mesa es obligatorio."
    )
    .max(
      50,
      "El código de la mesa no puede superar los 50 caracteres."
    ),

  capacity: z
    .number()
    .int()
    .positive()
    .max(
      100,
      "La capacidad máxima de una mesa es de 100 personas."
    ),

  active: z.boolean().default(true),
});

export const UpdateTableSchema =
  CreateTableSchema.partial();

export const TableSchema = CreateTableSchema;

export type TableInput =
  z.infer<typeof CreateTableSchema>;

export type UpdateTableInput =
  z.infer<typeof UpdateTableSchema>;