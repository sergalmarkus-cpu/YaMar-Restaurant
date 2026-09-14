"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CircleDollarSign,
  Contact,
  Eye,
  Loader2,
  RefreshCw,
  Repeat2,
  UserCheck,
  UserPlus,
  Users,
  UsersRound,
  WalletCards,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  ADMIN_CLIENT_ANALYTICS_MESSAGES,
} from "@/config/admin-client-analytics-i18n";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import ClientAnalyticsChart from "./ClientAnalyticsChart";

type Period =
  | 7
  | 30
  | 90;

interface ClientAnalyticsDay {
  date: string;
  label: string;
  visits: number;
  customers: number;
  newCustomers: number;
  returningCustomers: number;
}

interface TopCustomer {
  key: string;
  visits: number;
  totalPaid: number;
}

interface ClientAnalyticsResponse {
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
    uniqueCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    identifiedCustomers: number;
    anonymousCustomers: number;
    payingCustomers: number;
    totalVisits: number;
    totalRevenue: number;
    averageSpendPerCustomer: number;
    averageVisitsPerCustomer: number;
    repeatRate: number;
  };

  daily:
    ClientAnalyticsDay[];

  topCustomers:
    TopCustomer[];
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

function formatNumber(
  value: number,
  locale: string,
  maximumFractionDigits =
    2
) {
  return new Intl.NumberFormat(
    locale,
    {
      maximumFractionDigits,
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

function formatCustomerKey(
  key: string
) {
  if (
    key.startsWith(
      "email:"
    )
  ) {
    return key.slice(
      "email:".length
    );
  }

  if (
    key.startsWith(
      "phone:"
    )
  ) {
    return key.slice(
      "phone:".length
    );
  }

  return key;
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

export default function ClientAnalyticsView() {
  const language =
    useAdminLanguageStore(
      (
        state
      ) =>
        state.language
    );

  const messages =
    ADMIN_CLIENT_ANALYTICS_MESSAGES[
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
      ClientAnalyticsResponse |
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
              `/api/analytics/clients?days=${selectedPeriod}`
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
              ClientAnalyticsResponse
          );
        } catch (
          loadError
        ) {
          console.error(
            "Error loading client analytics:",
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title={
                messages.metrics
                  .uniqueCustomers
              }
              value={
                data.summary
                  .uniqueCustomers
              }
              subtitle={
                messages.metrics
                  .uniqueCustomersSubtitle
              }
              icon={
                Users
              }
            />

            <MetricCard
              title={
                messages.metrics
                  .newCustomers
              }
              value={
                data.summary
                  .newCustomers
              }
              subtitle={
                messages.metrics
                  .newCustomersSubtitle
              }
              icon={
                UserPlus
              }
            />

            <MetricCard
              title={
                messages.metrics
                  .returningCustomers
              }
              value={
                data.summary
                  .returningCustomers
              }
              subtitle={
                messages.metrics
                  .returningCustomersSubtitle
              }
              icon={
                Repeat2
              }
            />

            <MetricCard
              title={
                messages.metrics
                  .visits
              }
              value={
                data.summary
                  .totalVisits
              }
              subtitle={
                messages.metrics
                  .visitsSubtitle
              }
              icon={
                Eye
              }
            />

            <MetricCard
              title={
                messages.metrics
                  .identifiedCustomers
              }
              value={
                data.summary
                  .identifiedCustomers
              }
              subtitle={
                messages.metrics
                  .identifiedCustomersSubtitle
              }
              icon={
                Contact
              }
            />

            <MetricCard
              title={
                messages.metrics
                  .anonymousCustomers
              }
              value={
                data.summary
                  .anonymousCustomers
              }
              subtitle={
                messages.metrics
                  .anonymousCustomersSubtitle
              }
              icon={
                UsersRound
              }
            />

            <MetricCard
              title={
                messages.metrics
                  .payingCustomers
              }
              value={
                data.summary
                  .payingCustomers
              }
              subtitle={
                messages.metrics
                  .payingCustomersSubtitle
              }
              icon={
                UserCheck
              }
            />

            <MetricCard
              title={
                messages.metrics
                  .associatedRevenue
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
                  .associatedRevenueSubtitle
              }
              icon={
                CircleDollarSign
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <ClientAnalyticsChart
                data={
                  data.daily
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
                visitsLabel={
                  messages.chart
                    .visits
                }
                customersLabel={
                  messages.chart
                    .customers
                }
                newCustomersLabel={
                  messages.chart
                    .newCustomers
                }
                returningCustomersLabel={
                  messages.chart
                    .returningCustomers
                }
              />
            </div>

            <div className="space-y-4">
              <MetricCard
                title={
                  messages.metrics
                    .averageSpend
                }
                value={
                  formatMoney(
                    data.summary
                      .averageSpendPerCustomer,
                    currency,
                    locale
                  )
                }
                subtitle={
                  messages.metrics
                    .averageSpendSubtitle
                }
                icon={
                  WalletCards
                }
              />

              <MetricCard
                title={
                  messages.metrics
                    .averageVisits
                }
                value={
                  formatNumber(
                    data.summary
                      .averageVisitsPerCustomer,
                    locale
                  )
                }
                subtitle={
                  messages.metrics
                    .averageVisitsSubtitle
                }
                icon={
                  Eye
                }
              />

              <MetricCard
                title={
                  messages.metrics
                    .repeatRate
                }
                value={`${formatNumber(
                  data.summary
                    .repeatRate,
                  locale
                )} %`}
                subtitle={
                  messages.metrics
                    .repeatRateSubtitle
                }
                icon={
                  Repeat2
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-semibold text-slate-900">
                {
                  messages.topCustomers
                    .title
                }
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {
                  messages.topCustomers
                    .subtitle
                }
              </p>
            </div>

            {data.topCustomers.length ===
            0 ? (
              <div className="px-6 py-10 text-center text-sm text-slate-500">
                {
                  messages.topCustomers
                    .empty
                }
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        #
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {
                          messages.topCustomers
                            .customer
                        }
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {
                          messages.topCustomers
                            .visits
                        }
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {
                          messages.topCustomers
                            .amountPaid
                        }
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {data.topCustomers.map(
                      (
                        customer,
                        index
                      ) => (
                        <tr
                          key={
                            customer.key
                          }
                          className="transition hover:bg-slate-50"
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                            {
                              index +
                              1
                            }
                          </td>

                          <td className="px-6 py-4 text-sm font-medium text-slate-900">
                            {
                              formatCustomerKey(
                                customer.key
                              )
                            }
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-700">
                            {
                              customer.visits
                            }
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-slate-900">
                            {formatMoney(
                              customer.totalPaid,
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
                          .visits
                      }
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {
                        messages.daily
                          .customers
                      }
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {
                        messages.daily
                          .newCustomers
                      }
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {
                        messages.daily
                          .returningCustomers
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
                            day.visits
                          }
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-700">
                          {
                            day.customers
                          }
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-emerald-700">
                          {
                            day.newCustomers
                          }
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-amber-700">
                          {
                            day.returningCustomers
                          }
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