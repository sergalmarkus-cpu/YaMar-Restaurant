import type {
  Language,
} from "@/types";

export const SUPPORTED_LANGUAGES = [
  {
    code: "es",
    name: "Español",
    nativeName: "Español",
  },
  {
    code: "en",
    name: "Inglés",
    nativeName: "English",
  },
  {
    code: "de",
    name: "Alemán",
    nativeName: "Deutsch",
  },
  {
    code: "fr",
    name: "Francés",
    nativeName: "Français",
  },
  {
    code: "it",
    name: "Italiano",
    nativeName: "Italiano",
  },
  {
    code: "pt",
    name: "Portugués",
    nativeName: "Português",
  },
] as const satisfies readonly {
  code: Language;
  name: string;
  nativeName: string;
}[];

export const SUPPORTED_LANGUAGE_CODES =
  SUPPORTED_LANGUAGES.map(
    (language) =>
      language.code
  ) as Language[];

export function isSupportedLanguage(
  value: unknown
): value is Language {
  return (
    typeof value ===
      "string" &&
    SUPPORTED_LANGUAGE_CODES.includes(
      value as Language
    )
  );
}