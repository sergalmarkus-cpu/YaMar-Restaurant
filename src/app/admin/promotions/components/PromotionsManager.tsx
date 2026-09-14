"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CalendarDays,
  Check,
  Edit3,
  Gift,
  Loader2,
  Percent,
  Plus,
  RefreshCw,
  Save,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_PROMOTIONS_MESSAGES,
  type AdminPromotionDiscountType,
  type AdminPromotionLanguage,
} from "@/config/admin-promotions-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

type LanguageCode =
  AdminPromotionLanguage;

type DiscountType =
  AdminPromotionDiscountType;

interface SelectableItem {
  id: number;
  name?: unknown;
}

interface EstablishmentRow {
  id: number;
  currency?: string | null;
}

interface PromotionConditions {
  minAmount?: string;
  productIds?: number[];
  categoryIds?: number[];
  menuIds?: number[];
  [key: string]: unknown;
}

interface PromotionRow {
  id: number;
  establishmentId: number;
  name: Record<string, string>;
  description:
    | Record<string, string>
    | null;
  code: string | null;
  discountType: DiscountType;
  discountValue: string;
  conditions:
    | PromotionConditions
    | null;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usageCount: number | null;
  active: boolean;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PromotionForm {
  name: Record<
    LanguageCode,
    string
  >;

  description: Record<
    LanguageCode,
    string
  >;

  code: string;

  discountType:
    DiscountType;

  discountValue:
    string;

  minAmount:
    string;

  productIds:
    number[];

  categoryIds:
    number[];

  menuIds:
    number[];

  startDate:
    string;

  endDate:
    string;

  usageLimit:
    string;

  active:
    boolean;
}

const LANGUAGE_OPTIONS: Array<{
  code: LanguageCode;
  label: string;
}> = [
  {
    code: "es",
    label: "Español",
  },
  {
    code: "en",
    label: "English",
  },
  {
    code: "de",
    label: "Deutsch",
  },
  {
    code: "fr",
    label: "Français",
  },
  {
    code: "it",
    label: "Italiano",
  },
  {
    code: "pt",
    label: "Português",
  },
];

const DISCOUNT_TYPES:
  DiscountType[] = [
    "percentage",
    "fixed",
    "free_item",
  ];

const EMPTY_TRANSLATIONS: Record<
  LanguageCode,
  string
> = {
  es: "",
  en: "",
  de: "",
  fr: "",
  it: "",
  pt: "",
};

function toLocalInputValue(
  value:
    | Date
    | string
) {
  const date =
    value instanceof Date
      ? value
      : new Date(
          value
        );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const offset =
    date.getTimezoneOffset();

  const localDate =
    new Date(
      date.getTime() -
        offset *
          60_000
    );

  return localDate
    .toISOString()
    .slice(
      0,
      16
    );
}

function getDefaultEndDate() {
  const date =
    new Date();

  date.setDate(
    date.getDate() +
      7
  );

  return toLocalInputValue(
    date
  );
}

function createEmptyForm():
  PromotionForm {
  return {
    name: {
      ...EMPTY_TRANSLATIONS,
    },

    description: {
      ...EMPTY_TRANSLATIONS,
    },

    code:
      "",

    discountType:
      "percentage",

    discountValue:
      "",

    minAmount:
      "",

    productIds:
      [],

    categoryIds:
      [],

    menuIds:
      [],

    startDate:
      toLocalInputValue(
        new Date()
      ),

    endDate:
      getDefaultEndDate(),

    usageLimit:
      "",

    active:
      true,
  };
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

  const preferred:
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
    of preferred
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

  const fallback =
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

  return typeof fallback ===
    "string"
    ? fallback.trim()
    : "";
}

function buildTranslatedPayload(
  values:
    Record<
      LanguageCode,
      string
    >
) {
  const result:
    Record<
      string,
      string
    > = {};

  for (
    const language
    of LANGUAGE_OPTIONS
  ) {
    const value =
      values[
        language.code
      ].trim();

    if (
      value
    ) {
      result[
        language.code
      ] =
        value;
    }
  }

  return result;
}

function fillTranslations(
  value:
    | Record<
        string,
        string
      >
    | null
    | undefined
) {
  const result:
    Record<
      LanguageCode,
      string
    > = {
      ...EMPTY_TRANSLATIONS,
    };

  if (
    !value
  ) {
    return result;
  }

  for (
    const language
    of LANGUAGE_OPTIONS
  ) {
    const text =
      value[
        language.code
      ];

    result[
      language.code
    ] =
      typeof text ===
        "string"
        ? text
        : "";
  }

  return result;
}

function isValidDecimal(
  value:
    string
) {
  return /^\d+(\.\d{1,2})?$/.test(
    value
  );
}

function toggleArrayValue(
  current:
    number[],
  id:
    number
) {
  if (
    current.includes(
      id
    )
  ) {
    return current.filter(
      (
        value
      ) =>
        value !==
        id
    );
  }

  return [
    ...current,
    id,
  ];
}

export default function PromotionsManager() {
  const language =
    useAdminLanguageStore(
      (
        state
      ) =>
        state.language
    ) as LanguageCode;

  const messages =
    ADMIN_PROMOTIONS_MESSAGES[
      language
    ];

  const [
    promotions,
    setPromotions,
  ] =
    useState<
      PromotionRow[]
    >([]);

  const [
    products,
    setProducts,
  ] =
    useState<
      SelectableItem[]
    >([]);

  const [
    categories,
    setCategories,
  ] =
    useState<
      SelectableItem[]
    >([]);

  const [
    menus,
    setMenus,
  ] =
    useState<
      SelectableItem[]
    >([]);

  const [
    currency,
    setCurrency,
  ] =
    useState(
      ""
    );

  const [
    form,
    setForm,
  ] =
    useState<
      PromotionForm
    >(
      createEmptyForm()
    );

  const [
    conditionExtras,
    setConditionExtras,
  ] =
    useState<
      Record<
        string,
        unknown
      >
    >({});

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
    return ADMIN_PROMOTIONS_MESSAGES[
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
            promotionsResponse,
            productsResponse,
            categoriesResponse,
            menusResponse,
            establishmentsResponse,
          ] =
            await Promise.all([
              adminFetch(
                "/api/promotions"
              ),

              adminFetch(
                "/api/products"
              ),

              adminFetch(
                "/api/categories"
              ),

              adminFetch(
                "/api/menus"
              ),

              adminFetch(
                "/api/establishments"
              ),
            ]);

          const [
            promotionsJson,
            productsJson,
            categoriesJson,
            menusJson,
            establishmentsJson,
          ] =
            await Promise.all([
              promotionsResponse
                .json() as Promise<
                  ApiResponse<
                    PromotionRow[]
                  >
                >,

              productsResponse
                .json() as Promise<
                  ApiResponse<
                    SelectableItem[]
                  >
                >,

              categoriesResponse
                .json() as Promise<
                  ApiResponse<
                    SelectableItem[]
                  >
                >,

              menusResponse
                .json() as Promise<
                  ApiResponse<
                    SelectableItem[]
                  >
                >,

              establishmentsResponse
                .json() as Promise<
                  ApiResponse<
                    EstablishmentRow[]
                  >
                >,
            ]);

          if (
            !promotionsResponse.ok ||
            !promotionsJson.success
          ) {
            setError(
              activeMessages
                .loadPromotionsError
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

          if (
            !categoriesResponse.ok ||
            !categoriesJson.success
          ) {
            setError(
              activeMessages
                .loadCategoriesError
            );

            return;
          }

          if (
            !menusResponse.ok ||
            !menusJson.success
          ) {
            setError(
              activeMessages
                .loadMenusError
            );

            return;
          }

          setPromotions(
            Array.isArray(
              promotionsJson.data
            )
              ? promotionsJson.data
              : []
          );

          setProducts(
            Array.isArray(
              productsJson.data
            )
              ? productsJson.data
              : []
          );

          setCategories(
            Array.isArray(
              categoriesJson.data
            )
              ? categoriesJson.data
              : []
          );

          setMenus(
            Array.isArray(
              menusJson.data
            )
              ? menusJson.data
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
          loadError
        ) {
          console.error(
            "Error loading promotions:",
            loadError
          );

          setError(
            activeMessages
              .loadDataError
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

  const activeCount =
    useMemo(
      () =>
        promotions.filter(
          (
            promotion
          ) =>
            promotion.active
        ).length,
      [
        promotions,
      ]
    );

  const currentlyValidCount =
    useMemo(
      () => {
        const now =
          Date.now();

        return promotions.filter(
          (
            promotion
          ) => {
            const start =
              new Date(
                promotion.startDate
              ).getTime();

            const end =
              new Date(
                promotion.endDate
              ).getTime();

            return (
              promotion.active &&
              start <=
                now &&
              end >
                now
            );
          }
        ).length;
      },
      [
        promotions,
      ]
    );

  function resetForm() {
    setEditingId(
      null
    );

    setForm(
      createEmptyForm()
    );

    setConditionExtras(
      {}
    );

    setError(
      ""
    );

    setSuccess(
      ""
    );
  }

  function updateTranslation(
    field:
      | "name"
      | "description",
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

        [field]: {
          ...current[
            field
          ],

          [code]:
            value,
        },
      })
    );
  }

  function startEditing(
    promotion:
      PromotionRow
  ) {
    const knownKeys =
      new Set([
        "minAmount",
        "productIds",
        "categoryIds",
        "menuIds",
      ]);

    const extras:
      Record<
        string,
        unknown
      > = {};

    if (
      promotion.conditions
    ) {
      for (
        const [
          key,
          value,
        ] of Object.entries(
          promotion.conditions
        )
      ) {
        if (
          !knownKeys.has(
            key
          )
        ) {
          extras[
            key
          ] =
            value;
        }
      }
    }

    setEditingId(
      promotion.id
    );

    setConditionExtras(
      extras
    );

    setForm({
      name:
        fillTranslations(
          promotion.name
        ),

      description:
        fillTranslations(
          promotion.description
        ),

      code:
        promotion.code ??
        "",

      discountType:
        promotion.discountType,

      discountValue:
        promotion.discountValue,

      minAmount:
        promotion.conditions
          ?.minAmount ??
        "",

      productIds:
        Array.isArray(
          promotion.conditions
            ?.productIds
        )
          ? promotion.conditions
              ?.productIds ??
            []
          : [],

      categoryIds:
        Array.isArray(
          promotion.conditions
            ?.categoryIds
        )
          ? promotion.conditions
              ?.categoryIds ??
            []
          : [],

      menuIds:
        Array.isArray(
          promotion.conditions
            ?.menuIds
        )
          ? promotion.conditions
              ?.menuIds ??
            []
          : [],

      startDate:
        toLocalInputValue(
          promotion.startDate
        ),

      endDate:
        toLocalInputValue(
          promotion.endDate
        ),

      usageLimit:
        promotion.usageLimit !==
        null
          ? String(
              promotion.usageLimit
            )
          : "",

      active:
        promotion.active,
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

  function validateForm() {
    const activeMessages =
      currentMessages();

    const name =
      buildTranslatedPayload(
        form.name
      );

    if (
      Object.keys(
        name
      ).length ===
      0
    ) {
      return activeMessages
        .invalidName;
    }

    if (
      form.code.trim().length >
      100
    ) {
      return activeMessages
        .codeTooLong;
    }

    const discountValue =
      form.discountValue.trim();

    if (
      !discountValue ||
      !isValidDecimal(
        discountValue
      )
    ) {
      return activeMessages
        .invalidDiscount;
    }

    const numericValue =
      Number(
        discountValue
      );

    if (
      form.discountType ===
        "percentage" &&
      (
        numericValue <=
          0 ||
        numericValue >
          100
      )
    ) {
      return activeMessages
        .invalidPercentage;
    }

    if (
      form.discountType ===
        "fixed" &&
      numericValue <=
        0
    ) {
      return activeMessages
        .invalidFixed;
    }

    if (
      form.minAmount.trim() &&
      !isValidDecimal(
        form.minAmount.trim()
      )
    ) {
      return activeMessages
        .invalidMinimum;
    }

    if (
      !form.startDate ||
      !form.endDate
    ) {
      return activeMessages
        .datesRequired;
    }

    const start =
      new Date(
        form.startDate
      );

    const end =
      new Date(
        form.endDate
      );

    if (
      Number.isNaN(
        start.getTime()
      ) ||
      Number.isNaN(
        end.getTime()
      )
    ) {
      return activeMessages
        .datesInvalid;
    }

    if (
      end <=
      start
    ) {
      return activeMessages
        .invalidDateRange;
    }

    if (
      form.usageLimit.trim()
    ) {
      const usageLimit =
        Number(
          form.usageLimit
        );

      if (
        !Number.isInteger(
          usageLimit
        ) ||
        usageLimit <=
          0
      ) {
        return activeMessages
          .invalidUsageLimit;
      }
    }

    return null;
  }

  function buildConditions():
    | PromotionConditions
    | null {
    const conditions:
      PromotionConditions = {
        ...conditionExtras,
      };

    const minAmount =
      form.minAmount.trim();

    if (
      minAmount
    ) {
      conditions.minAmount =
        minAmount;
    }

    if (
      form.productIds.length >
      0
    ) {
      conditions.productIds =
        form.productIds;
    }

    if (
      form.categoryIds.length >
      0
    ) {
      conditions.categoryIds =
        form.categoryIds;
    }

    if (
      form.menuIds.length >
      0
    ) {
      conditions.menuIds =
        form.menuIds;
    }

    return Object.keys(
      conditions
    ).length >
      0
      ? conditions
      : null;
  }

  async function savePromotion() {
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

    const name =
      buildTranslatedPayload(
        form.name
      );

    const description =
      buildTranslatedPayload(
        form.description
      );

    const usageLimit =
      form.usageLimit.trim()
        ? Number(
            form.usageLimit
          )
        : null;

    const isEditing =
      editingId !==
      null;

    setSaving(
      true
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
          isEditing
            ? `/api/promotions/${editingId}`
            : "/api/promotions",
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
                name,

                description:
                  Object.keys(
                    description
                  ).length >
                  0
                    ? description
                    : null,

                code:
                  form.code.trim() ||
                  null,

                discountType:
                  form.discountType,

                discountValue:
                  form.discountValue
                    .trim(),

                conditions:
                  buildConditions(),

                startDate:
                  new Date(
                    form.startDate
                  ).toISOString(),

                endDate:
                  new Date(
                    form.endDate
                  ).toISOString(),

                usageLimit,

                active:
                  form.active,
              }),
          }
        );

      const json =
        (await response.json()) as
          ApiResponse<
            PromotionRow
          >;

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          json.error ||
          json.message ||
          (
            isEditing
              ? activeMessages
                  .updateError
              : activeMessages
                  .createError
          )
        );

        return;
      }

      setEditingId(
        null
      );

      setForm(
        createEmptyForm()
      );

      setConditionExtras(
        {}
      );

      await loadData(
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
        "Error saving promotion:",
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

  async function toggleActive(
    promotion:
      PromotionRow
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
          `/api/promotions/${promotion.id}`,
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
                  !promotion.active,
              }),
          }
        );

      const json =
        (await response.json()) as
          ApiResponse<
            PromotionRow
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

      setPromotions(
        (
          current
        ) =>
          current.map(
            (
              item
            ) =>
              item.id ===
              promotion.id
                ? {
                    ...item,

                    active:
                      !promotion.active,
                  }
                : item
          )
      );

      setSuccess(
        promotion.active
          ? activeMessages
              .deactivatedSuccess
          : activeMessages
              .activatedSuccess
      );
    } catch (
      toggleError
    ) {
      console.error(
        "Error toggling promotion:",
        toggleError
      );

      setError(
        activeMessages
          .toggleError
      );
    }
  }

  async function deletePromotion(
    promotion:
      PromotionRow
  ) {
    const activeMessages =
      currentMessages();

    const label =
      getTranslatedText(
        promotion.name,
        currentLanguage()
      ) ||
      activeMessages
        .fallbackPromotion(
          promotion.id
        );

    const confirmed =
      window.confirm(
        activeMessages
          .deleteConfirm(
            label
          )
      );

    if (
      !confirmed
    ) {
      return;
    }

    setDeletingId(
      promotion.id
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
          `/api/promotions/${promotion.id}`,
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

      setPromotions(
        (
          current
        ) =>
          current.filter(
            (
              item
            ) =>
              item.id !==
              promotion.id
          )
      );

      if (
        editingId ===
        promotion.id
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
        "Error deleting promotion:",
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

  function formatCurrency(
    value:
      string
  ) {
    const amount =
      Number(
        value
      );

    if (
      !currency
    ) {
      return amount.toFixed(
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
        amount
      );
    } catch {
      return `${amount.toFixed(
        2
      )} ${currency}`;
    }
  }

  function formatDate(
    value:
      string
  ) {
    return new Date(
      value
    ).toLocaleDateString(
      ADMIN_LANGUAGE_LOCALES[
        language
      ]
    );
  }

  function getDiscountLabel(
    promotion:
      PromotionRow
  ) {
    if (
      promotion.discountType ===
      "percentage"
    ) {
      return `${promotion.discountValue}%`;
    }

    if (
      promotion.discountType ===
      "fixed"
    ) {
      return `${formatCurrency(
        promotion.discountValue
      )} ${messages.fixedDiscountSuffix}`;
    }

    return messages
      .discounts
      .free_item;
  }

  function getPromotionStatus(
    promotion:
      PromotionRow
  ) {
    if (
      !promotion.active
    ) {
      return {
        label:
          messages.statuses
            .inactive,

        className:
          "bg-slate-100 text-slate-600",
      };
    }

    const now =
      Date.now();

    const start =
      new Date(
        promotion.startDate
      ).getTime();

    const end =
      new Date(
        promotion.endDate
      ).getTime();

    if (
      start >
      now
    ) {
      return {
        label:
          messages.statuses
            .scheduled,

        className:
          "bg-blue-50 text-blue-700",
      };
    }

    if (
      end <=
      now
    ) {
      return {
        label:
          messages.statuses
            .finished,

        className:
          "bg-amber-50 text-amber-700",
      };
    }

    return {
      label:
        messages.statuses
          .running,

      className:
        "bg-emerald-50 text-emerald-700",
    };
  }

  function renderSelector(
    title:
      string,
    items:
      SelectableItem[],
    selected:
      number[],
    onChange:
      (
        id:
          number
      ) => void
  ) {
    return (
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">
          {
            title
          }
        </p>

        {items.length ===
        0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">
            {
              messages.noItems
            }
          </p>
        ) : (
          <div className="max-h-52 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-3">
            {items.map(
              (
                item
              ) => (
                <label
                  key={
                    item.id
                  }
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm transition hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={
                      selected.includes(
                        item.id
                      )
                    }
                    onChange={() =>
                      onChange(
                        item.id
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />

                  <span className="min-w-0 truncate text-slate-700">
                    {getTranslatedText(
                      item.name,
                      language
                    ) ||
                      `#${item.id}`}
                  </span>
                </label>
              )
            )}
          </div>
        )}
      </div>
    );
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

  const minimumLabel =
    currency
      ? `${messages.minAmount} (${currency})`
      : messages.minAmount;

  const discountValueLabel =
    form.discountType ===
      "fixed" &&
    currency
      ? `${messages.discountValue} (${currency})`
      : messages.discountValue;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Tag
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
            ? messages.refreshing
            : messages.refresh}
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
              messages.statPromotions
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {
              promotions.length
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
              messages.statRunning
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {
              currentlyValidCount
            }
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId
                ? messages.editPromotion
                : messages.newPromotion}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? messages.editingPromotion(
                    editingId
                  )
                : messages.createDescription}
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

        <div className="mt-6 space-y-7">
          <div>
            <h3 className="font-medium text-slate-900">
              {
                messages.name
              }
            </h3>

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
                        updateTranslation(
                          "name",
                          option.code,
                          event.target
                            .value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-slate-900">
              {
                messages.description
              }
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {
                messages
                  .optionalDescription
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

                    <textarea
                      rows={
                        3
                      }
                      value={
                        form.description[
                          option.code
                        ]
                      }
                      onChange={(
                        event
                      ) =>
                        updateTranslation(
                          "description",
                          option.code,
                          event.target
                            .value
                        )
                      }
                      className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {
                  messages.code
                }
              </label>

              <input
                type="text"
                maxLength={
                  100
                }
                value={
                  form.code
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      code:
                        event.target
                          .value,
                    })
                  )
                }
                placeholder={
                  messages
                    .codePlaceholder
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {
                  messages.discountType
                }
              </label>

              <select
                value={
                  form.discountType
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      discountType:
                        event.target
                          .value as
                          DiscountType,
                    })
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {DISCOUNT_TYPES.map(
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
                        messages
                          .discounts[
                            type
                          ]
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {
                  discountValueLabel
                }
              </label>

              <input
                type="text"
                inputMode="decimal"
                value={
                  form.discountValue
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      discountValue:
                        event.target
                          .value,
                    })
                  )
                }
                placeholder={
                  form.discountType ===
                  "percentage"
                    ? "20"
                    : form.discountType ===
                        "fixed"
                      ? "5.00"
                      : "0"
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {
                  messages.usageLimit
                }
              </label>

              <input
                type="number"
                min={
                  1
                }
                step={
                  1
                }
                value={
                  form.usageLimit
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      usageLimit:
                        event.target
                          .value,
                    })
                  )
                }
                placeholder={
                  messages.noUsageLimit
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {
                  messages.start
                }
              </label>

              <input
                type="datetime-local"
                value={
                  form.startDate
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      startDate:
                        event.target
                          .value,
                    })
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {
                  messages.end
                }
              </label>

              <input
                type="datetime-local"
                value={
                  form.endDate
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      endDate:
                        event.target
                          .value,
                    })
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {
                  minimumLabel
                }
              </label>

              <input
                type="text"
                inputMode="decimal"
                value={
                  form.minAmount
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      minAmount:
                        event.target
                          .value,
                    })
                  )
                }
                placeholder={
                  messages.noMinimum
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h3 className="font-medium text-slate-900">
                {
                  messages.scope
                }
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {
                  messages.scopeHelp
                }
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {renderSelector(
                messages.menus,
                menus,
                form.menuIds,
                (
                  id
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      menuIds:
                        toggleArrayValue(
                          current.menuIds,
                          id
                        ),
                    })
                  )
              )}

              {renderSelector(
                messages.categories,
                categories,
                form.categoryIds,
                (
                  id
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      categoryIds:
                        toggleArrayValue(
                          current.categoryIds,
                          id
                        ),
                    })
                  )
              )}

              {renderSelector(
                messages.products,
                products,
                form.productIds,
                (
                  id
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      productIds:
                        toggleArrayValue(
                          current.productIds,
                          id
                        ),
                    })
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
                void savePromotion()
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
                    ? messages.saveChanges
                    : messages.createPromotion}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900">
            {
              messages
                .configuredPromotions
            }
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {
              messages
                .configuredHelp
            }
          </p>
        </div>

        {promotions.length ===
        0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
            <Gift
              size={
                32
              }
              className="text-slate-400"
            />

            <h3 className="mt-4 font-semibold text-slate-900">
              {
                messages.noPromotions
              }
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {
                messages
                  .createFirstPromotion
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {promotions.map(
              (
                promotion
              ) => {
                const status =
                  getPromotionStatus(
                    promotion
                  );

                const name =
                  getTranslatedText(
                    promotion.name,
                    language
                  ) ||
                  messages
                    .fallbackPromotion(
                      promotion.id
                    );

                return (
                  <div
                    key={
                      promotion.id
                    }
                    className="p-6"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {
                              name
                            }
                          </h3>

                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                            {
                              status.label
                            }
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                            {promotion.discountType ===
                            "percentage" ? (
                              <Percent
                                size={
                                  13
                                }
                              />
                            ) : (
                              <Gift
                                size={
                                  13
                                }
                              />
                            )}

                            {
                              getDiscountLabel(
                                promotion
                              )
                            }
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                          {promotion.code && (
                            <span>
                              {
                                messages
                                  .codeLabel
                              }
                              :{" "}

                              <strong className="font-medium text-slate-700">
                                {
                                  promotion.code
                                }
                              </strong>
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays
                              size={
                                14
                              }
                            />

                            {
                              formatDate(
                                promotion.startDate
                              )
                            }

                            {" → "}

                            {
                              formatDate(
                                promotion.endDate
                              )
                            }
                          </span>

                          <span>
                            {
                              messages.uses
                            }
                            :{" "}

                            {
                              promotion.usageCount ??
                              0
                            }

                            {promotion.usageLimit !==
                              null &&
                              ` / ${promotion.usageLimit}`}
                          </span>

                          <span>
                            ID #
                            {
                              promotion.id
                            }
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            void toggleActive(
                              promotion
                            )
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                            promotion.active
                              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {promotion.active
                            ? messages.deactivate
                            : messages.activate}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              promotion
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
                            void deletePromotion(
                              promotion
                            )
                          }
                          disabled={
                            deletingId ===
                            promotion.id
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId ===
                          promotion.id ? (
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
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}