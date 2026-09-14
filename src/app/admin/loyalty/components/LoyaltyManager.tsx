"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Check,
  Coins,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_LOYALTY_MESSAGES,
  type AdminLoyaltyLanguage,
} from "@/config/admin-loyalty-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

type FilterMode =
  | "all"
  | "email"
  | "session";

interface LoyaltyRow {
  id: number;
  establishmentId: number;
  sessionId: string;
  customerEmail: string;
  points:
    | number
    | null;
  totalSpent:
    | string
    | null;
  lastVisit:
    | string
    | null;
  createdAt: string;
  updatedAt: string;
}

interface LoyaltyForm {
  sessionId: string;
  customerEmail: string;
  points: string;
  totalSpent: string;
  lastVisit: string;
}

interface EstablishmentRow {
  id: number;
  currency?:
    | string
    | null;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

function toLocalInputValue(
  value:
    | string
    | Date
    | null
    | undefined
) {
  if (!value) {
    return "";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const timezoneOffset =
    date.getTimezoneOffset();

  const local =
    new Date(
      date.getTime() -
        timezoneOffset *
          60_000
    );

  return local
    .toISOString()
    .slice(
      0,
      16
    );
}

function createEmptyForm(): LoyaltyForm {
  return {
    sessionId: "",
    customerEmail: "",
    points: "0",
    totalSpent: "0.00",
    lastVisit:
      toLocalInputValue(
        new Date()
      ),
  };
}

function formatDate(
  value:
    | string
    | null
    | undefined,
  language:
    AdminLoyaltyLanguage
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleString(
    ADMIN_LANGUAGE_LOCALES[
      language
    ],
    {
      dateStyle:
        "medium",
      timeStyle:
        "short",
    }
  );
}

function formatNumber(
  value: number,
  language:
    AdminLoyaltyLanguage
) {
  return new Intl.NumberFormat(
    ADMIN_LANGUAGE_LOCALES[
      language
    ]
  ).format(value);
}

function formatMoney(
  value: number,
  language:
    AdminLoyaltyLanguage,
  currency: string
) {
  try {
    return new Intl.NumberFormat(
      ADMIN_LANGUAGE_LOCALES[
        language
      ],
      {
        style:
          "currency",
        currency,
      }
    ).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

function isValidUuid(
  value: string
) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function isValidEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}

function isValidMoney(
  value: string
) {
  return /^\d+(\.\d{1,2})?$/.test(
    value
  );
}

export default function LoyaltyManager() {
  const language =
    useAdminLanguageStore(
      (
        state
      ) =>
        state.language
    ) as AdminLoyaltyLanguage;

  const messages =
    ADMIN_LOYALTY_MESSAGES[
      language
    ];

  const [
    currency,
    setCurrency,
  ] =
    useState(
      "EUR"
    );

  const [
    records,
    setRecords,
  ] =
    useState<
      LoyaltyRow[]
    >([]);

  const [
    form,
    setForm,
  ] =
    useState<
      LoyaltyForm
    >(
      createEmptyForm()
    );

  const [
    editingId,
    setEditingId,
  ] =
    useState<
      number |
      null
    >(
      null
    );

  const [
    filterMode,
    setFilterMode,
  ] =
    useState<
      FilterMode
    >(
      "all"
    );

  const [
    filterValue,
    setFilterValue,
  ] =
    useState("");

  const [
    appliedFilterMode,
    setAppliedFilterMode,
  ] =
    useState<
      FilterMode
    >(
      "all"
    );

  const [
    appliedFilterValue,
    setAppliedFilterValue,
  ] =
    useState("");

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
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    deletingId,
    setDeletingId,
  ] =
    useState<
      number |
      null
    >(
      null
    );

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

  function currentLanguage():
    AdminLoyaltyLanguage {
    return useAdminLanguageStore
      .getState()
      .language as
      AdminLoyaltyLanguage;
  }

  function currentMessages() {
    return ADMIN_LOYALTY_MESSAGES[
      currentLanguage()
    ];
  }

  const loadCurrency =
    useCallback(
      async () => {
        try {
          const response =
            await adminFetch(
              "/api/establishments"
            );

          if (!response.ok) {
            return;
          }

          const json =
            (await response.json()) as
              ApiResponse<
                EstablishmentRow[]
              >;

          const establishment =
            Array.isArray(
              json.data
            )
              ? json.data[0]
              : undefined;

          const nextCurrency =
            establishment?.currency
              ?.trim()
              .toUpperCase();

          if (nextCurrency) {
            setCurrency(
              nextCurrency
            );
          }
        } catch (
          currencyError
        ) {
          console.error(
            "Error loading establishment currency:",
            currencyError
          );
        }
      },
      []
    );

  const loadRecords =
    useCallback(
      async (
        mode:
          FilterMode =
            "all",
        value =
          "",
        silent =
          false
      ) => {
        const activeMessages =
          currentMessages();

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

        try {
          let url =
            "/api/loyalty";

          if (
            mode ===
              "email" &&
            value.trim()
          ) {
            url +=
              `?customerEmail=${encodeURIComponent(
                value.trim()
              )}`;
          }

          if (
            mode ===
              "session" &&
            value.trim()
          ) {
            url +=
              `?sessionId=${encodeURIComponent(
                value.trim()
              )}`;
          }

          const response =
            await adminFetch(
              url
            );

          const json =
            (await response.json()) as
              ApiResponse<
                LoyaltyRow[]
              >;

          if (
            !response.ok ||
            !json.success
          ) {
            setError(
              activeMessages
                .loadError
            );

            return;
          }

          setRecords(
            Array.isArray(
              json.data
            )
              ? json.data
              : []
          );
        } catch (
          loadError
        ) {
          console.error(
            "Error loading loyalty records:",
            loadError
          );

          setError(
            activeMessages
              .loadError
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
      []
    );

  useEffect(
    () => {
      void Promise.all([
        loadRecords(),
        loadCurrency(),
      ]);
    },
    [
      loadCurrency,
      loadRecords,
    ]
  );

  const totalPoints =
    useMemo(
      () =>
        records.reduce(
          (
            total,
            record
          ) =>
            total +
            (
              record.points ??
              0
            ),
          0
        ),
      [
        records,
      ]
    );

  const totalSpent =
    useMemo(
      () =>
        records.reduce(
          (
            total,
            record
          ) => {
            const amount =
              Number(
                record.totalSpent ??
                  "0"
              );

            return total +
              (
                Number.isFinite(
                  amount
                )
                  ? amount
                  : 0
              );
          },
          0
        ),
      [
        records,
      ]
    );

  const uniqueCustomers =
    useMemo(
      () =>
        new Set(
          records.map(
            (
              record
            ) =>
              record.customerEmail
          )
        ).size,
      [
        records,
      ]
    );

  function resetForm() {
    setEditingId(
      null
    );

    setForm(
      createEmptyForm()
    );

    setError("");
    setSuccess("");
  }

  function startEditing(
    record:
      LoyaltyRow
  ) {
    setEditingId(
      record.id
    );

    setForm({
      sessionId:
        record.sessionId,

      customerEmail:
        record.customerEmail,

      points:
        String(
          record.points ??
            0
        ),

      totalSpent:
        record.totalSpent ??
        "0.00",

      lastVisit:
        toLocalInputValue(
          record.lastVisit
        ),
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top:
        0,
      behavior:
        "smooth",
    });
  }

  function validateForm() {
    const activeMessages =
      currentMessages();

    const sessionId =
      form.sessionId.trim();

    const customerEmail =
      form.customerEmail
        .trim()
        .toLowerCase();

    if (
      !isValidUuid(
        sessionId
      )
    ) {
      return activeMessages
        .invalidSessionId;
    }

    if (
      !isValidEmail(
        customerEmail
      )
    ) {
      return activeMessages
        .invalidCustomerEmail;
    }

    const points =
      Number(
        form.points
      );

    if (
      !Number.isInteger(
        points
      ) ||
      points < 0
    ) {
      return activeMessages
        .invalidPoints;
    }

    if (
      !isValidMoney(
        form.totalSpent.trim()
      )
    ) {
      return activeMessages
        .invalidTotalSpent;
    }

    if (
      form.lastVisit
    ) {
      const date =
        new Date(
          form.lastVisit
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return activeMessages
          .invalidLastVisit;
      }
    }

    return null;
  }

  async function saveRecord() {
    const activeMessages =
      currentMessages();

    const validationError =
      validateForm();

    if (
      validationError
    ) {
      setError(
        validationError
      );

      return;
    }

    const isEditing =
      editingId !==
      null;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await adminFetch(
          isEditing
            ? `/api/loyalty/${editingId}`
            : "/api/loyalty",
          {
            method:
              isEditing
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                sessionId:
                  form.sessionId.trim(),

                customerEmail:
                  form.customerEmail
                    .trim()
                    .toLowerCase(),

                points:
                  Number(
                    form.points
                  ),

                totalSpent:
                  form.totalSpent.trim(),

                ...(form.lastVisit
                  ? {
                      lastVisit:
                        new Date(
                          form.lastVisit
                        ).toISOString(),
                    }
                  : isEditing
                    ? {
                        lastVisit:
                          null,
                      }
                    : {}),
              }),
          }
        );

      const json =
        (await response.json()) as
          ApiResponse<
            LoyaltyRow
          >;

      if (
        !response.ok ||
        !json.success ||
        !json.data
      ) {
        setError(
          isEditing
            ? activeMessages
                .updateError
            : activeMessages
                .createError
        );

        return;
      }

      const savedRecord =
        json.data;

      if (isEditing) {
        setRecords(
          (
            current
          ) =>
            current.map(
              (
                record
              ) =>
                record.id ===
                savedRecord.id
                  ? savedRecord
                  : record
            )
        );
      } else if (
        appliedFilterMode ===
        "all"
      ) {
        setRecords(
          (
            current
          ) => [
            ...current,
            savedRecord,
          ]
        );
      }

      setEditingId(
        null
      );

      setForm(
        createEmptyForm()
      );

      await loadRecords(
        appliedFilterMode,
        appliedFilterValue,
        true
      );

      setSuccess(
        isEditing
          ? activeMessages
              .updateSuccess
          : activeMessages
              .createSuccess
      );
    } catch (
      saveError
    ) {
      console.error(
        "Error saving loyalty record:",
        saveError
      );

      setError(
        isEditing
          ? activeMessages
              .updateError
          : activeMessages
              .createError
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  async function deleteRecord(
    record:
      LoyaltyRow
  ) {
    const activeMessages =
      currentMessages();

    const confirmed =
      window.confirm(
        activeMessages
          .deleteConfirm(
            record.customerEmail
          )
      );

    if (
      !confirmed
    ) {
      return;
    }

    setDeletingId(
      record.id
    );

    setError("");
    setSuccess("");

    try {
      const response =
        await adminFetch(
          `/api/loyalty/${record.id}`,
          {
            method:
              "DELETE",
          }
        );

      const json =
        (await response.json()) as
          ApiResponse<
            null
          >;

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          activeMessages
            .deleteError
        );

        return;
      }

      setRecords(
        (
          current
        ) =>
          current.filter(
            (
              item
            ) =>
              item.id !==
              record.id
          )
      );

      if (
        editingId ===
        record.id
      ) {
        resetForm();
      }

      setSuccess(
        activeMessages
          .deleteSuccess
      );
    } catch (
      deleteError
    ) {
      console.error(
        "Error deleting loyalty record:",
        deleteError
      );

      setError(
        activeMessages
          .deleteError
      );
    } finally {
      setDeletingId(
        null
      );
    }
  }

  function validateFilter() {
    const activeMessages =
      currentMessages();

    const value =
      filterValue.trim();

    if (
      filterMode ===
      "all"
    ) {
      return null;
    }

    if (!value) {
      return activeMessages
        .missingFilterValue;
    }

    if (
      filterMode ===
        "email" &&
      !isValidEmail(
        value
      )
    ) {
      return activeMessages
        .invalidFilterEmail;
    }

    if (
      filterMode ===
        "session" &&
      !isValidUuid(
        value
      )
    ) {
      return activeMessages
        .invalidFilterSession;
    }

    return null;
  }

  async function applyFilter() {
    const validationError =
      validateFilter();

    if (
      validationError
    ) {
      setError(
        validationError
      );

      return;
    }

    const nextValue =
      filterMode ===
        "all"
        ? ""
        : filterValue.trim();

    setAppliedFilterMode(
      filterMode
    );

    setAppliedFilterValue(
      nextValue
    );

    setSuccess("");

    await loadRecords(
      filterMode,
      nextValue
    );
  }

  async function clearFilter() {
    setFilterMode(
      "all"
    );

    setFilterValue("");

    setAppliedFilterMode(
      "all"
    );

    setAppliedFilterValue("");

    setSuccess("");

    await loadRecords(
      "all",
      ""
    );
  }

  if (
    loading
  ) {
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
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Coins
              size={22}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {
                messages.title
              }
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {
                messages.subtitle
              }
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadRecords(
              appliedFilterMode,
              appliedFilterValue,
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
            ? messages.refreshing
            : messages.refresh}
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages
                .shownRecords
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {
              formatNumber(
                records.length,
                language
              )
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages
                .shownCustomers
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-violet-600">
            {
              formatNumber(
                uniqueCustomers,
                language
              )
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages
                .shownPoints
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {
              formatNumber(
                totalPoints,
                language
              )
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages
                .shownSpent
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {
              formatMoney(
                totalSpent,
                language,
                currency
              )
            }
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Search
            size={18}
            className="text-slate-500"
          />

          <h2 className="font-semibold text-slate-900">
            {
              messages
                .searchRecords
            }
          </h2>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[220px_1fr_auto_auto]">
          <select
            value={
              filterMode
            }
            onChange={(
              event
            ) => {
              const mode =
                event.target
                  .value as
                  FilterMode;

              setFilterMode(
                mode
              );

              setFilterValue("");
              setError("");
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option value="all">
              {
                messages.filterAll
              }
            </option>

            <option value="email">
              {
                messages.filterEmail
              }
            </option>

            <option value="session">
              {
                messages
                  .filterSession
              }
            </option>
          </select>

          <input
            type={
              filterMode ===
              "email"
                ? "email"
                : "text"
            }
            disabled={
              filterMode ===
              "all"
            }
            value={
              filterValue
            }
            onChange={(
              event
            ) =>
              setFilterValue(
                event.target
                  .value
              )
            }
            onKeyDown={(
              event
            ) => {
              if (
                event.key ===
                "Enter"
              ) {
                void applyFilter();
              }
            }}
            placeholder={
              filterMode ===
              "email"
                ? messages
                    .emailPlaceholder
                : filterMode ===
                    "session"
                  ? messages
                      .sessionPlaceholder
                  : messages
                      .selectFilterPlaceholder
            }
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />

          <button
            type="button"
            onClick={() =>
              void applyFilter()
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Search
              size={16}
            />

            {
              messages.search
            }
          </button>

          <button
            type="button"
            onClick={() =>
              void clearFilter()
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw
              size={16}
            />

            {
              messages.clear
            }
          </button>
        </div>

        {appliedFilterMode !==
          "all" && (
          <p className="mt-3 text-xs text-slate-500">
            {
              messages
                .activeFilter
            }
            :{" "}
            <strong>
              {appliedFilterMode ===
              "email"
                ? messages
                    .activeFilterEmail
                : messages
                    .activeFilterSession}
            </strong>
            {" · "}
            {
              appliedFilterValue
            }
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId
                ? messages
                    .editRecord
                : messages
                    .newRecord}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {
                messages
                  .sessionHelp
              }
            </p>
          </div>

          {editingId !==
            null && (
            <button
              type="button"
              onClick={
                resetForm
              }
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <X
                size={16}
              />

              {
                messages.cancel
              }
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {
                messages.sessionId
              }
            </label>

            <input
              type="text"
              value={
                form.sessionId
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    current
                  ) => ({
                    ...current,
                    sessionId:
                      event.target
                        .value,
                  })
                )
              }
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-mono text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {
                messages
                  .customerEmail
              }
            </label>

            <input
              type="email"
              value={
                form.customerEmail
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    current
                  ) => ({
                    ...current,
                    customerEmail:
                      event.target
                        .value,
                  })
                )
              }
              placeholder={
                messages
                  .emailPlaceholder
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {
                messages.points
              }
            </label>

            <input
              type="number"
              min={0}
              step={1}
              value={
                form.points
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    current
                  ) => ({
                    ...current,
                    points:
                      event.target
                        .value,
                  })
                )
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {
                messages
                  .totalSpent
              }{" "}
              ({currency})
            </label>

            <input
              type="text"
              inputMode="decimal"
              value={
                form.totalSpent
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    current
                  ) => ({
                    ...current,
                    totalSpent:
                      event.target
                        .value,
                  })
                )
              }
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {
                messages
                  .lastVisit
              }
            </label>

            <input
              type="datetime-local"
              value={
                form.lastVisit
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    current
                  ) => ({
                    ...current,
                    lastVisit:
                      event.target
                        .value,
                  })
                )
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />

            {editingId !==
              null && (
              <p className="mt-1.5 text-xs text-slate-400">
                {
                  messages
                    .nullLastVisitHelp
                }
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() =>
              void saveRecord()
            }
            disabled={
              saving
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                {
                  messages.saving
                }
              </>
            ) : editingId ? (
              <>
                <Save
                  size={17}
                />

                {
                  messages
                    .saveChanges
                }
              </>
            ) : (
              <>
                <Plus
                  size={17}
                />

                {
                  messages
                    .createRecord
                }
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900">
            {
              messages
                .recordsTitle
            }
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {
              messages
                .recordsSubtitle
            }
          </p>
        </div>

        {records.length ===
        0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
            <UserRound
              size={34}
              className="text-slate-400"
            />

            <h3 className="mt-4 font-semibold text-slate-900">
              {
                messages.noRecords
              }
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {
                messages
                  .noRecordsDescription
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {
                      messages.customer
                    }
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {
                      messages.points
                    }
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {
                      messages.spent
                    }
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {
                      messages.lastVisit
                    }
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {
                      messages.session
                    }
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {
                      messages.actions
                    }
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {records.map(
                  (
                    record
                  ) => (
                    <tr
                      key={
                        record.id
                      }
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {
                              record.customerEmail
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {
                              messages
                                .recordNumber(
                                  record.id
                                )
                            }
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
                          <Coins
                            size={14}
                          />

                          {
                            formatNumber(
                              record.points ??
                                0,
                              language
                            )
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {
                          formatMoney(
                            Number(
                              record.totalSpent ??
                                "0"
                            ),
                            language,
                            currency
                          )
                        }
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {
                          formatDate(
                            record.lastVisit,
                            language
                          )
                        }
                      </td>

                      <td className="max-w-[250px] px-5 py-4">
                        <span
                          title={
                            record.sessionId
                          }
                          className="block truncate font-mono text-xs text-slate-500"
                        >
                          {
                            record.sessionId
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              startEditing(
                                record
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            <Edit3
                              size={15}
                            />

                            {
                              messages.edit
                            }
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void deleteRecord(
                                record
                              )
                            }
                            disabled={
                              deletingId ===
                              record.id
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId ===
                            record.id ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2
                                size={15}
                              />
                            )}

                            {
                              messages.delete
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}