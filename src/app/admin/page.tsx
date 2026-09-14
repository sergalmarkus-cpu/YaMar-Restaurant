"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  ChefHat,
  Euro,
  Loader2,
  LockKeyhole,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  ADMIN_DASHBOARD_MESSAGES,
  type AdminDashboardLanguage,
} from "@/config/admin-dashboard-i18n";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import RecentOrders from "./dashboard/RecentOrders";
import SalesChart from "./dashboard/SalesChart";
import StatsCard from "./dashboard/StatsCard";
import TopProducts from "./dashboard/TopProducts";

type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "cancelled";

interface DashboardResponse {
  establishment: {
    id: number;
    name: string;
    currency: string;
    timezone: string;
  };

  metrics: {
    sales: {
      today: number;
      yesterday: number;
      change: number;
    };

    orders: {
      today: number;
      yesterday: number;
      change: number;
    };

    customers: {
      today: number;
      yesterday: number;
      change: number;
    };

    averageTicket: {
      today: number;
      yesterday: number;
      change: number;
    };
  };

  kitchen: {
    ready: number;
    preparing: number;
    delayed: number;
  };

  weeklySales: Array<{
    date: string;
    label: string;
    sales: number;
  }>;

  recentOrders: Array<{
    id: number;
    orderNumber: string;
    tableId: number;
    tableName: string | null;
    itemCount: number;
    total: number;
    status: OrderStatus | null;
    createdAt: string;
  }>;

  topProducts: Array<{
    productId: number;
    name: unknown;
    quantity: number;
    revenue: number;
  }>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

function formatMoney(
  value: number,
  currency: string,
  locale: string
) {
  try {
    return new Intl.NumberFormat(
      locale,
      {
        style:
          "currency",

        currency,
      }
    ).format(
      value
    );
  } catch {
    return `${value.toFixed(
      2
    )} ${currency}`;
  }
}

function trend(
  change: number
) {
  return {
    value:
      Math.abs(
        change
      ),

    isPositive:
      change >=
      0,
  };
}

export default function AdminDashboard() {
  const language =
    useAdminLanguageStore(
      (
        state
      ) =>
        state.language
    ) as AdminDashboardLanguage;

  const messages =
    ADMIN_DASHBOARD_MESSAGES[
      language
    ];

  const locale =
    ADMIN_LANGUAGE_LOCALES[
      language
    ];

  const [
    dashboard,
    setDashboard,
  ] =
    useState<
      DashboardResponse |
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
    accessDenied,
    setAccessDenied,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const loadDashboard =
    useCallback(
      async (
        silent =
          false
      ) => {
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

        setAccessDenied(
          false
        );

        try {
          const response =
            await adminFetch(
              "/api/dashboard"
            );

          const json =
            (await response.json()) as
              ApiResponse<
                DashboardResponse
              >;

          if (
            response.status ===
            403
          ) {
            setDashboard(
              null
            );

            setAccessDenied(
              true
            );

            return;
          }

          if (
            !response.ok ||
            !json.success ||
            !json.data
          ) {
            setDashboard(
              null
            );

            setError(
              json.error ||
                json.message ||
                ADMIN_DASHBOARD_MESSAGES[
                  useAdminLanguageStore
                    .getState()
                    .language as
                    AdminDashboardLanguage
                ].unexpectedError
            );

            return;
          }

          setAccessDenied(
            false
          );

          setError(
            ""
          );

          setDashboard(
            json.data
          );
        } catch (
          loadError
        ) {
          console.error(
            "Error loading dashboard:",
            loadError
          );

          setDashboard(
            null
          );

          setAccessDenied(
            false
          );

          setError(
            ADMIN_DASHBOARD_MESSAGES[
              useAdminLanguageStore
                .getState()
                .language as
                AdminDashboardLanguage
            ].unexpectedError
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
      void loadDashboard();
    },
    [
      loadDashboard,
    ]
  );

  if (
    loading
  ) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            className="animate-spin"
            size={22}
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

  if (
    accessDenied
  ) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
            <LockKeyhole
              size={28}
            />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-slate-900">
            {
              messages
                .restrictedTitle
            }
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            {
              messages
                .restrictedDescription
            }
          </p>
        </div>
      </div>
    );
  }

  if (
    !dashboard
  ) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 text-red-600"
            size={22}
          />

          <div>
            <h1 className="font-semibold text-red-900">
              {
                messages
                  .loadErrorTitle
              }
            </h1>

            <p className="mt-1 text-sm text-red-700">
              {
                error ||
                messages
                  .unexpectedError
              }
            </p>

            <button
              type="button"
              onClick={() =>
                void loadDashboard()
              }
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              {
                messages.retry
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    currency,
  } =
    dashboard.establishment;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {
              messages.page.title
            }
          </h1>

          <p className="mt-1 text-slate-600">
            {
              messages.page.summary(
                dashboard.establishment.name
              )
            }
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadDashboard(
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
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title={
            messages.stats
              .salesToday
          }
          value={
            formatMoney(
              dashboard.metrics.sales.today,
              currency,
              locale
            )
          }
          icon={
            Euro
          }
          trend={
            trend(
              dashboard.metrics.sales.change
            )
          }
          subtitle={
            messages.stats.yesterday(
              formatMoney(
                dashboard.metrics.sales.yesterday,
                currency,
                locale
              )
            )
          }
          trendComparison={
            messages.stats
              .trendComparison
          }
        />

        <StatsCard
          title={
            messages.stats
              .orders
          }
          value={
            dashboard.metrics.orders.today
          }
          icon={
            ShoppingCart
          }
          trend={
            trend(
              dashboard.metrics.orders.change
            )
          }
          subtitle={
            messages.stats.yesterday(
              dashboard.metrics.orders.yesterday
            )
          }
          trendComparison={
            messages.stats
              .trendComparison
          }
        />

        <StatsCard
          title={
            messages.stats
              .customers
          }
          value={
            dashboard.metrics.customers.today
          }
          icon={
            Users
          }
          trend={
            trend(
              dashboard.metrics.customers.change
            )
          }
          subtitle={
            messages.stats.yesterday(
              dashboard.metrics.customers.yesterday
            )
          }
          trendComparison={
            messages.stats
              .trendComparison
          }
        />

        <StatsCard
          title={
            messages.stats
              .averageTicket
          }
          value={
            formatMoney(
              dashboard.metrics.averageTicket.today,
              currency,
              locale
            )
          }
          icon={
            TrendingUp
          }
          trend={
            trend(
              dashboard.metrics.averageTicket.change
            )
          }
          subtitle={
            messages.stats.yesterday(
              formatMoney(
                dashboard.metrics.averageTicket.yesterday,
                currency,
                locale
              )
            )
          }
          trendComparison={
            messages.stats
              .trendComparison
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalesChart
          data={
            dashboard.weeklySales
          }
          currency={
            currency
          }
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ChefHat
                size={22}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {
                  messages.kitchen
                    .title
                }
              </h3>

              <p className="text-sm text-slate-500">
                {
                  messages.kitchen
                    .description
                }
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />

                <span className="font-medium text-slate-900">
                  {
                    messages.kitchen
                      .ready
                  }
                </span>
              </div>

              <span className="text-2xl font-bold text-emerald-600">
                {
                  dashboard.kitchen.ready
                }
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-amber-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-amber-500" />

                <span className="font-medium text-slate-900">
                  {
                    messages.kitchen
                      .preparing
                  }
                </span>
              </div>

              <span className="text-2xl font-bold text-amber-600">
                {
                  dashboard.kitchen.preparing
                }
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-red-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-500" />

                <span className="font-medium text-slate-900">
                  {
                    messages.kitchen
                      .delayed
                  }
                </span>
              </div>

              <span className="text-2xl font-bold text-red-600">
                {
                  dashboard.kitchen.delayed
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentOrders
          orders={
            dashboard.recentOrders
          }
          currency={
            currency
          }
        />

        <TopProducts
          products={
            dashboard.topProducts
          }
          currency={
            currency
          }
        />
      </div>
    </div>
  );
}