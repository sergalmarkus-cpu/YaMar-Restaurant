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
  Edit3,
  Layers,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_MODIFIERS_MESSAGES,
  type AdminModifierLanguage,
  type AdminModifierType,
} from "@/config/admin-modifiers-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

type ModifierType =
  AdminModifierType;

type LanguageCode =
  AdminModifierLanguage;

interface ModifierRow {
  id: number;

  productId:
    number;

  name:
    Record<
      string,
      string
    >;

  type:
    ModifierType;

  price:
    string;

  active:
    boolean;
}

interface ProductRow {
  id: number;

  name?:
    unknown;
}

interface EstablishmentRow {
  id: number;

  currency?:
    string | null;
}

interface ApiResponse<T> {
  success:
    boolean;

  data?:
    T;

  error?:
    string;

  message?:
    string;
}

interface ModifierForm {
  productId:
    string;

  type:
    ModifierType;

  price:
    string;

  active:
    boolean;

  name:
    Record<
      LanguageCode,
      string
    >;
}

const LANGUAGE_OPTIONS: Array<{
  code:
    LanguageCode;

  label:
    string;
}> = [
  {
    code:
      "es",

    label:
      "Español",
  },
  {
    code:
      "en",

    label:
      "English",
  },
  {
    code:
      "de",

    label:
      "Deutsch",
  },
  {
    code:
      "fr",

    label:
      "Français",
  },
  {
    code:
      "it",

    label:
      "Italiano",
  },
  {
    code:
      "pt",

    label:
      "Português",
  },
];

const EMPTY_NAMES: Record<
  LanguageCode,
  string
> = {
  es:
    "",

  en:
    "",

  de:
    "",

  fr:
    "",

  it:
    "",

  pt:
    "",
};

function createEmptyForm():
  ModifierForm {
  return {
    productId:
      "",

    type:
      "add",

    price:
      "0",

    active:
      true,

    name: {
      ...EMPTY_NAMES,
    },
  };
}

function normalizePrice(
  value:
    string
) {
  const trimmed =
    value.trim();

  if (!trimmed) {
    return "0";
  }

  return trimmed;
}

function isValidPrice(
  value:
    string
) {
  return /^\d+(\.\d{1,2})?$/.test(
    value
  );
}

function getTranslatedText(
  value:
    unknown,
  language:
    LanguageCode
) {
  if (
    typeof value ===
    "string"
  ) {
    return value.trim();
  }

  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return "";
  }

  const record =
    value as Record<
      string,
      unknown
    >;

  const preferredLanguages:
    LanguageCode[] = [
      language,
      "es",
      "en",
      "fr",
      "de",
      "it",
      "pt",
    ];

  const checked =
    new Set<
      LanguageCode
    >();

  for (
    const code
    of preferredLanguages
  ) {
    if (
      checked.has(
        code
      )
    ) {
      continue;
    }

    checked.add(
      code
    );

    const text =
      record[
        code
      ];

    if (
      typeof text ===
        "string" &&
      text.trim()
    ) {
      return text.trim();
    }
  }

  const firstText =
    Object.values(
      record
    ).find(
      (
        item
      ) =>
        typeof item ===
          "string" &&
        item.trim()
    );

  return typeof firstText ===
    "string"
    ? firstText.trim()
    : "";
}

export default function ModifiersManager() {
  const language =
    useAdminLanguageStore(
      (
        state
      ) =>
        state.language
    ) as LanguageCode;

  const messages =
    ADMIN_MODIFIERS_MESSAGES[
      language
    ];

  const [
    modifiers,
    setModifiers,
  ] =
    useState<
      ModifierRow[]
    >([]);

  const [
    products,
    setProducts,
  ] =
    useState<
      ProductRow[]
    >([]);

  const [
    currency,
    setCurrency,
  ] =
    useState(
      ""
    );

  const [
    productFilter,
    setProductFilter,
  ] =
    useState(
      "all"
    );

  const [
    form,
    setForm,
  ] =
    useState<
      ModifierForm
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
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(
      false
    );

  const [
    saving,
    setSaving,
  ] =
    useState(
      false
    );

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
    useState(
      ""
    );

  const [
    success,
    setSuccess,
  ] =
    useState(
      ""
    );

  function currentLanguage():
    LanguageCode {
    return useAdminLanguageStore
      .getState()
      .language as
      LanguageCode;
  }

  function currentMessages() {
    return ADMIN_MODIFIERS_MESSAGES[
      currentLanguage()
    ];
  }

  const loadData =
    useCallback(
      async (
        silent =
          false
      ) => {
        const activeMessages =
          currentMessages();

        if (
          silent
        ) {
          setRefreshing(
            true
          );
        } else {
          setLoading(
            true
          );
        }

        setError(
          ""
        );

        try {
          const [
            modifiersResponse,
            productsResponse,
            establishmentsResponse,
          ] =
            await Promise.all([
              adminFetch(
                "/api/modifiers"
              ),

              adminFetch(
                "/api/products"
              ),

              adminFetch(
                "/api/establishments"
              ),
            ]);

          const [
            modifiersJson,
            productsJson,
            establishmentsJson,
          ] =
            await Promise.all([
              modifiersResponse.json() as Promise<
                ApiResponse<
                  ModifierRow[]
                >
              >,

              productsResponse.json() as Promise<
                ApiResponse<
                  ProductRow[]
                >
              >,

              establishmentsResponse.json() as Promise<
                ApiResponse<
                  EstablishmentRow[]
                >
              >,
            ]);

          if (
            !modifiersResponse.ok ||
            !modifiersJson.success
          ) {
            setError(
              activeMessages
                .loadModifiersError
            );

            return;
          }

          if (
            !productsResponse.ok ||
            !productsJson.success
          ) {
            setError(
              activeMessages
                .loadProductsError
            );

            return;
          }

          setModifiers(
            Array.isArray(
              modifiersJson.data
            )
              ? modifiersJson.data
              : []
          );

          setProducts(
            Array.isArray(
              productsJson.data
            )
              ? productsJson.data
              : []
          );

          if (
            establishmentsResponse.ok &&
            establishmentsJson.success &&
            Array.isArray(
              establishmentsJson.data
            )
          ) {
            const current =
              establishmentsJson
                .data[0];

            setCurrency(
              current?.currency
                ?.trim()
                .toUpperCase() ??
                ""
            );
          }
        } catch (
          caughtError
        ) {
          console.error(
            "Error loading modifiers:",
            caughtError
          );

          setError(
            activeMessages
              .loadModifiersError
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
      void loadData();
    },
    [
      loadData,
    ]
  );

  const visibleModifiers =
    useMemo(
      () => {
        if (
          productFilter ===
          "all"
        ) {
          return modifiers;
        }

        const productId =
          Number(
            productFilter
          );

        return modifiers.filter(
          (
            modifier
          ) =>
            modifier.productId ===
            productId
        );
      },
      [
        modifiers,
        productFilter,
      ]
    );

  const activeCount =
    useMemo(
      () =>
        modifiers.filter(
          (
            modifier
          ) =>
            modifier.active
        ).length,
      [
        modifiers,
      ]
    );

  function getProductName(
    productId:
      number
  ) {
    const product =
      products.find(
        (
          item
        ) =>
          item.id ===
          productId
      );

    if (!product) {
      return messages
        .fallbackProduct(
          productId
        );
    }

    return (
      getTranslatedText(
        product.name,
        language
      ) ||
      messages
        .fallbackProduct(
          product.id
        )
    );
  }

  function getModifierLabel(
    modifier:
      ModifierRow
  ) {
    return (
      getTranslatedText(
        modifier.name,
        language
      ) ||
      messages
        .fallbackModifier(
          modifier.id
        )
    );
  }

  function getTypeLabel(
    type:
      ModifierType
  ) {
    return messages.types[
      type
    ];
  }

  function formatPrice(
    value:
      string
  ) {
    const numericValue =
      Number(
        value
      );

    if (
      numericValue ===
      0
    ) {
      return messages.free;
    }

    if (
      !currency
    ) {
      return numericValue.toFixed(
        2
      );
    }

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
      ).format(
        numericValue
      );
    } catch {
      return `${numericValue.toFixed(
        2
      )} ${currency}`;
    }
  }

  function updateName(
    code:
      LanguageCode,
    value:
      string
  ) {
    setError(
      ""
    );

    setSuccess(
      ""
    );

    setForm(
      (
        current
      ) => ({
        ...current,

        name: {
          ...current.name,

          [code]:
            value,
        },
      })
    );
  }

  function cancelEditing() {
    setEditingId(
      null
    );

    setForm(
      createEmptyForm()
    );

    setError(
      ""
    );

    setSuccess(
      ""
    );
  }

  function startEditing(
    modifier:
      ModifierRow
  ) {
    const translatedNames:
      Record<
        LanguageCode,
        string
      > = {
        ...EMPTY_NAMES,
      };

    for (
      const option
      of LANGUAGE_OPTIONS
    ) {
      const value =
        modifier.name?.[
          option.code
        ];

      translatedNames[
        option.code
      ] =
        typeof value ===
          "string"
          ? value
          : "";
    }

    setEditingId(
      modifier.id
    );

    setForm({
      productId:
        String(
          modifier.productId
        ),

      type:
        modifier.type,

      price:
        modifier.price ??
        "0",

      active:
        modifier.active,

      name:
        translatedNames,
    });

    setError(
      ""
    );

    setSuccess(
      ""
    );

    window.scrollTo({
      top:
        0,

      behavior:
        "smooth",
    });
  }

  function buildNamePayload() {
    const result:
      Record<
        string,
        string
      > = {};

    for (
      const option
      of LANGUAGE_OPTIONS
    ) {
      const value =
        form.name[
          option.code
        ].trim();

      if (
        value
      ) {
        result[
          option.code
        ] =
          value;
      }
    }

    return result;
  }

  async function saveModifier() {
    const activeMessages =
      currentMessages();

    const productId =
      Number(
        form.productId
      );

    if (
      !Number.isInteger(
        productId
      ) ||
      productId <=
        0
    ) {
      setError(
        activeMessages
          .invalidProduct
      );

      return;
    }

    const name =
      buildNamePayload();

    if (
      Object.keys(
        name
      ).length ===
      0
    ) {
      setError(
        activeMessages
          .nameRequired
      );

      return;
    }

    const price =
      normalizePrice(
        form.price
      );

    if (
      !isValidPrice(
        price
      )
    ) {
      setError(
        activeMessages
          .invalidPrice
      );

      return;
    }

    setSaving(
      true
    );

    setError(
      ""
    );

    setSuccess(
      ""
    );

    const isEditing =
      editingId !==
      null;

    try {
      const response =
        await adminFetch(
          isEditing
            ? `/api/modifiers/${editingId}`
            : "/api/modifiers",
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
                productId,
                name,

                type:
                  form.type,

                price,

                active:
                  form.active,
              }),
          }
        );

      const json =
        (await response.json()) as
          ApiResponse<
            ModifierRow
          >;

      if (
        !response.ok ||
        !json.success
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

      setSuccess(
        isEditing
          ? activeMessages
              .updateSuccess
          : activeMessages
              .createSuccess
      );

      setEditingId(
        null
      );

      setForm(
        createEmptyForm()
      );

      await loadData(
        true
      );
    } catch (
      caughtError
    ) {
      console.error(
        "Error saving modifier:",
        caughtError
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

  async function toggleActive(
    modifier:
      ModifierRow
  ) {
    const activeMessages =
      currentMessages();

    setError(
      ""
    );

    setSuccess(
      ""
    );

    try {
      const response =
        await adminFetch(
          `/api/modifiers/${modifier.id}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                active:
                  !modifier.active,
              }),
          }
        );

      const json =
        (await response.json()) as
          ApiResponse<
            ModifierRow
          >;

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          activeMessages
            .toggleError
        );

        return;
      }

      setModifiers(
        (
          current
        ) =>
          current.map(
            (
              item
            ) =>
              item.id ===
              modifier.id
                ? {
                    ...item,

                    active:
                      !modifier.active,
                  }
                : item
          )
      );

      setSuccess(
        modifier.active
          ? activeMessages
              .deactivatedSuccess
          : activeMessages
              .activatedSuccess
      );
    } catch (
      caughtError
    ) {
      console.error(
        "Error toggling modifier:",
        caughtError
      );

      setError(
        activeMessages
          .toggleError
      );
    }
  }

  async function deleteModifier(
    modifier:
      ModifierRow
  ) {
    const activeMessages =
      currentMessages();

    const confirmed =
      window.confirm(
        activeMessages
          .deleteConfirm(
            getModifierLabel(
              modifier
            )
          )
      );

    if (
      !confirmed
    ) {
      return;
    }

    setDeletingId(
      modifier.id
    );

    setError(
      ""
    );

    setSuccess(
      ""
    );

    try {
      const response =
        await adminFetch(
          `/api/modifiers/${modifier.id}`,
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

      setModifiers(
        (
          current
        ) =>
          current.filter(
            (
              item
            ) =>
              item.id !==
              modifier.id
          )
      );

      if (
        editingId ===
        modifier.id
      ) {
        setEditingId(
          null
        );

        setForm(
          createEmptyForm()
        );
      }

      setSuccess(
        activeMessages
          .deleteSuccess
      );
    } catch (
      caughtError
    ) {
      console.error(
        "Error deleting modifier:",
        caughtError
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

  if (
    loading
  ) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={
              22
            }
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

  const priceLabel =
    currency
      ? `${messages.additionalPrice} (${currency})`
      : messages.additionalPrice;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Layers
              size={
                22
              }
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
            void loadData(
              true
            )
          }
          disabled={
            refreshing
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={
              17
            }
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? messages
                .refreshing
            : messages
                .refresh}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle
            size={
              19
            }
            className="mt-0.5 shrink-0"
          />

          <span>
            {
              error
            }
          </span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check
            size={
              19
            }
            className="mt-0.5 shrink-0"
          />

          <span>
            {
              success
            }
          </span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages.statModifiers
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {
              modifiers.length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages.statActive
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
              messages.statProducts
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {
              products.length
            }
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId
                ? messages
                    .editModifier
                : messages
                    .newModifier}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? messages
                    .editingModifier(
                      editingId
                    )
                : messages
                    .createDescription}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={
                cancelEditing
              }
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <X
                size={
                  16
                }
              />

              {
                messages.cancel
              }
            </button>
          )}
        </div>

        {products.length ===
        0 ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {
              messages
                .noProductsWarning
            }
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {
                    messages.product
                  }
                </label>

                <select
                  value={
                    form.productId
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,

                        productId:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">
                    {
                      messages
                        .selectProduct
                    }
                  </option>

                  {products.map(
                    (
                      product
                    ) => (
                      <option
                        key={
                          product.id
                        }
                        value={
                          product.id
                        }
                      >
                        {getTranslatedText(
                          product.name,
                          language
                        ) ||
                          messages
                            .fallbackProduct(
                              product.id
                            )}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {
                    messages.type
                  }
                </label>

                <select
                  value={
                    form.type
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,

                        type:
                          event
                            .target
                            .value as
                            ModifierType,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  {(
                    [
                      "add",
                      "remove",
                      "replace",
                    ] as
                      ModifierType[]
                  ).map(
                    (
                      type
                    ) => (
                      <option
                        key={
                          type
                        }
                        value={
                          type
                        }
                      >
                        {
                          getTypeLabel(
                            type
                          )
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {
                    priceLabel
                  }
                </label>

                <input
                  type="text"
                  inputMode="decimal"
                  value={
                    form.price
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,

                        price:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium text-slate-900">
                {
                  messages
                    .modifierName
                }
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {
                  messages
                    .translationsHelp
                }
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {LANGUAGE_OPTIONS.map(
                  (
                    option
                  ) => (
                    <div
                      key={
                        option.code
                      }
                    >
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        {
                          option.label
                        }
                      </label>

                      <input
                        type="text"
                        value={
                          form.name[
                            option.code
                          ]
                        }
                        onChange={(
                          event
                        ) =>
                          updateName(
                            option.code,
                            event
                              .target
                              .value
                          )
                        }
                        placeholder={
                          messages
                            .namePlaceholder(
                              option.label
                            )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      active:
                        !current.active,
                    })
                  )
                }
                aria-pressed={
                  form.active
                }
                className={`inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ring-1 transition ${
                  form.active
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-slate-100 text-slate-600 ring-slate-200"
                }`}
              >
                {form.active && (
                  <Check
                    size={
                      16
                    }
                  />
                )}

                {form.active
                  ? messages.active
                  : messages.inactive}
              </button>

              <button
                type="button"
                onClick={() =>
                  void saveModifier()
                }
                disabled={
                  saving
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={
                        17
                      }
                      className="animate-spin"
                    />

                    {
                      messages.saving
                    }
                  </>
                ) : (
                  <>
                    {editingId ? (
                      <Save
                        size={
                          17
                        }
                      />
                    ) : (
                      <Plus
                        size={
                          17
                        }
                      />
                    )}

                    {editingId
                      ? messages
                          .saveChanges
                      : messages
                          .createModifier}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              {
                messages
                  .configuredModifiers
              }
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {
                messages
                  .filterDescription
              }
            </p>
          </div>

          <select
            value={
              productFilter
            }
            onChange={(
              event
            ) =>
              setProductFilter(
                event
                  .target
                  .value
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">
              {
                messages
                  .allProducts
              }
            </option>

            {products.map(
              (
                product
              ) => (
                <option
                  key={
                    product.id
                  }
                  value={
                    product.id
                  }
                >
                  {getTranslatedText(
                    product.name,
                    language
                  ) ||
                    messages
                      .fallbackProduct(
                        product.id
                      )}
                </option>
              )
            )}
          </select>
        </div>

        {visibleModifiers.length ===
        0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
            <Layers
              size={
                30
              }
              className="text-slate-400"
            />

            <h3 className="mt-4 font-semibold text-slate-900">
              {
                messages
                  .emptyTitle
              }
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {modifiers.length ===
              0
                ? messages
                    .emptyAll
                : messages
                    .emptyFiltered}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {visibleModifiers.map(
              (
                modifier
              ) => (
                <div
                  key={
                    modifier.id
                  }
                  className="flex flex-col gap-5 p-6 xl:flex-row xl:items-center xl:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {
                          getModifierLabel(
                            modifier
                          )
                        }
                      </h3>

                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                        {
                          getTypeLabel(
                            modifier.type
                          )
                        }
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          modifier.active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {modifier.active
                          ? messages.active
                          : messages.inactive}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                      <span>
                        {
                          getProductName(
                            modifier.productId
                          )
                        }
                      </span>

                      <span>
                        {
                          messages.price
                        }
                        :{" "}
                        {
                          formatPrice(
                            modifier.price
                          )
                        }
                      </span>

                      <span>
                        ID #
                        {
                          modifier.id
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        void toggleActive(
                          modifier
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                        modifier.active
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {modifier.active
                        ? messages
                            .deactivate
                        : messages
                            .activate}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        startEditing(
                          modifier
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Edit3
                        size={
                          16
                        }
                      />

                      {
                        messages.edit
                      }
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void deleteModifier(
                          modifier
                        )
                      }
                      disabled={
                        deletingId ===
                        modifier.id
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId ===
                      modifier.id ? (
                        <Loader2
                          size={
                            16
                          }
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2
                          size={
                            16
                          }
                        />
                      )}

                      {
                        messages.delete
                      }
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}