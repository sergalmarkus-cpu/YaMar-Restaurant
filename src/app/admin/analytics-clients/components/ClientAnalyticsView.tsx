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
  adminFetch,
} from "@/lib/api/admin-fetch";

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

  daily: ClientAnalyticsDay[];

  topCustomers: TopCustomer[];
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
    return `${value.toFixed(
      2
    )} ${currency}`;
  }
}

function formatNumber(
  value: number,
  maximumFractionDigits =
    2
) {
  return new Intl.NumberFormat(
    "es-ES",
    {
      maximumFractionDigits,
    }
  ).format(
    value
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
              `/api/analytics/clients?days=${selectedPeriod}`
            );

          const json =
            await response.json();

          if (
            !response.ok ||
            !json.success
          ) {
            setError(
              json.error ||
                "No se pudieron cargar las analíticas de clientes."
            );

            return;
          }

          setData(
            json.data as
              ClientAnalyticsResponse
          );
        } catch (
          error
        ) {
          console.error(
            "Error loading client analytics:",
            error
          );

          setError(
            "No se pudieron cargar las analíticas de clientes."
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
            Analíticas de clientes
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Consulta las visitas, la captación, la recurrencia y el comportamiento de tus clientes.
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
                  {data.establishment.timezone}
                </span>
              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            <MetricCard
              title="Clientes únicos"
              value={
                data.summary.uniqueCustomers
              }
              subtitle="Clientes distintos durante el período"
              icon={
                Users
              }
            />

            <MetricCard
              title="Clientes nuevos"
              value={
                data.summary.newCustomers
              }
              subtitle="Primera visita registrada en el período"
              icon={
                UserPlus
              }
            />

            <MetricCard
              title="Clientes recurrentes"
              value={
                data.summary.returningCustomers
              }
              subtitle="Ya habían visitado el establecimiento"
              icon={
                Repeat2
              }
            />

            <MetricCard
              title="Visitas"
              value={
                data.summary.totalVisits
              }
              subtitle="Sesiones registradas durante el período"
              icon={
                Eye
              }
            />

            <MetricCard
              title="Clientes identificados"
              value={
                data.summary.identifiedCustomers
              }
              subtitle="Clientes con identidad reconocible"
              icon={
                Contact
              }
            />

            <MetricCard
              title="Clientes anónimos"
              value={
                data.summary.anonymousCustomers
              }
              subtitle="Sesiones sin identificación de cliente"
              icon={
                UsersRound
              }
            />

            <MetricCard
              title="Clientes pagadores"
              value={
                data.summary.payingCustomers
              }
              subtitle="Clientes con al menos un pago completado"
              icon={
                UserCheck
              }
            />

            <MetricCard
              title="Facturación asociada"
              value={
                formatMoney(
                  data.summary.totalRevenue,
                  currency
                )
              }
              subtitle="Pagos cobrados de clientes del período"
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
              />

            </div>

            <div className="space-y-4">

              <MetricCard
                title="Gasto medio"
                value={
                  formatMoney(
                    data.summary.averageSpendPerCustomer,
                    currency
                  )
                }
                subtitle="Importe medio por cliente pagador"
                icon={
                  WalletCards
                }
              />

              <MetricCard
                title="Visitas medias"
                value={
                  formatNumber(
                    data.summary.averageVisitsPerCustomer
                  )
                }
                subtitle="Visitas por cliente único"
                icon={
                  Eye
                }
              />

              <MetricCard
                title="Tasa de repetición"
                value={`${formatNumber(
                  data.summary.repeatRate
                )} %`}
                subtitle="Porcentaje de clientes recurrentes"
                icon={
                  Repeat2
                }
              />

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

              <h2 className="font-semibold text-slate-900">
                Clientes destacados
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Clientes identificados ordenados por importe pagado y número de visitas.
              </p>

            </div>

            {data.topCustomers.length ===
            0 ? (
              <div className="px-6 py-10 text-center text-sm text-slate-500">
                Todavía no hay clientes identificados suficientes para mostrar este ranking.
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
                        Cliente
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Visitas
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Importe pagado
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
                            {
                              formatMoney(
                                customer.totalPaid,
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
                Desglose diario de visitas, clientes nuevos y clientes recurrentes.
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
                      Visitas
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Clientes
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Nuevos
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Recurrentes
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