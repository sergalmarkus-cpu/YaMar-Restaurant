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

const FALLBACK_LANGUAGE_LABELS: Record<
  Language,
  string
> = {
  es: "Español",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
};

const LANGUAGE_ORDER: Language[] = [
  "es",
  "en",
  "de",
  "fr",
  "it",
  "pt",
];

function getLanguageLabel(
  language: SupportedLanguage
) {
  return (
    language.nativeName ||
    language.label ||
    language.name ||
    FALLBACK_LANGUAGE_LABELS[
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
    enabledLanguages,
    setEnabledLanguages,
  ] =
    useState<Language[]>([
      "es",
    ]);

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
            "No se pudo cargar la configuración de idiomas."
        );

        return;
      }

      const data =
        json.data as LanguageSettingsResponse;

      setDefaultLanguage(
        data.defaultLanguage
      );

      setEnabledLanguages(
        data.enabledLanguages
      );

      setSupportedLanguages(
        Array.isArray(
          data.supportedLanguages
        )
          ? data.supportedLanguages
          : []
      );
    } catch (
      error
    ) {
      console.error(
        "Error loading language settings:",
        error
      );

      setError(
        "No se pudo cargar la configuración de idiomas."
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
        const fromApi =
          supportedLanguages
            .filter(
              (
                language
              ): language is SupportedLanguage =>
                Boolean(
                  language &&
                    language.code
                )
            )
            .sort(
              (
                a,
                b
              ) =>
                LANGUAGE_ORDER.indexOf(
                  a.code
                ) -
                LANGUAGE_ORDER.indexOf(
                  b.code
                )
            );

        if (
          fromApi.length >
          0
        ) {
          return fromApi;
        }

        return LANGUAGE_ORDER.map(
          (
            code
          ) => ({
            code,
            nativeName:
              FALLBACK_LANGUAGE_LABELS[
                code
              ],
          })
        );
      },
      [
        supportedLanguages,
      ]
    );

  function isEnabled(
    language: Language
  ) {
    return enabledLanguages.includes(
      language
    );
  }

  function toggleLanguage(
    language: Language
  ) {
    if (
      !canEdit
    ) {
      return;
    }

    setError("");
    setSuccess("");

    if (
      language ===
      defaultLanguage
    ) {
      setError(
        "El idioma predeterminado no puede desactivarse."
      );

      return;
    }

    setEnabledLanguages(
      (
        current
      ) => {
        if (
          current.includes(
            language
          )
        ) {
          return current.filter(
            (
              item
            ) =>
              item !==
              language
          );
        }

        return [
          ...current,
          language,
        ];
      }
    );
  }

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

    setEnabledLanguages(
      (
        current
      ) => {
        if (
          current.includes(
            language
          )
        ) {
          return current;
        }

        return [
          ...current,
          language,
        ];
      }
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
      const orderedEnabled =
        LANGUAGE_ORDER.filter(
          (
            language
          ) =>
            enabledLanguages.includes(
              language
            )
        );

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
                  orderedEnabled,
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
            "No se pudo guardar la configuración de idiomas."
        );

        return;
      }

      const data =
        json.data as LanguageSettingsResponse;

      setDefaultLanguage(
        data.defaultLanguage
      );

      setEnabledLanguages(
        data.enabledLanguages
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
        "Configuración de idiomas guardada correctamente."
      );
    } catch (
      error
    ) {
      console.error(
        "Error saving language settings:",
        error
      );

      setError(
        "No se pudo guardar la configuración de idiomas."
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
            Cargando configuración de idiomas...
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
              Idiomas
            </h1>

            <p className="text-sm text-slate-500">
              Configura los idiomas disponibles para los clientes del establecimiento.
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
            Puedes consultar la configuración de idiomas, pero solo un administrador puede modificarla.
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
            Idiomas disponibles
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Activa únicamente los idiomas que quieras ofrecer en la interfaz del cliente.
          </p>
        </div>

        <div className="divide-y">

          {languages.map(
            (
              language
            ) => {
              const enabled =
                isEnabled(
                  language.code
                );

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
                            Predeterminado
                          </span>
                        )}

                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Código:{" "}
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
                        ? "Predeterminado"
                        : "Usar como predeterminado"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleLanguage(
                          language.code
                        )
                      }
                      disabled={
                        !canEdit ||
                        isDefault
                      }
                      aria-pressed={
                        enabled
                      }
                      className={`inline-flex min-w-[105px] items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        enabled
                          ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                      } ${
                        !canEdit ||
                        isDefault
                          ? "cursor-not-allowed opacity-70"
                          : "hover:opacity-80"
                      }`}
                    >
                      {enabled && (
                        <Check
                          size={
                            16
                          }
                        />
                      )}

                      {enabled
                        ? "Activo"
                        : "Inactivo"}
                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="font-semibold text-slate-900">
          Resumen
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Idioma predeterminado
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {
                FALLBACK_LANGUAGE_LABELS[
                  defaultLanguage
                ]
              }
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Idiomas activos
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {
                enabledLanguages.length
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

              Guardando...
            </>
          ) : (
            <>
              <Save
                size={
                  18
                }
              />

              Guardar cambios
            </>
          )}
        </button>

      </div>

    </div>
  );
}