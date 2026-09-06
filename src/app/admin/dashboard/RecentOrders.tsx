import Link from "next/link";

type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "cancelled";

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

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pendiente",
    className:
      "bg-amber-50 text-amber-700",
  },

  accepted: {
    label: "Aceptado",
    className:
      "bg-sky-50 text-sky-700",
  },

  preparing: {
    label: "Preparando",
    className:
      "bg-blue-50 text-blue-700",
  },

  ready: {
    label: "Listo",
    className:
      "bg-emerald-50 text-emerald-700",
  },

  delivering: {
    label: "Entregando",
    className:
      "bg-violet-50 text-violet-700",
  },

  delivered: {
    label: "Entregado",
    className:
      "bg-slate-100 text-slate-700",
  },

  cancelled: {
    label: "Cancelado",
    className:
      "bg-red-50 text-red-700",
  },
};

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
    return "fecha desconocida";
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
    return "ahora";
  }

  if (
    minutes <
    60
  ) {
    return `hace ${minutes} min`;
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
    return `hace ${hours} h`;
  }

  return new Intl.DateTimeFormat(
    "es-ES",
    {
      day:
        "2-digit",

      month:
        "2-digit",

      year:
        "2-digit",

      hour:
        "2-digit",

      minute:
        "2-digit",
    }
  ).format(
    date
  );
}

export default function RecentOrders({
  orders,
  currency,
}: RecentOrdersProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5 flex items-center justify-between">

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Pedidos recientes
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Últimos pedidos registrados.
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          Ver todos
        </Link>

      </div>

      {orders.length ===
      0 ? (
        <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Todavía no hay pedidos registrados.
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

              const config =
                STATUS_CONFIG[
                  status
                ];

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
                          `Mesa ${order.tableId}`
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
                            ? "producto"
                            : "productos"
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
                          currency
                        )
                      }
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
                    >
                      {
                        config.label
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