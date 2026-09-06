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
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

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

function formatMoney(
  value: number,
  currency: string
) {
  try {
    return new Intl.NumberFormat(
      "es-ES",
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

        try {
          const response =
            await adminFetch(
              "/api/dashboard"
            );

          const json =
            await response.json();

          if (
            !response.ok ||
            !json.success
          ) {
            setError(
              json.error ||
                "No se pudo cargar el dashboard."
            );

            return;
          }

          setDashboard(
            json.data as DashboardResponse
          );
        } catch (
          error
        ) {
          console.error(
            "Error loading dashboard:",
            error
          );

          setError(
            "No se pudo cargar el dashboard."
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
            size={
              22
            }
          />

          <span>
            Cargando dashboard...
          </span>

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
            size={
              22
            }
          />

          <div>
            <h1 className="font-semibold text-red-900">
              No se pudo cargar el dashboard
            </h1>

            <p className="mt-1 text-sm text-red-700">
              {
                error ||
                "Se produjo un error inesperado."
              }
            </p>

            <button
              type="button"
              onClick={() =>
                void loadDashboard()
              }
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Reintentar
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
            Dashboard
          </h1>

          <p className="mt-1 text-slate-600">
            Resumen general de
            {" "}
            <span className="font-medium text-slate-800">
              {
                dashboard.establishment.name
              }
            </span>
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
            ? "Actualizando..."
            : "Actualizar"}
        </button>

      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="Ventas hoy"
          value={
            formatMoney(
              dashboard.metrics.sales.today,
              currency
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
          subtitle={`Ayer: ${formatMoney(
            dashboard.metrics.sales.yesterday,
            currency
          )}`}
        />

        <StatsCard
          title="Pedidos"
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
          subtitle={`Ayer: ${dashboard.metrics.orders.yesterday}`}
        />

        <StatsCard
          title="Clientes"
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
          subtitle={`Ayer: ${dashboard.metrics.customers.yesterday}`}
        />

        <StatsCard
          title="Ticket medio"
          value={
            formatMoney(
              dashboard.metrics.averageTicket.today,
              currency
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
          subtitle={`Ayer: ${formatMoney(
            dashboard.metrics.averageTicket.yesterday,
            currency
          )}`}
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
                size={
                  22
                }
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Estado de cocina
              </h3>

              <p className="text-sm text-slate-500">
                Situación actual de los pedidos activos.
              </p>
            </div>

          </div>

          <div className="space-y-4">

            <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4">

              <div className="flex items-center gap-3">

                <div className="h-3 w-3 rounded-full bg-emerald-500" />

                <span className="font-medium text-slate-900">
                  Pedidos listos
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
                  Preparando
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
                  Retrasados
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