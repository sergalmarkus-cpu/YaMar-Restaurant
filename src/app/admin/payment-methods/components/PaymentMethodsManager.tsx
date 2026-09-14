"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  AlertCircle,
  Banknote,
  Check,
  CreditCard,
  Landmark,
  Loader2,
  RefreshCw,
  Save,
  Smartphone,
  WalletCards,
} from "lucide-react";

import {
  ADMIN_PAYMENT_METHODS_MESSAGES,
} from "@/config/admin-payment-methods-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import type {
  PaymentMethod,
} from "@/types";

interface PaymentMethodRow {
  id: number;
  establishmentId: number;
  method: PaymentMethod;
  enabled: boolean;
  displayName:
    | string
    | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface PaymentMethodsResponse {
  success: boolean;
  data?: PaymentMethodRow[];
  error?: string;
  message?: string;
}

interface EditablePaymentMethod {
  id: number;
  enabled: boolean;
  displayName: string;
  sortOrder: number;
}

const METHOD_ICONS: Record<
  PaymentMethod,
  LucideIcon
> = {
  card:
    CreditCard,

  cash:
    Banknote,

  transfer:
    Landmark,

  paypal:
    WalletCards,

  apple_pay:
    Smartphone,

  google_pay:
    Smartphone,
};

function createDrafts(
  methods: PaymentMethodRow[]
): EditablePaymentMethod[] {
  return methods.map(
    (
      method
    ) => ({
      id:
        method.id,

      enabled:
        method.enabled,

      displayName:
        method.displayName ??
        "",

      sortOrder:
        method.sortOrder,
    })
  );
}

export default function PaymentMethodsManager() {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_PAYMENT_METHODS_MESSAGES[
      language
    ];

  const [
    methods,
    setMethods,
  ] =
    useState<
      PaymentMethodRow[]
    >([]);

  const [
    drafts,
    setDrafts,
  ] =
    useState<
      EditablePaymentMethod[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    savingId,
    setSavingId,
  ] =
    useState<
      number |
      null
    >(null);

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

  const loadMethods =
    useCallback(
      async (
        silent =
          false
      ) => {
        if (silent) {
          setRefreshing(
            true
          );
        } else {
          setLoading(
            true
          );
        }

        setError("");
        setSuccess("");

        try {
          const response =
            await adminFetch(
              "/api/payment-methods"
            );

          const json =
            (await response.json()) as
              PaymentMethodsResponse;

          if (
            !response.ok ||
            !json.success
          ) {
            setError(
              json.error ||
                json.message ||
                messages.errors
                  .load
            );

            return;
          }

          const data =
            Array.isArray(
              json.data
            )
              ? json.data
              : [];

          setMethods(
            data
          );

          setDrafts(
            createDrafts(
              data
            )
          );
        } catch (
          loadError
        ) {
          console.error(
            "Error loading payment methods:",
            loadError
          );

          setError(
            messages.errors
              .load
          );
        } finally {
          setLoading(
            false
          );

          setRefreshing(
            false
          );
        }
      },
      [
        messages.errors
          .load,
      ]
    );

  useEffect(
    () => {
      void loadMethods();
    },
    [
      loadMethods,
    ]
  );

  const activeCount =
    useMemo(
      () =>
        drafts.filter(
          (
            method
          ) =>
            method.enabled
        ).length,
      [
        drafts,
      ]
    );

  function getDraft(
    id: number
  ) {
    return drafts.find(
      (
        draft
      ) =>
        draft.id ===
        id
    );
  }

  function updateDraft(
    id: number,
    changes:
      Partial<
        EditablePaymentMethod
      >
  ) {
    setError("");
    setSuccess("");

    setDrafts(
      (
        current
      ) =>
        current.map(
          (
            draft
          ) =>
            draft.id ===
            id
              ? {
                  ...draft,
                  ...changes,
                }
              : draft
        )
    );
  }

  function resetMethod(
    id: number
  ) {
    const original =
      methods.find(
        (
          method
        ) =>
          method.id ===
          id
      );

    if (!original) {
      return;
    }

    updateDraft(
      id,
      {
        enabled:
          original.enabled,

        displayName:
          original.displayName ??
          "",

        sortOrder:
          original.sortOrder,
      }
    );
  }

  function hasChanges(
    method: PaymentMethodRow,
    draft:
      EditablePaymentMethod
  ) {
    return (
      method.enabled !==
        draft.enabled ||
      (
        method.displayName ??
        ""
      ) !==
        draft.displayName ||
      method.sortOrder !==
        draft.sortOrder
    );
  }

  async function saveMethod(
    method: PaymentMethodRow
  ) {
    const draft =
      getDraft(
        method.id
      );

    if (!draft) {
      return;
    }

    const trimmedName =
      draft.displayName.trim();

    if (
      draft.sortOrder <
        0 ||
      draft.sortOrder >
        100 ||
      !Number.isInteger(
        draft.sortOrder
      )
    ) {
      setError(
        messages.validation
          .sortOrder
      );

      return;
    }

    if (
      trimmedName.length >
      80
    ) {
      setError(
        messages.validation
          .displayName
      );

      return;
    }

    setSavingId(
      method.id
    );

    setError("");
    setSuccess("");

    try {
      const response =
        await adminFetch(
          `/api/payment-methods/${method.id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                enabled:
                  draft.enabled,

                displayName:
                  trimmedName ||
                  null,

                sortOrder:
                  draft.sortOrder,
              }),
          }
        );

      const json =
        (await response.json()) as
          PaymentMethodsResponse;

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            json.message ||
            messages.errors
              .update
        );

        return;
      }

      const updated =
        json.data as
          | unknown;

      if (
        updated &&
        typeof updated ===
          "object"
      ) {
        const updatedMethod =
          updated as
            PaymentMethodRow;

        setMethods(
          (
            current
          ) =>
            current.map(
              (
                item
              ) =>
                item.id ===
                updatedMethod.id
                  ? updatedMethod
                  : item
            )
        );

        setDrafts(
          (
            current
          ) =>
            current.map(
              (
                item
              ) =>
                item.id ===
                updatedMethod.id
                  ? {
                      id:
                        updatedMethod.id,

                      enabled:
                        updatedMethod.enabled,

                      displayName:
                        updatedMethod.displayName ??
                        "",

                      sortOrder:
                        updatedMethod.sortOrder,
                    }
                  : item
            )
        );
      }

      setSuccess(
        messages.success.updated(
          trimmedName ||
            messages.methods[
              method.method
            ]
        )
      );
    } catch (
      saveError
    ) {
      console.error(
        "Error saving payment method:",
        saveError
      );

      setError(
        messages.errors
          .update
      );
    } finally {
      setSavingId(
        null
      );
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={22}
            className="animate-spin"
          />

          <span>
            {
              messages.loading
            }
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <CreditCard
                size={22}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {
                  messages.page
                    .title
                }
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {
                  messages.page
                    .subtitle
                }
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadMethods(
              true
            )
          }
          disabled={
            refreshing
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? messages.page
                .refreshing
            : messages.page
                .refresh}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <span>
            {error}
          </span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check
            size={19}
            className="mt-0.5 shrink-0"
          />

          <span>
            {success}
          </span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages.stats
                .configured
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {
              methods.length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages.stats
                .active
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {
              activeCount
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages.stats
                .inactive
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-600">
            {
              methods.length -
              activeCount
            }
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {methods.length ===
        0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
            <CreditCard
              size={30}
              className="text-slate-400"
            />

            <h2 className="mt-4 font-semibold text-slate-900">
              {
                messages.empty
                  .title
              }
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {
                messages.empty
                  .description
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {methods.map(
              (
                method
              ) => {
                const draft =
                  getDraft(
                    method.id
                  );

                if (!draft) {
                  return null;
                }

                const Icon =
                  METHOD_ICONS[
                    method.method
                  ];

                const changed =
                  hasChanges(
                    method,
                    draft
                  );

                const saving =
                  savingId ===
                  method.id;

                return (
                  <div
                    key={
                      method.id
                    }
                    className="p-6"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                          <Icon
                            size={22}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-semibold text-slate-900">
                              {
                                messages.methods[
                                  method.method
                                ]
                              }
                            </h2>

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                              {
                                method.method
                              }
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            ID #
                            {
                              method.id
                            }
                          </p>
                        </div>
                      </div>

                      <div className="grid flex-[2] gap-4 md:grid-cols-[minmax(0,1fr)_130px_130px]">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
                            {
                              messages.fields
                                .displayName
                            }
                          </label>

                          <input
                            type="text"
                            value={
                              draft.displayName
                            }
                            maxLength={80}
                            onChange={(
                              event
                            ) =>
                              updateDraft(
                                method.id,
                                {
                                  displayName:
                                    event.target
                                      .value,
                                }
                              )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
                            {
                              messages.fields
                                .sortOrder
                            }
                          </label>

                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={
                              draft.sortOrder
                            }
                            onChange={(
                              event
                            ) =>
                              updateDraft(
                                method.id,
                                {
                                  sortOrder:
                                    Number(
                                      event.target
                                        .value
                                    ),
                                }
                              )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
                            {
                              messages.fields
                                .status
                            }
                          </label>

                          <button
                            type="button"
                            onClick={() =>
                              updateDraft(
                                method.id,
                                {
                                  enabled:
                                    !draft.enabled,
                                }
                              )
                            }
                            aria-pressed={
                              draft.enabled
                            }
                            className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ring-1 transition ${
                              draft.enabled
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-600 ring-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            {draft.enabled && (
                              <Check
                                size={16}
                              />
                            )}

                            {draft.enabled
                              ? messages.status
                                  .active
                              : messages.status
                                  .inactive}
                          </button>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 xl:justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            resetMethod(
                              method.id
                            )
                          }
                          disabled={
                            !changed ||
                            saving
                          }
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {
                            messages.actions
                              .reset
                          }
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void saveMethod(
                              method
                            )
                          }
                          disabled={
                            !changed ||
                            saving
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />

                              {
                                messages.actions
                                  .saving
                              }
                            </>
                          ) : (
                            <>
                              <Save
                                size={16}
                              />

                              {
                                messages.actions
                                  .save
                              }
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        {
          messages.info
        }
      </div>
    </div>
  );
}