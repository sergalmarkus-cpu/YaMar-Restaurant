import {
  z,
} from "zod";

export const LanguageCodeSchema =
  z.enum([
    "es",
    "en",
    "de",
    "fr",
    "it",
    "pt",
  ]);

export const ALL_LANGUAGE_CODES = [
  "es",
  "en",
  "de",
  "fr",
  "it",
  "pt",
] as const;

export const LanguageSettingsSchema =
  z
    .object({
      defaultLanguage:
        LanguageCodeSchema,

      enabledLanguages:
        z.array(
          LanguageCodeSchema
        ),
    })
    .superRefine(
      (
        data,
        ctx
      ) => {
        const unique =
          new Set(
            data.enabledLanguages
          );

        if (
          unique.size !==
          data.enabledLanguages.length
        ) {
          ctx.addIssue({
            code:
              "custom",

            path: [
              "enabledLanguages",
            ],

            message:
              "No puede haber idiomas duplicados.",
          });
        }

        const allLanguagesEnabled =
          ALL_LANGUAGE_CODES.every(
            (
              language
            ) =>
              unique.has(
                language
              )
          ) &&
          unique.size ===
            ALL_LANGUAGE_CODES.length;

        if (
          !allLanguagesEnabled
        ) {
          ctx.addIssue({
            code:
              "custom",

            path: [
              "enabledLanguages",
            ],

            message:
              "Los seis idiomas compatibles deben permanecer habilitados.",
          });
        }

        if (
          !unique.has(
            data.defaultLanguage
          )
        ) {
          ctx.addIssue({
            code:
              "custom",

            path: [
              "defaultLanguage",
            ],

            message:
              "El idioma predeterminado debe estar habilitado.",
          });
        }
      }
    );

export type LanguageSettingsInput =
  z.infer<
    typeof LanguageSettingsSchema
  >;