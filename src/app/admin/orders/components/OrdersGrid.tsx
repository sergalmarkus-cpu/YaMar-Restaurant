"use client";

import {
  Clock,
  Edit2,
  Eye,
  Receipt,
  Trash2,
} from "lucide-react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_ORDERS_MESSAGES,
  type AdminOrderStatus,
} from "@/config/admin-orders-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  status: string;
  total: number;
  createdAt: string;
}

interface Props {
  orders: Order[];
  currency: string;

  onView: (
    order: Order
  ) => void;

  onEdit: (
    order: Order
  ) => void;

  onDelete: (
    order: Order
  ) => void;
}

const KNOWN_STATUSES:
  AdminOrderStatus[] = [
    "pending",
    "accepted",
    "preparing",
    "ready",
    "delivering",
    "delivered",
    "cancelled",
  ];

function isKnownStatus(
  status: string
): status is AdminOrderStatus {
  return KNOWN_STATUSES.includes(
    status as AdminOrderStatus
  );
}

function badge(
  status: string
) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "accepted":
      return "bg-blue-100 text-blue-700";

    case "preparing":
      return "bg-orange-100 text-orange-700";

    case "ready":
      return "bg-green-100 text-green-700";

    case "delivering":
      return "bg-indigo-100 text-indigo-700";

    case "delivered":
      return "bg-emerald-100 text-emerald-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function OrdersGrid({
  orders,
  currency,
  onView,
  onEdit,
  onDelete,
}: Props) {
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

  function statusLabel(
    status: string
  ) {
    if (
      isKnownStatus(
        status
      )
    ) {
      return messages.status[
        status
      ];
    }

    return status;
  }

  function formatMoney(
    value: number
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
          style: "currency",
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

  function formatTime(
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

    return date.toLocaleTimeString(
      locale
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {orders.map(
        (order) => (
          <div
            key={
              order.id
            }
            className="rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
          >
            <div className="p-6">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                    <Receipt
                      size={
                        24
                      }
                      className="text-indigo-600"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      {
                        order.orderNumber
                      }
                    </h3>

                    <p className="text-sm text-gray-500">
                      {
                        messages
                          .grid
                          .table
                      }{" "}
                      {
                        order.tableId
                      }
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold">
                    {formatMoney(
                      order.total
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                    <Clock
                      size={
                        13
                      }
                    />

                    {formatTime(
                      order.createdAt
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${badge(
                    order.status
                  )}`}
                >
                  {statusLabel(
                    order.status
                  )}
                </span>
              </div>
            </div>

            <div className="flex gap-2 border-t bg-gray-50 p-4">
              <button
                type="button"
                onClick={() =>
                  onView(
                    order
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border bg-white py-2 hover:bg-gray-100"
              >
                <Eye
                  size={
                    17
                  }
                />

                {
                  messages
                    .grid
                    .view
                }
              </button>

              <button
                type="button"
                onClick={() =>
                  onEdit(
                    order
                  )
                }
                aria-label={
                  messages
                    .grid
                    .edit
                }
                title={
                  messages
                    .grid
                    .edit
                }
                className="rounded-xl p-2 hover:bg-indigo-100"
              >
                <Edit2
                  size={
                    18
                  }
                  className="text-indigo-600"
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete(
                    order
                  )
                }
                aria-label={
                  messages
                    .grid
                    .delete
                }
                title={
                  messages
                    .grid
                    .delete
                }
                className="rounded-xl p-2 hover:bg-red-100"
              >
                <Trash2
                  size={
                    18
                  }
                  className="text-red-600"
                />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}