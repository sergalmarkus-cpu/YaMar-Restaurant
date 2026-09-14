import {
  create,
} from "zustand";

import {
  persist,
} from "zustand/middleware";

import type {
  Language,
} from "@/types";

interface AdminLanguageState {
  language: Language;

  setLanguage: (
    language: Language
  ) => void;
}

export const useAdminLanguageStore =
  create<AdminLanguageState>()(
    persist(
      (
        set
      ) => ({
        language:
          "es",

        setLanguage: (
          language
        ) =>
          set({
            language,
          }),
      }),
      {
        name:
          "yamar-admin-language",
      }
    )
  );