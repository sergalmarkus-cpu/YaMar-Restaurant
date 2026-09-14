"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Check,
  ChevronDown,
  Globe2,
  Loader2,
} from "lucide-react";

import {
  useAdminAuthStore,
  type AdminUser,
} from "@/auth/admin-auth.store";

import {
  ADMIN_LANGUAGES,
} from "@/config/admin-languages";

import {
  ADMIN_LOGIN_MESSAGES,
  type AdminLoginMessages,
} from "@/config/admin-login-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import type {
  Language,
} from "@/types";

interface LoginApiResponse {
  success: boolean;

  data?: {
    user?: unknown;
    accessToken?: unknown;
    refreshToken?: unknown;
  };

  error?: string;
}

const ADMIN_ROLES: AdminUser["role"][] = [
  "admin",
  "manager",
  "waiter",
  "kitchen",
  "bar",
  "cashier",
];

function isAdminRole(
  value: unknown
): value is AdminUser["role"] {
  return (
    typeof value ===
      "string" &&
    ADMIN_ROLES.includes(
      value as AdminUser["role"]
    )
  );
}

function isAdminUser(
  value: unknown
): value is AdminUser {
  if (
    typeof value !==
      "object" ||
    value ===
      null
  ) {
    return false;
  }

  const candidate =
    value as Record<
      string,
      unknown
    >;

  return (
    typeof candidate.id ===
      "number" &&
    Number.isInteger(
      candidate.id
    ) &&
    candidate.id >
      0 &&
    typeof candidate.establishmentId ===
      "number" &&
    Number.isInteger(
      candidate.establishmentId
    ) &&
    candidate.establishmentId >
      0 &&
    typeof candidate.email ===
      "string" &&
    candidate.email.trim().length >
      0 &&
    typeof candidate.name ===
      "string" &&
    candidate.name.trim().length >
      0 &&
    isAdminRole(
      candidate.role
    )
  );
}

function getLoginErrorMessage(
  responseStatus: number,
  apiError: string | undefined,
  messages: AdminLoginMessages
) {
  if (
    responseStatus === 401 ||
    apiError ===
      "Invalid email or password"
  ) {
    return messages.errors.invalidCredentials;
  }

  if (
    responseStatus === 403 ||
    apiError ===
      "User account is inactive"
  ) {
    return messages.errors.inactiveUser;
  }

  if (
    responseStatus >= 500 ||
    apiError ===
      "Internal server error"
  ) {
    return messages.errors.server;
  }

  return messages.errors.generic;
}

function isValidEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}

export default function AdminLoginPage() {
  const router =
    useRouter();

  const languageRef =
    useRef<HTMLDivElement>(
      null
    );

  const setSession =
    useAdminAuthStore(
      (
        state
      ) =>
        state.setSession
    );

  const language =
    useAdminLanguageStore(
      (
        state
      ) =>
        state.language
    );

  const setLanguage =
    useAdminLanguageStore(
      (
        state
      ) =>
        state.setLanguage
    );

  const messages =
    ADMIN_LOGIN_MESSAGES[
      language
    ];

  const currentLanguage =
    useMemo(
      () =>
        ADMIN_LANGUAGES.find(
          (
            option
          ) =>
            option.code ===
            language
        ) ??
        ADMIN_LANGUAGES[0],
      [
        language,
      ]
    );

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    showLanguages,
    setShowLanguages,
  ] =
    useState(false);

  useEffect(
    () => {
      document.documentElement.lang =
        language;
    },
    [
      language,
    ]
  );

  useEffect(
    () => {
      function handlePointerDown(
        event: PointerEvent
      ) {
        const target =
          event.target;

        if (
          !(
            target instanceof
            Node
          )
        ) {
          return;
        }

        if (
          showLanguages &&
          !languageRef.current?.contains(
            target
          )
        ) {
          setShowLanguages(
            false
          );
        }
      }

      document.addEventListener(
        "pointerdown",
        handlePointerDown
      );

      return () => {
        document.removeEventListener(
          "pointerdown",
          handlePointerDown
        );
      };
    },
    [
      showLanguages,
    ]
  );

  function changeLanguage(
    nextLanguage: Language
  ) {
    setLanguage(
      nextLanguage
    );

    document.documentElement.lang =
      nextLanguage;

    setShowLanguages(
      false
    );

    setError(
      ""
    );
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(
      ""
    );

    const normalizedEmail =
      email.trim();

    if (
      !normalizedEmail
    ) {
      setError(
        messages.validation.emailRequired
      );

      return;
    }

    if (
      !isValidEmail(
        normalizedEmail
      )
    ) {
      setError(
        messages.validation.emailInvalid
      );

      return;
    }

    if (
      !password
    ) {
      setError(
        messages.validation.passwordRequired
      );

      return;
    }

    setLoading(
      true
    );

    try {
      const response =
        await fetch(
          "/api/auth/login",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email:
                  normalizedEmail,

                password,
              }),
          }
        );

      let json:
        LoginApiResponse;

      try {
        json =
          (await response.json()) as
            LoginApiResponse;
      } catch {
        setError(
          ADMIN_LOGIN_MESSAGES[
            useAdminLanguageStore
              .getState()
              .language
          ].errors.invalidResponse
        );

        return;
      }

      if (
        !response.ok ||
        !json.success
      ) {
        const currentMessages =
          ADMIN_LOGIN_MESSAGES[
            useAdminLanguageStore
              .getState()
              .language
          ];

        setError(
          getLoginErrorMessage(
            response.status,
            json.error,
            currentMessages
          )
        );

        return;
      }

      const {
        user,
        accessToken,
        refreshToken,
      } =
        json.data ?? {};

      if (
        !isAdminUser(
          user
        ) ||
        typeof accessToken !==
          "string" ||
        accessToken.length ===
          0 ||
        typeof refreshToken !==
          "string" ||
        refreshToken.length ===
          0
      ) {
        setError(
          ADMIN_LOGIN_MESSAGES[
            useAdminLanguageStore
              .getState()
              .language
          ].errors.invalidResponse
        );

        return;
      }

      setSession(
        user,
        accessToken,
        refreshToken
      );

      router.replace(
        "/admin"
      );

      router.refresh();
    } catch (
      loginError
    ) {
      console.error(
        "Error during admin login:",
        loginError
      );

      setError(
        ADMIN_LOGIN_MESSAGES[
          useAdminLanguageStore
            .getState()
            .language
        ].errors.connection
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              YaMar
            </h1>

            <p className="mt-2 text-gray-500">
              {
                messages.subtitle
              }
            </p>
          </div>

          <div
            ref={
              languageRef
            }
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setShowLanguages(
                  (
                    current
                  ) =>
                    !current
                )
              }
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              aria-label={
                messages.selectLanguage
              }
              aria-expanded={
                showLanguages
              }
              aria-haspopup="menu"
            >
              <Globe2
                size={18}
                className="text-gray-600"
              />

              <span>
                {
                  currentLanguage.shortLabel
                }
              </span>

              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform ${
                  showLanguages
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {showLanguages && (
              <div
                className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                role="menu"
              >
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {
                      messages.language
                    }
                  </p>
                </div>

                <div className="py-1">
                  {ADMIN_LANGUAGES.map(
                    (
                      option
                    ) => {
                      const selected =
                        option.code ===
                        language;

                      return (
                        <button
                          key={
                            option.code
                          }
                          type="button"
                          role="menuitem"
                          onClick={() =>
                            changeLanguage(
                              option.code
                            )
                          }
                          className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                            selected
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 font-mono text-xs font-semibold uppercase text-gray-400">
                              {
                                option.shortLabel
                              }
                            </span>

                            <span>
                              {
                                option.label
                              }
                            </span>
                          </div>

                          {selected && (
                            <Check
                              size={16}
                              className="text-indigo-600"
                            />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          noValidate
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {
                messages.emailLabel
              }
            </label>

            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              required
              value={
                email
              }
              onChange={(
                event
              ) => {
                setEmail(
                  event.target.value
                );

                if (
                  error
                ) {
                  setError(
                    ""
                  );
                }
              }}
              disabled={
                loading
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
              placeholder={
                messages.emailPlaceholder
              }
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {
                messages.passwordLabel
              }
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={
                password
              }
              onChange={(
                event
              ) => {
                setPassword(
                  event.target.value
                );

                if (
                  error
                ) {
                  setError(
                    ""
                  );
                }
              }}
              disabled={
                loading
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
              placeholder={
                messages.passwordPlaceholder
              }
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <Loader2
                size={18}
                className="animate-spin"
                aria-hidden="true"
              />
            )}

            {loading
              ? messages.submitting
              : messages.submit}
          </button>
        </form>
      </div>
    </div>
  );
}