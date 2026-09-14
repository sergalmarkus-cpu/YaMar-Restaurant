import type {
  Language,
} from "@/types";

export interface AdminLanguageOption {
  code: Language;
  label: string;
  shortLabel: string;
  locale: string;
}

export const ADMIN_LANGUAGES: AdminLanguageOption[] = [
  {
    code:
      "es",
    label:
      "Español",
    shortLabel:
      "ES",
    locale:
      "es-ES",
  },
  {
    code:
      "en",
    label:
      "English",
    shortLabel:
      "EN",
    locale:
      "en-GB",
  },
  {
    code:
      "de",
    label:
      "Deutsch",
    shortLabel:
      "DE",
    locale:
      "de-DE",
  },
  {
    code:
      "fr",
    label:
      "Français",
    shortLabel:
      "FR",
    locale:
      "fr-FR",
  },
  {
    code:
      "it",
    label:
      "Italiano",
    shortLabel:
      "IT",
    locale:
      "it-IT",
  },
  {
    code:
      "pt",
    label:
      "Português",
    shortLabel:
      "PT",
    locale:
      "pt-PT",
  },
];

export const ADMIN_LANGUAGE_LOCALES: Record<
  Language,
  string
> = {
  es:
    "es-ES",
  en:
    "en-GB",
  de:
    "de-DE",
  fr:
    "fr-FR",
  it:
    "it-IT",
  pt:
    "pt-PT",
};