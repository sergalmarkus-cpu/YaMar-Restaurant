"use client";

import Link from "next/link";

import {
  ADMIN_DASHBOARD_MESSAGES,
  type AdminDashboardLanguage,
  type AdminDashboardOrderStatus,
} from "@/config/admin-dashboard-i18n";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

type OrderStatus =
  AdminDashboardOrderStatus;

interface DashboardOrder {
  id: number;
  orderNumber: string;
  tableId: number;
  tableName: string | null;
  itemCount: number;
  total: number;
  status: OrderStatus | null;
  createdAt: string;
}

interface RecentOrdersProps {
  orders: DashboardOrder[];
  currency: string;
}

const STATUS_CLASSES: Record<
  OrderStatus,
  string
> = {
  pending:
    "bg-amber-50 text-amber-700",

  accepted:
    "bg-sky-50 text-sky-700",

  preparing:
    "bg-blue-50 text-blue-700",

  ready:
    "bg-emerald-50 text-emerald-700",

  delivering:
    "bg-violet-50 text-violet-700",

  delivered:
    "bg-slate-100 text-slate-700",

  cancelled:
    "bg-red-50 text-red-700",
};

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

export default function RecentOrders({
  orders,
  currency,
}: RecentOrdersProps) {
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
    ].recentOrders;

  const locale =
    ADMIN_LANGUAGE_LOCALES[
      language
    ];

  function formatRelativeTime(
    value: string
  ) {
    const date =
      new Date(
        value
      );

    const timestamp =
      date.getTime();

    if (
      !Number.isFinite(
        timestamp
      )
    ) {
      return messages
        .unknownDate;
    }

    const difference =
      Date.now() -
      timestamp;

    const minutes =
      Math.max(
        0,
        Math.floor(
          difference /
            60000
        )
      );

    if (
      minutes <
      1
    ) {
      return messages.now;
    }

    if (
      minutes <
      60
    ) {
      return messages
        .minutesAgo(
          minutes
        );
    }

    const hours =
      Math.floor(
        minutes /
          60
      );

    if (
      hours <
      24
    ) {
      return messages
        .hoursAgo(
          hours
        );
    }

    return new Intl.DateTimeFormat(
      locale,
      {
        dateStyle:
          "short",

        timeStyle:
          "short",
      }
    ).format(
      date
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {
              messages.title
            }
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {
              messages.description
            }
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          {
            messages.viewAll
          }
        </Link>
      </div>

      {orders.length ===
      0 ? (
        <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {
            messages.empty
          }
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(
            (
              order
            ) => {
              const status =
                order.status ??
                "pending";

              return (
                <div
                  key={
                    order.id
                  }
                  className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-semibold text-indigo-600">
                      #
                      {
                        order.id
                      }
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {
                          order.tableName ||
                          messages.table(
                            order.tableId
                          )
                        }
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {
                          order.itemCount
                        }
                        {" "}
                        {
                          order.itemCount ===
                          1
                            ? messages
                                .oneProduct
                            : messages
                                .manyProducts
                        }
                        {" · "}
                        {
                          formatRelativeTime(
                            order.createdAt
                          )
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <span className="font-semibold text-slate-900">
                      {
                        formatMoney(
                          order.total,
                          currency,
                          locale
                        )
                      }
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_CLASSES[status]}`}
                    >
                      {
                        messages
                          .statuses[
                          status
                        ]
                      }
                    </span>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}