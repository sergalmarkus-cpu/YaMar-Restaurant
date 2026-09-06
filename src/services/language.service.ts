import {
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  establishments,
} from "@/db/schema";

import type {
  Language,
} from "@/types";

import type {
  LanguageSettingsInput,
} from "@/validations/language.validation";

interface LanguageSettings {
  establishmentId: number;
  defaultLanguage: Language;
  enabledLanguages: Language[];
}

export class LanguageService {
  static async getForEstablishment(
    establishmentId: number
  ): Promise<LanguageSettings | null> {
    const rows =
      await db
        .select({
          establishmentId:
            establishments.id,

          defaultLanguage:
            establishments.defaultLanguage,

          enabledLanguages:
            establishments.enabledLanguages,
        })
        .from(
          establishments
        )
        .where(
          eq(
            establishments.id,
            establishmentId
          )
        )
        .limit(1);

    const row =
      rows[0];

    if (
      !row
    ) {
      return null;
    }

    return {
      establishmentId:
        row.establishmentId,

      defaultLanguage:
        row.defaultLanguage as Language,

      enabledLanguages:
        row.enabledLanguages as Language[],
    };
  }

  static async updateForEstablishment(
    establishmentId: number,
    data: LanguageSettingsInput
  ): Promise<LanguageSettings | null> {
    const updated =
      await db
        .update(
          establishments
        )
        .set({
          defaultLanguage:
            data.defaultLanguage,

          enabledLanguages:
            data.enabledLanguages,

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            establishments.id,
            establishmentId
          )
        )
        .returning({
          establishmentId:
            establishments.id,

          defaultLanguage:
            establishments.defaultLanguage,

          enabledLanguages:
            establishments.enabledLanguages,
        });

    const row =
      updated[0];

    if (
      !row
    ) {
      return null;
    }

    return {
      establishmentId:
        row.establishmentId,

      defaultLanguage:
        row.defaultLanguage as Language,

      enabledLanguages:
        row.enabledLanguages as Language[],
    };
  }
}