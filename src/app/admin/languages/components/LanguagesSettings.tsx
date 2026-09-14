"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  Languages,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminAuthStore,
} from "@/auth/admin-auth.store";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import {
  ADMIN_LANGUAGES,
} from "@/config/admin-languages";

import {
  ADMIN_LANGUAGES_SETTINGS_I18N,
} from "@/config/admin-languages-settings-i18n";

import type {
  Language,
} from "@/types";

interface SupportedLanguage {
  code: Language;
  name?: string;
  nativeName?: string;
  label?: string;
}

interface LanguageSettingsResponse {
  establishmentId: number;
  defaultLanguage: Language;
  enabledLanguages: Language[];
  supportedLanguages: SupportedLanguage[];
}

const LANGUAGE_ORDER: Language[] = [
  "es",
  "en",
  "de",
  "fr",
  "it",
  "pt",
];

const LANGUAGE_LABELS: Record<
  Language,
  string
> = Object.fromEntries(
  ADMIN_LANGUAGES.map(
    (language) => [
      language.code,
      language.label,
    ]
  )
) as Record<
  Language,
  string
>;

function getLanguageLabel(
  language: SupportedLanguage
) {
  return (
    language.nativeName ||
    language.label ||
    language.name ||
    LANGUAGE_LABELS[
      language.code
    ] ||
    language.code.toUpperCase()
  );
}

export default function LanguagesSettings() {
  const user =
    useAdminAuthStore(
      (state) =>
        state.user
    );

  const adminLanguage =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const t =
    ADMIN_LANGUAGES_SETTINGS_I18N[
      adminLanguage
    ];

  const canEdit =
    user?.role ===
    "admin";

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    defaultLanguage,
    setDefaultLanguage,
  ] =
    useState<Language>(
      "es"
    );

  const [
    supportedLanguages,
    setSupportedLanguages,
  ] =
    useState<
      SupportedLanguage[]
    >([]);

  useEffect(() => {
    void loadSettings();
  }, []);

  async function loadSettings() {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response =
        await adminFetch(
          "/api/languages"
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            json.message ||
            t.loadError
        );

        return;
      }

      const data =
        json.data as LanguageSettingsResponse;

      if (
        LANGUAGE_ORDER.includes(
          data.defaultLanguage
        )
      ) {
        setDefaultLanguage(
          data.defaultLanguage
        );
      }

      setSupportedLanguages(
        Array.isArray(
          data.supportedLanguages
        )
          ? data.supportedLanguages
          : []
      );
    } catch (
      loadError
    ) {
      console.error(
        "Error loading language settings:",
        loadError
      );

      setError(
        t.loadError
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  const languages =
    useMemo(
      () => {
        const apiMap =
          new Map<
            Language,
            SupportedLanguage
          >();

        for (
          const language
          of supportedLanguages
        ) {
          if (
            language?.code &&
            LANGUAGE_ORDER.includes(
              language.code
            )
          ) {
            apiMap.set(
              language.code,
              language
            );
          }
        }

        return LANGUAGE_ORDER.map(
          (
            code
          ) =>
            apiMap.get(
              code
            ) ?? {
              code,
              nativeName:
                LANGUAGE_LABELS[
                  code
                ],
            }
        );
      },
      [
        supportedLanguages,
      ]
    );

  function changeDefaultLanguage(
    language: Language
  ) {
    if (
      !canEdit
    ) {
      return;
    }

    setError("");
    setSuccess("");

    setDefaultLanguage(
      language
    );
  }

  async function saveSettings() {
    if (
      !canEdit
    ) {
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response =
        await adminFetch(
          "/api/languages",
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                defaultLanguage,

                enabledLanguages:
                  LANGUAGE_ORDER,
              }),
          }
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            json.message ||
            t.saveError
        );

        return;
      }

      const data =
        json.data as LanguageSettingsResponse;

      setDefaultLanguage(
        data.defaultLanguage
      );

      if (
        Array.isArray(
          data.supportedLanguages
        )
      ) {
        setSupportedLanguages(
          data.supportedLanguages
        );
      }

      setSuccess(
        t.saveSuccess
      );
    } catch (
      saveError
    ) {
      console.error(
        "Error saving language settings:",
        saveError
      );

      setError(
        t.saveError
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  if (
    loading
  ) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            className="animate-spin"
            size={
              22
            }
          />

          <span>
            {t.loading}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <Languages
            size={
              28
            }
            className="text-indigo-600"
          />

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t.title}
            </h1>

            <p className="text-sm text-slate-500">
              {t.description}
            </p>
          </div>
        </div>
      </div>

      {!canEdit && (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <ShieldCheck
            size={
              20
            }
            className="mt-0.5 shrink-0"
          />

          <div>
            {t.readOnlyNotice}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="font-semibold text-slate-900">
            {t.availableTitle}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t.availableDescription}
          </p>
        </div>

        <div className="divide-y">
          {languages.map(
            (
              language
            ) => {
              const isDefault =
                language.code ===
                defaultLanguage;

              return (
                <div
                  key={
                    language.code
                  }
                  className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold uppercase text-slate-700">
                      {
                        language.code
                      }
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {
                            getLanguageLabel(
                              language
                            )
                          }
                        </span>

                        {isDefault && (
                          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                            {
                              t.defaultBadge
                            }
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {
                          t.codeLabel
                        }
                        :{" "}
                        {
                          language.code
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        changeDefaultLanguage(
                          language.code
                        )
                      }
                      disabled={
                        !canEdit ||
                        isDefault
                      }
                      className="rounded-lg border px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      {isDefault
                        ? t.defaultBadge
                        : t.useAsDefault}
                    </button>

                    <div className="inline-flex min-w-[105px] items-center justify-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 ring-1 ring-green-200">
                      <Check
                        size={
                          16
                        }
                      />

                      {
                        t.active
                      }
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          {t.summaryTitle}
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {
                t.defaultLanguageLabel
              }
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {
                LANGUAGE_LABELS[
                  defaultLanguage
                ]
              }
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {
                t.activeLanguagesLabel
              }
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {
                t.activeLanguagesValue
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            void saveSettings()
          }
          disabled={
            !canEdit ||
            saving
          }
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2
                size={
                  18
                }
                className="animate-spin"
              />

              {
                t.saving
              }
            </>
          ) : (
            <>
              <Save
                size={
                  18
                }
              />

              {
                t.saveChanges
              }
            </>
          )}
        </button>
      </div>
    </div>
  );
}