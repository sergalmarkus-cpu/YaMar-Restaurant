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
  adminFetch,
} from "@/lib/api/admin-fetch";

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

  daily: ProductAnalyticsDay[];

  ranking: ProductRankingItem[];
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
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

function formatDecimal(
  value: number
) {
  return new Intl.NumberFormat(
    "es-ES",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  ).format(value);
}

function getProductName(
  value: unknown
) {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    value &&
    typeof value ===
    "object"
  ) {
    const translated =
      value as
        TranslatedText;

    return (
      translated.es ||
      translated.en ||
      translated.fr ||
      translated.de ||
      translated.it ||
      translated.pt ||
      "Producto"
    );
  }

  return "Producto";
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

  const loadAnalytics =
    useCallback(
      async (
        selectedPeriod:
          Period,
        manualRefresh =
          false
      ) => {
        setError(
          ""
        );

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
              json.error ||
                "No se pudieron cargar las analíticas de productos."
            );

            return;
          }

          setData(
            json.data as
              ProductAnalyticsResponse
          );
        } catch (
          error
        ) {
          console.error(
            "Error loading product analytics:",
            error
          );

          setError(
            "No se pudieron cargar las analíticas de productos."
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
            Cargando analíticas de productos...
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
            Analíticas de productos
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Analiza qué productos se venden más y cuánto aportan a la facturación del establecimiento.
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
                  {
                    data.establishment.timezone
                  }
                </span>
              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

            <MetricCard
              title="Unidades vendidas"
              value={
                data.summary.totalUnits
              }
              subtitle="Unidades de pedidos no cancelados"
              icon={
                PackageCheck
              }
            />

            <MetricCard
              title="Facturación"
              value={
                formatMoney(
                  data.summary.totalRevenue,
                  currency
                )
              }
              subtitle="Importe generado por los productos"
              icon={
                BadgeEuro
              }
            />

            <MetricCard
              title="Pedidos"
              value={
                data.summary.totalOrders
              }
              subtitle="Pedidos únicos con productos vendidos"
              icon={
                ShoppingCart
              }
            />

            <MetricCard
              title="Productos vendidos"
              value={
                data.summary.distinctProducts
              }
              subtitle="Productos distintos con al menos una venta"
              icon={
                ShoppingBag
              }
            />

            <MetricCard
              title="Unidades por pedido"
              value={
                formatDecimal(
                  data.summary.averageUnitsPerOrder
                )
              }
              subtitle="Promedio de unidades por pedido"
              icon={
                ReceiptText
              }
            />

            <MetricCard
              title="Media diaria"
              value={
                formatDecimal(
                  data.summary.averageDailyUnits
                )
              }
              subtitle="Unidades vendidas de media cada día"
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
                    Producto líder
                  </h2>

                  <p className="text-sm text-slate-500">
                    Producto con más unidades vendidas.
                  </p>

                </div>

              </div>

              {data.summary.topProduct ? (
                <div className="mt-6">

                  <div className="rounded-2xl bg-indigo-50 p-5">

                    <p className="text-sm font-semibold text-indigo-900">
                      {
                        getProductName(
                          data.summary.topProduct.name
                        )
                      }
                    </p>

                    <p className="mt-4 text-3xl font-bold text-indigo-900">
                      {
                        data.summary.topProduct.units
                      }
                    </p>

                    <p className="mt-1 text-sm text-indigo-700">
                      unidades vendidas
                    </p>

                    <div className="mt-5 border-t border-indigo-100 pt-4">

                      <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                        Facturación generada
                      </p>

                      <p className="mt-1 text-lg font-semibold text-indigo-900">
                        {
                          formatMoney(
                            data.summary.topProduct.revenue,
                            currency
                          )
                        }
                      </p>

                    </div>

                  </div>

                </div>
              ) : (
                <div className="mt-6 rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  Todavía no existen ventas de productos en este período.
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
                    Ranking de productos
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Clasificación por unidades vendidas durante el período seleccionado.
                  </p>

                </div>

              </div>

            </div>

            {data.ranking.length ===
            0 ? (
              <div className="px-6 py-12 text-center text-sm text-slate-500">
                Todavía no existen datos suficientes para generar el ranking.
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="min-w-full divide-y divide-slate-200">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Posición
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Producto
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Unidades
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Pedidos
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Precio medio
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Facturación
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
                                {
                                  getProductName(
                                    product.name
                                  )
                                }
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
                            {
                              formatMoney(
                                product.averageUnitPrice,
                                currency
                              )
                            }
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-slate-900">
                            {
                              formatMoney(
                                product.revenue,
                                currency
                              )
                            }
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
                Detalle diario
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Evolución diaria de unidades, pedidos y facturación de productos.
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
                      Unidades
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Pedidos
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Facturación
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
                            day.units
                          }
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-700">
                          {
                            day.orders
                          }
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-slate-900">
                          {
                            formatMoney(
                              day.revenue,
                              currency
                            )
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