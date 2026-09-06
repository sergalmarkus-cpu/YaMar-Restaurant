"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CreditCard,
  Loader2,
  ReceiptText,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import SalesAnalyticsChart from "./SalesAnalyticsChart";

type Period =
  | 7
  | 30
  | 90;

interface SalesAnalyticsDay {
  date: string;
  label: string;
  sales: number;
  payments: number;
  orders: number;
  customers: number;
}

interface SalesAnalyticsResponse {
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
    totalSales: number;
    totalPayments: number;
    totalOrders: number;
    payingCustomers: number;
    averageTicket: number;
    averageDailySales: number;

    bestDay: {
      date: string;
      label: string;
      sales: number;
    } | null;
  };

  daily: SalesAnalyticsDay[];
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon:
    typeof TrendingUp;
}

function formatMoney(
  value: number,
  currency: string
) {
  try {
    return new Intl.NumberFormat(
      "es-ES",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }
    ).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
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

export default function SalesAnalyticsView() {
  const [
    period,
    setPeriod,
  ] =
    useState<Period>(30);

  const [
    data,
    setData,
  ] =
    useState<
      SalesAnalyticsResponse |
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
              `/api/analytics/sales?days=${selectedPeriod}`
            );

          const json =
            await response.json();

          if (
            !response.ok ||
            !json.success
          ) {
            setError(
              json.error ||
                "No se pudieron cargar las analíticas de ventas."
            );

            return;
          }

          setData(
            json.data as
              SalesAnalyticsResponse
          );
        } catch (
          error
        ) {
          console.error(
            "Error loading sales analytics:",
            error
          );

          setError(
            "No se pudieron cargar las analíticas de ventas."
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
      .currency ??
    "EUR";

  const periodLabel =
    useMemo(
      () => {
        if (
          period ===
          7
        ) {
          return "Últimos 7 días";
        }

        if (
          period ===
          90
        ) {
          return "Últimos 90 días";
        }

        return "Últimos 30 días";
      },
      [
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
            Cargando analíticas...
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
            Analíticas de ventas
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Consulta la evolución de ventas, pedidos y clientes del establecimiento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          {[7, 30, 90].map(
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
                      value as Period
                    )
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    selected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {value} días
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

            Actualizar
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
                    {periodLabel}
                  </p>

                  <p className="text-sm text-slate-500">
                    {data.period.from}
                    {" "}
                    →
                    {" "}
                    {data.period.to}
                  </p>
                </div>
              </div>

              <div className="text-sm text-slate-500">
                Zona horaria:
                {" "}
                <span className="font-medium text-slate-700">
                  {data.establishment.timezone}
                </span>
              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

            <MetricCard
              title="Ventas totales"
              value={
                formatMoney(
                  data.summary.totalSales,
                  currency
                )
              }
              subtitle="Pagos efectivamente cobrados"
              icon={
                TrendingUp
              }
            />

            <MetricCard
              title="Pagos completados"
              value={
                data.summary.totalPayments
              }
              subtitle="Transacciones con estado paid"
              icon={
                CreditCard
              }
            />

            <MetricCard
              title="Pedidos"
              value={
                data.summary.totalOrders
              }
              subtitle="Pedidos no cancelados"
              icon={
                ShoppingCart
              }
            />

            <MetricCard
              title="Clientes pagadores"
              value={
                data.summary.payingCustomers
              }
              subtitle="Sesiones con al menos un pago"
              icon={
                Users
              }
            />

            <MetricCard
              title="Ticket medio"
              value={
                formatMoney(
                  data.summary.averageTicket,
                  currency
                )
              }
              subtitle="Ventas por cliente pagador"
              icon={
                ReceiptText
              }
            />

            <MetricCard
              title="Media diaria"
              value={
                formatMoney(
                  data.summary.averageDailySales,
                  currency
                )
              }
              subtitle="Ventas medias por día del período"
              icon={
                WalletCards
              }
            />

          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            <div className="xl:col-span-2">
              <SalesAnalyticsChart
                data={
                  data.daily
                }
                currency={
                  currency
                }
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold text-slate-900">
                Mejor día
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Día con mayor facturación dentro del período.
              </p>

              {data.summary.bestDay ? (
                <div className="mt-6">

                  <div className="rounded-2xl bg-indigo-50 p-5">

                    <p className="text-sm font-medium text-indigo-700">
                      {
                        data.summary.bestDay.label
                      }
                    </p>

                    <p className="mt-2 text-3xl font-bold text-indigo-900">
                      {
                        formatMoney(
                          data.summary.bestDay.sales,
                          currency
                        )
                      }
                    </p>

                    <p className="mt-2 text-xs text-indigo-700">
                      {
                        data.summary.bestDay.date
                      }
                    </p>

                  </div>

                </div>
              ) : (
                <div className="mt-6 rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  Todavía no existen ventas en este período.
                </div>
              )}

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="font-semibold text-slate-900">
                Detalle diario
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Desglose completo del período seleccionado.
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="min-w-full divide-y divide-slate-200">

                <thead className="bg-slate-50">
                  <tr>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Fecha
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Ventas
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Pagos
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Pedidos
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Clientes
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
                          {
                            day.label
                          }
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-700">
                          {
                            formatMoney(
                              day.sales,
                              currency
                            )
                          }
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-700">
                          {
                            day.payments
                          }
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-700">
                          {
                            day.orders
                          }
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-700">
                          {
                            day.customers
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