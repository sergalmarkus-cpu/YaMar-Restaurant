"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BadgeEuro,
  Boxes,
  CalendarDays,
  Loader2,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Star,
  TrendingUp,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_PRODUCT_ANALYTICS_MESSAGES,
} from "@/config/admin-product-analytics-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import type {
  Language,
} from "@/types";

import ProductAnalyticsChart from "./ProductAnalyticsChart";

type Period =
  | 7
  | 30
  | 90;

interface TranslatedText {
  es?: string;
  en?: string;
  de?: string;
  fr?: string;
  it?: string;
  pt?: string;
}

interface ProductAnalyticsDay {
  date: string;
  label: string;
  units: number;
  revenue: number;
  orders: number;
}

interface ProductRankingItem {
  productId: number;
  name: unknown;
  units: number;
  revenue: number;
  orders: number;
  averageUnitPrice: number;
}

interface TopProduct {
  productId: number;
  name: unknown;
  units: number;
  revenue: number;
}

interface ProductAnalyticsResponse {
  establishment: {
    id: number;
    name: string;
    currency: string;
    timezone: string;
  };

  period: {
    days: Period;
    from: string;
    to: string;
  };

  summary: {
    totalUnits: number;
    totalRevenue: number;
    totalOrders: number;
    distinctProducts: number;
    averageUnitsPerOrder: number;
    averageDailyUnits: number;
    topProduct: TopProduct | null;
  };

  daily:
    ProductAnalyticsDay[];

  ranking:
    ProductRankingItem[];
}

interface MetricCardProps {
  title: string;
  value:
    string |
    number;
  subtitle?: string;
  icon: LucideIcon;
}

function formatMoney(
  value: number,
  currency: string,
  locale: string
) {
  if (!currency) {
    return new Intl.NumberFormat(
      locale,
      {
        maximumFractionDigits:
          2,
      }
    ).format(
      value
    );
  }

  try {
    return new Intl.NumberFormat(
      locale,
      {
        style:
          "currency",
        currency,
        maximumFractionDigits:
          2,
      }
    ).format(
      value
    );
  } catch {
    return `${new Intl.NumberFormat(
      locale,
      {
        minimumFractionDigits:
          2,
        maximumFractionDigits:
          2,
      }
    ).format(value)} ${currency}`;
  }
}

function formatDecimal(
  value: number,
  locale: string
) {
  return new Intl.NumberFormat(
    locale,
    {
      minimumFractionDigits:
        0,
      maximumFractionDigits:
        2,
    }
  ).format(
    value
  );
}

function formatDate(
  value: string,
  locale: string
) {
  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      dateStyle:
        "medium",
    }
  ).format(
    date
  );
}

function getProductName(
  value: unknown,
  language: Language,
  fallback: string
) {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return fallback;
  }

  const translated =
    value as
      TranslatedText;

  const preferred =
    translated[
      language
    ];

  if (
    typeof preferred ===
      "string" &&
    preferred.trim()
  ) {
    return preferred;
  }

  const fallbackOrder:
    Language[] =
    [
      "es",
      "en",
      "fr",
      "de",
      "it",
      "pt",
    ];

  for (
    const candidateLanguage
    of fallbackOrder
  ) {
    const candidate =
      translated[
        candidateLanguage
      ];

    if (
      typeof candidate ===
        "string" &&
      candidate.trim()
    ) {
      return candidate;
    }
  }

  return fallback;
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon
            size={21}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProductAnalyticsView() {
  const language =
    useAdminLanguageStore(
      (
        state
      ) =>
        state.language
    );

  const messages =
    ADMIN_PRODUCT_ANALYTICS_MESSAGES[
      language
    ];

  const locale =
    ADMIN_LANGUAGE_LOCALES[
      language
    ];

  const [
    period,
    setPeriod,
  ] =
    useState<Period>(
      30
    );

  const [
    data,
    setData,
  ] =
    useState<
      ProductAnalyticsResponse |
      null
    >(null);

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
    error,
    setError,
  ] =
    useState("");

  const loadAnalytics =
    useCallback(
      async (
        selectedPeriod:
          Period,
        manualRefresh =
          false
      ) => {
        setError("");

        if (
          manualRefresh
        ) {
          setRefreshing(
            true
          );
        } else {
          setLoading(
            true
          );
        }

        try {
          const response =
            await adminFetch(
              `/api/analytics/products?days=${selectedPeriod}`
            );

          const json =
            await response.json();

          if (
            !response.ok ||
            !json.success
          ) {
            setError(
              messages.loadError
            );

            return;
          }

          setData(
            json.data as
              ProductAnalyticsResponse
          );
        } catch (
          loadError
        ) {
          console.error(
            "Error loading product analytics:",
            loadError
          );

          setError(
            messages.loadError
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
        messages.loadError,
      ]
    );

  useEffect(
    () => {
      void loadAnalytics(
        period
      );
    },
    [
      loadAnalytics,
      period,
    ]
  );

  const currency =
    data?.establishment
      .currency
      ?.trim()
      .toUpperCase() ??
    "";

  const periodLabel =
    useMemo(
      () => {
        if (
          period ===
          7
        ) {
          return messages.period
            .last7;
        }

        if (
          period ===
          90
        ) {
          return messages.period
            .last90;
        }

        return messages.period
          .last30;
      },
      [
        messages.period,
        period,
      ]
    );

  if (
    loading &&
    !data
  ) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
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

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              7,
              30,
              90,
            ] as Period[]
          ).map(
            (
              value
            ) => {
              const selected =
                value ===
                period;

              return (
                <button
                  key={
                    value
                  }
                  type="button"
                  onClick={() =>
                    setPeriod(
                      value
                    )
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    selected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {
                    messages.page.days(
                      value
                    )
                  }
                </button>
              );
            }
          )}

          <button
            type="button"
            onClick={() =>
              void loadAnalytics(
                period,
                true
              )
            }
            disabled={
              refreshing
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
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
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <CalendarDays
                  size={20}
                  className="text-indigo-600"
                />

                <div>
                  <p className="font-medium text-slate-900">
                    {
                      periodLabel
                    }
                  </p>

                  <p className="text-sm text-slate-500">
                    {formatDate(
                      data.period.from,
                      locale
                    )}
                    {" → "}
                    {formatDate(
                      data.period.to,
                      locale
                    )}
                  </p>
                </div>
              </div>

              <div className="text-sm text-slate-500">
                {
                  messages.period
                    .timezone
                }
                :{" "}

                <span className="font-medium text-slate-700">
                  {
                    data.establishment
                      .timezone
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              title={
                messages.metrics
                  .unitsSold
              }
              value={
                data.summary
                  .totalUnits
              }
              subtitle={
                messages.metrics
                  .unitsSoldSubtitle
              }
              icon={
                PackageCheck
              }
            />

            <MetricCard
              title={
                messages.metrics
                  .revenue
              }
              value={
                formatMoney(
                  data.summary
                    .totalRevenue,
                  currency,
                  locale
                )
              }
              subtitle={
                messages.metrics
                  .revenueSubtitle
              }
              icon={
                BadgeEuro
              }
            />

            <MetricCard
              title={
                messages.metrics
                  .orders
              }
              value={
                data.summary
                  .totalOrders
              }
              subtitle={
                messages.metrics
                  .ordersSubtitle
              }
              icon={
                ShoppingCart
              }
            />

            <MetricCard
              title={
                messages.metrics
                  .productsSold
              }
              value={
                data.summary
                  .distinctProducts
              }
              subtitle={
                messages.metrics
                  .productsSoldSubtitle
              }
              icon={
                ShoppingBag
              }
            />

            <MetricCard
              title={
                messages.metrics
                  .unitsPerOrder
              }
              value={
                formatDecimal(
                  data.summary
                    .averageUnitsPerOrder,
                  locale
                )
              }
              subtitle={
                messages.metrics
                  .unitsPerOrderSubtitle
              }
              icon={
                ReceiptText
              }
            />

            <MetricCard
              title={
                messages.metrics
                  .dailyAverage
              }
              value={
                formatDecimal(
                  data.summary
                    .averageDailyUnits,
                  locale
                )
              }
              subtitle={
                messages.metrics
                  .dailyAverageSubtitle
              }
              icon={
                TrendingUp
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <ProductAnalyticsChart
                data={
                  data.daily
                }
                currency={
                  currency
                }
                locale={
                  locale
                }
                title={
                  messages.chart
                    .title
                }
                subtitle={
                  messages.chart
                    .subtitle
                }
                unitsLabel={
                  messages.chart
                    .units
                }
                revenueLabel={
                  messages.chart
                    .revenue
                }
                unitsSoldLabel={
                  messages.chart
                    .unitsSold
                }
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Star
                    size={21}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {
                      messages.leader
                        .title
                    }
                  </h2>

                  <p className="text-sm text-slate-500">
                    {
                      messages.leader
                        .subtitle
                    }
                  </p>
                </div>
              </div>

              {data.summary.topProduct ? (
                <div className="mt-6">
                  <div className="rounded-2xl bg-indigo-50 p-5">
                    <p className="text-sm font-semibold text-indigo-900">
                      {getProductName(
                        data.summary
                          .topProduct
                          .name,
                        language,
                        messages.fallbackProduct
                      )}
                    </p>

                    <p className="mt-4 text-3xl font-bold text-indigo-900">
                      {
                        data.summary
                          .topProduct
                          .units
                      }
                    </p>

                    <p className="mt-1 text-sm text-indigo-700">
                      {
                        messages.leader
                          .unitsSold
                      }
                    </p>

                    <div className="mt-5 border-t border-indigo-100 pt-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                        {
                          messages.leader
                            .revenueGenerated
                        }
                      </p>

                      <p className="mt-1 text-lg font-semibold text-indigo-900">
                        {formatMoney(
                          data.summary
                            .topProduct
                            .revenue,
                          currency,
                          locale
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  {
                    messages.leader
                      .empty
                  }
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <Boxes
                  size={20}
                  className="text-indigo-600"
                />

                <div>
                  <h2 className="font-semibold text-slate-900">
                    {
                      messages.ranking
                        .title
                    }
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {
                      messages.ranking
                        .subtitle
                    }
                  </p>
                </div>
              </div>
            </div>

            {data.ranking.length ===
            0 ? (
              <div className="px-6 py-12 text-center text-sm text-slate-500">
                {
                  messages.ranking
                    .empty
                }
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {
                          messages.ranking
                            .position
                        }
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {
                          messages.ranking
                            .product
                        }
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {
                          messages.ranking
                            .units
                        }
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {
                          messages.ranking
                            .orders
                        }
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {
                          messages.ranking
                            .averagePrice
                        }
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {
                          messages.ranking
                            .revenue
                        }
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {data.ranking.map(
                      (
                        product,
                        index
                      ) => (
                        <tr
                          key={
                            product.productId
                          }
                          className="transition hover:bg-slate-50"
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                                index ===
                                0
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {
                                index +
                                1
                              }
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="max-w-[320px]">
                              <p className="truncate text-sm font-medium text-slate-900">
                                {getProductName(
                                  product.name,
                                  language,
                                  messages.fallbackProduct
                                )}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                ID #
                                {
                                  product.productId
                                }
                              </p>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-slate-900">
                            {
                              product.units
                            }
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-700">
                            {
                              product.orders
                            }
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-700">
                            {formatMoney(
                              product.averageUnitPrice,
                              currency,
                              locale
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-slate-900">
                            {formatMoney(
                              product.revenue,
                              currency,
                              locale
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-semibold text-slate-900">
                {
                  messages.daily
                    .title
                }
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {
                  messages.daily
                    .subtitle
                }
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {
                        messages.daily
                          .date
                      }
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {
                        messages.daily
                          .units
                      }
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {
                        messages.daily
                          .orders
                      }
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {
                        messages.daily
                          .revenue
                      }
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data.daily.map(
                    (
                      day
                    ) => (
                      <tr
                        key={
                          day.date
                        }
                        className="transition hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                          {formatDate(
                            day.date,
                            locale
                          )}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-700">
                          {
                            day.units
                          }
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-700">
                          {
                            day.orders
                          }
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-slate-900">
                          {formatMoney(
                            day.revenue,
                            currency,
                            locale
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}