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

export const LanguageSettingsSchema =
  z
    .object({
      defaultLanguage:
        LanguageCodeSchema,

      enabledLanguages:
        z
          .array(
            LanguageCodeSchema
          )
          .min(
            1,
            "Debe haber al menos un idioma habilitado."
          ),
    })
    .superRefine(
      (
        data,
        ctx
      ) => {
        /*
         * No permitimos idiomas repetidos.
         */
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

        /*
         * El idioma predeterminado debe estar
         * necesariamente habilitado.
         */
        if (
          !data.enabledLanguages.includes(
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