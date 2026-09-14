"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Truck,
  XCircle,
} from "lucide-react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_ORDERS_MESSAGES,
  type AdminOrderStatus,
} from "@/config/admin-orders-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

type OrderStatus =
  AdminOrderStatus;

interface OrderHistoryRow {
  id: number;
  orderNumber: string;
  tableId: number;
  status: OrderStatus | null;
  total: number | string;
  createdAt: string;
}

interface OrdersApiResponse {
  success: boolean;
  data?: OrderHistoryRow[];
  error?: string;
  message?: string;
}

interface EstablishmentRow {
  id: number;
  currency?: string | null;
}

interface EstablishmentsApiResponse {
  success: boolean;
  data?: EstablishmentRow[];
}

const STATUS_ORDER:
  OrderStatus[] = [
    "pending",
    "accepted",
    "preparing",
    "ready",
    "delivering",
    "delivered",
    "cancelled",
  ];

const statusConfig: Record<
  OrderStatus,
  {
    color: string;
    icon: typeof Clock;
  }
> = {
  pending: {
    color:
      "bg-amber-100 text-amber-800",
    icon: Clock,
  },

  accepted: {
    color:
      "bg-blue-100 text-blue-800",
    icon: TrendingUp,
  },

  preparing: {
    color:
      "bg-purple-100 text-purple-800",
    icon: Clock,
  },

  ready: {
    color:
      "bg-emerald-100 text-emerald-800",
    icon: CheckCircle,
  },

  delivering: {
    color:
      "bg-indigo-100 text-indigo-800",
    icon: Truck,
  },

  delivered: {
    color:
      "bg-slate-100 text-slate-700",
    icon: CheckCircle,
  },

  cancelled: {
    color:
      "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

export default function OrderHistory() {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_ORDERS_MESSAGES[
      language
    ];

  const locale =
    ADMIN_LANGUAGE_LOCALES[
      language
    ];

  const [
    orders,
    setOrders,
  ] =
    useState<
      OrderHistoryRow[]
    >([]);

  const [
    currency,
    setCurrency,
  ] =
    useState("");

  const [
    filter,
    setFilter,
  ] =
    useState<
      "all" | OrderStatus
    >(
      "all"
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

  const loadOrders =
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
          const [
            ordersResponse,
            establishmentsResponse,
          ] =
            await Promise.all([
              adminFetch(
                "/api/orders"
              ),
              adminFetch(
                "/api/establishments"
              ),
            ]);

          const [
            ordersJson,
            establishmentsJson,
          ] =
            await Promise.all([
              ordersResponse.json() as Promise<
                OrdersApiResponse
              >,

              establishmentsResponse.json() as Promise<
                EstablishmentsApiResponse
              >,
            ]);

          if (
            !ordersResponse.ok ||
            !ordersJson.success
          ) {
            setError(
              ordersJson.error ||
                ordersJson.message ||
                messages.history
                  .loadError
            );

            return;
          }

          setOrders(
            Array.isArray(
              ordersJson.data
            )
              ? ordersJson.data
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
            "Error loading order history:",
            caughtError
          );

          setError(
            messages.history
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
      [
        messages.history
          .loadError,
      ]
    );

  useEffect(
    () => {
      void loadOrders();
    },
    [
      loadOrders,
    ]
  );

  const filteredOrders =
    useMemo(
      () => {
        if (
          filter ===
          "all"
        ) {
          return orders;
        }

        return orders.filter(
          (
            order
          ) =>
            order.status ===
            filter
        );
      },
      [
        orders,
        filter,
      ]
    );

  function formatMoney(
    value: number | string
  ) {
    const numericValue =
      Number(value);

    if (
      !Number.isFinite(
        numericValue
      )
    ) {
      return "—";
    }

    if (!currency) {
      return numericValue.toFixed(
        2
      );
    }

    try {
      return new Intl.NumberFormat(
        locale,
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

  function formatDate(
    value: string
  ) {
    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      locale,
      {
        dateStyle:
          "medium",
        timeStyle:
          "short",
      }
    ).format(
      date
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
              messages.history
                .loading
            }
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ShoppingCart
                size={
                  22
                }
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {
                  messages.history
                    .title
                }
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {
                  messages.history
                    .description
                }
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={
              filter
            }
            onChange={(
              event
            ) =>
              setFilter(
                event.target
                  .value as
                  | "all"
                  | OrderStatus
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">
              {
                messages.history
                  .allStatuses
              }
            </option>

            {STATUS_ORDER.map(
              (
                status
              ) => (
                <option
                  key={
                    status
                  }
                  value={
                    status
                  }
                >
                  {
                    messages
                      .status[
                      status
                    ]
                  }
                </option>
              )
            )}
          </select>

          <button
            type="button"
            onClick={() =>
              void loadOrders(
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
              ? messages.history
                  .refreshing
              : messages.history
                  .refresh}
          </button>
        </div>
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
            {error}
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filteredOrders.length ===
        0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <ShoppingCart
                size={
                  24
                }
              />
            </div>

            <h2 className="mt-4 font-semibold text-slate-900">
              {
                messages.history
                  .noOrders
              }
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {orders.length ===
              0
                ? messages.history
                    .noOrdersDescription
                : messages.history
                    .noFilteredOrders}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {
                      messages.history
                        .order
                    }
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {
                      messages.history
                        .table
                    }
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {
                      messages.history
                        .total
                    }
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {
                      messages.history
                        .status
                    }
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {
                      messages.history
                        .date
                    }
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredOrders.map(
                  (
                    order
                  ) => {
                    const status =
                      order.status;

                    const config =
                      status
                        ? statusConfig[
                            status
                          ]
                        : null;

                    const StatusIcon =
                      config?.icon ??
                      Clock;

                    return (
                      <tr
                        key={
                          order.id
                        }
                        className="transition hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">
                              {
                                order.orderNumber
                              }
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {
                                messages.history
                                  .idPrefix
                              }
                              {
                                order.id
                              }
                            </p>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                          {
                            messages.history
                              .tablePrefix
                          }
                          {
                            order.tableId
                          }
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                          {formatMoney(
                            order.total
                          )}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              config?.color ??
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            <StatusIcon
                              size={
                                14
                              }
                            />

                            {status
                              ? messages
                                  .status[
                                  status
                                ]
                              : messages
                                  .history
                                  .noStatus}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                          {formatDate(
                            order.createdAt
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500">
        {
          filteredOrders.length
        }{" "}
        {filteredOrders.length ===
        1
          ? messages.history
              .oneShown
          : messages.history
              .manyShown}
      </p>
    </div>
  );
}