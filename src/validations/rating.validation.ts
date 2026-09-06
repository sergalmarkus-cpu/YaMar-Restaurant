import { z } from "zod";

const ratingScoreSchema = z
  .number()
  .int()
  .min(1, "La valoración mínima es 1.")
  .max(5, "La valoración máxima es 5.");

export const CreateRatingSchema = z.object({
  sessionId: z.string().uuid(),

  foodRating: ratingScoreSchema,

  serviceRating: ratingScoreSchema,

  attentionRating: ratingScoreSchema,

  comment: z
    .string()
    .trim()
    .max(
      2000,
      "El comentario no puede superar los 2000 caracteres."
    )
    .optional(),

  photos: z
    .array(
      z
        .string()
        .trim()
        .min(1)
    )
    .max(
      10,
      "No se pueden adjuntar más de 10 fotos."
    )
    .default([]),
});

export const RatingModerationSchema = z.object({
  approved: z.boolean(),
});

export const RatingResponseSchema = z.object({
  response: z
    .string()
    .trim()
    .min(
      1,
      "La respuesta no puede estar vacía."
    )
    .max(
      2000,
      "La respuesta no puede superar los 2000 caracteres."
    ),
});

export type CreateRatingInput = z.infer<
  typeof CreateRatingSchema
>;

export type RatingModerationInput = z.infer<
  typeof RatingModerationSchema
>;

export type RatingResponseInput = z.infer<
  typeof RatingResponseSchema
>;