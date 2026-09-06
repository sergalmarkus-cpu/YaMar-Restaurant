"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Banknote,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  Loader2,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  Search,
  Smartphone,
  WalletCards,
} from "lucide-react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

type PaymentStatus =
  | "pending"
  | "partial"
  | "paid"
  | "refunded";

type PaymentMethod =
  | "card"
  | "cash"
  | "transfer"
  | "paypal"
  | "apple_pay"
  | "google_pay";

interface PaymentRecord {
  id: number;
  sessionId: string;
  establishmentId: number;
  billSplitId: number | null;
  amount: string;
  method: PaymentMethod;
  status: PaymentStatus | null;
  stripePaymentIntentId: string | null;
  transactionId: string | null;
  receiptUrl: string | null;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: typeof CreditCard;
}

const STATUS_OPTIONS: Array<{
  value: "all" | PaymentStatus;
  label: string;
}> = [
  {
    value: "all",
    label: "Todos los estados",
  },
  {
    value: "pending",
    label: "Pendientes",
  },
  {
    value: "partial",
    label: "Parciales",
  },
  {
    value: "paid",
    label: "Pagados",
  },
  {
    value: "refunded",
    label: "Reembolsados",
  },
];

const METHOD_OPTIONS: Array<{
  value: "all" | PaymentMethod;
  label: string;
}> = [
  {
    value: "all",
    label: "Todos los métodos",
  },
  {
    value: "card",
    label: "Tarjeta",
  },
  {
    value: "cash",
    label: "Efectivo",
  },
  {
    value: "transfer",
    label: "Transferencia",
  },
  {
    value: "paypal",
    label: "PayPal",
  },
  {
    value: "apple_pay",
    label: "Apple Pay",
  },
  {
    value: "google_pay",
    label: "Google Pay",
  },
];

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

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function formatAmount(
  value: string | number
) {
  const number =
    Number(
      value
    );

  if (
    !Number.isFinite(
      number
    )
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "es-ES",
    {
      minimumFractionDigits:
        2,

      maximumFractionDigits:
        2,
    }
  ).format(
    number
  );
}

function formatDate(
  value: string
) {
  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "es-ES",
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

function getMethodLabel(
  method: PaymentMethod
) {
  switch (
    method
  ) {
    case "card":
      return "Tarjeta";

    case "cash":
      return "Efectivo";

    case "transfer":
      return "Transferencia";

    case "paypal":
      return "PayPal";

    case "apple_pay":
      return "Apple Pay";

    case "google_pay":
      return "Google Pay";

    default:
      return method;
  }
}

function getMethodIcon(
  method: PaymentMethod
) {
  switch (
    method
  ) {
    case "cash":
      return Banknote;

    case "apple_pay":
    case "google_pay":
      return Smartphone;

    case "transfer":
      return WalletCards;

    default:
      return CreditCard;
  }
}

function getStatusLabel(
  status:
    PaymentStatus |
    null
) {
  switch (
    status
  ) {
    case "paid":
      return "Pagado";

    case "partial":
      return "Parcial";

    case "refunded":
      return "Reembolsado";

    case "pending":
    default:
      return "Pendiente";
  }
}

function getStatusClass(
  status:
    PaymentStatus |
    null
) {
  switch (
    status
  ) {
    case "paid":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "partial":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";

    case "refunded":
      return "bg-slate-100 text-slate-700 ring-slate-500/20";

    case "pending":
    default:
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
  }
}

function getAllowedNextStatuses(
  status:
    PaymentStatus |
    null
): PaymentStatus[] {
  const current =
    status ??
    "pending";

  switch (
    current
  ) {
    case "pending":
      return [
        "partial",
        "paid",
      ];

    case "partial":
      return [
        "paid",
        "refunded",
      ];

    case "paid":
      return [
        "refunded",
      ];

    case "refunded":
    default:
      return [];
  }
}

function getActionLabel(
  status: PaymentStatus
) {
  switch (
    status
  ) {
    case "paid":
      return "Marcar pagado";

    case "partial":
      return "Marcar parcial";

    case "refunded":
      return "Reembolsar";

    default:
      return status;
  }
}

export default function PaymentsManager() {
  const [
    payments,
    setPayments,
  ] =
    useState<
      PaymentRecord[]
    >([]);

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
    updatingId,
    setUpdatingId,
  ] =
    useState<
      number |
      null
    >(null);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<
      "all" |
      PaymentStatus
    >("all");

  const [
    methodFilter,
    setMethodFilter,
  ] =
    useState<
      "all" |
      PaymentMethod
    >("all");

  const loadPayments =
    useCallback(
      async (
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
              "/api/payments"
            );

          const json =
            await response.json();

          if (
            !response.ok ||
            !json.success
          ) {
            setError(
              json.error ||
                "No se pudieron cargar los cobros."
            );

            return;
          }

          const rows =
            Array.isArray(
              json.data
            )
              ? (
                  json.data as
                    PaymentRecord[]
                )
              : [];

          rows.sort(
            (
              a,
              b
            ) =>
              new Date(
                b.createdAt
              ).getTime() -
              new Date(
                a.createdAt
              ).getTime()
          );

          setPayments(
            rows
          );
        } catch (
          loadError
        ) {
          console.error(
            "Error loading payments:",
            loadError
          );

          setError(
            "No se pudieron cargar los cobros."
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
      void loadPayments();
    },
    [
      loadPayments,
    ]
  );

  const filteredPayments =
    useMemo(
      () => {
        const normalizedSearch =
          search
            .trim()
            .toLowerCase();

        return payments.filter(
          (
            payment
          ) => {
            const effectiveStatus =
              payment.status ??
              "pending";

            if (
              statusFilter !==
                "all" &&
              effectiveStatus !==
                statusFilter
            ) {
              return false;
            }

            if (
              methodFilter !==
                "all" &&
              payment.method !==
                methodFilter
            ) {
              return false;
            }

            if (
              !normalizedSearch
            ) {
              return true;
            }

            return [
              String(
                payment.id
              ),
              payment.sessionId,
              payment.transactionId ??
                "",
              payment.stripePaymentIntentId ??
                "",
              payment.method,
              effectiveStatus,
              String(
                payment.billSplitId ??
                  ""
              ),
            ].some(
              (
                value
              ) =>
                value
                  .toLowerCase()
                  .includes(
                    normalizedSearch
                  )
            );
          }
        );
      },
      [
        methodFilter,
        payments,
        search,
        statusFilter,
      ]
    );

  const totalPaid =
    useMemo(
      () =>
        payments.reduce(
          (
            sum,
            payment
          ) =>
            payment.status ===
            "paid"
              ? sum +
                Number(
                  payment.amount
                )
              : sum,
          0
        ),
      [
        payments,
      ]
    );

  const totalPending =
    useMemo(
      () =>
        payments.reduce(
          (
            sum,
            payment
          ) => {
            const status =
              payment.status ??
              "pending";

            return (
              status ===
                "pending" ||
              status ===
                "partial"
            )
              ? sum +
                  Number(
                    payment.amount
                  )
              : sum;
          },
          0
        ),
      [
        payments,
      ]
    );

  const paidCount =
    payments.filter(
      (
        payment
      ) =>
        payment.status ===
        "paid"
    ).length;

  const refundedCount =
    payments.filter(
      (
        payment
      ) =>
        payment.status ===
        "refunded"
    ).length;

  async function updateStatus(
    payment:
      PaymentRecord,
    status:
      PaymentStatus
  ) {
    const currentStatus =
      payment.status ??
      "pending";

    const confirmationMessage =
      status ===
      "refunded"
        ? `¿Confirmas que quieres marcar el pago #${payment.id} como reembolsado?`
        : `¿Confirmas el cambio del pago #${payment.id} de "${getStatusLabel(
            currentStatus
          )}" a "${getStatusLabel(
            status
          )}"?`;

    if (
      typeof window !==
        "undefined" &&
      !window.confirm(
        confirmationMessage
      )
    ) {
      return;
    }

    setUpdatingId(
      payment.id
    );

    setError(
      ""
    );

    setSuccess(
      ""
    );

    try {
      const response =
        await adminFetch(
          `/api/payments/${payment.id}/status`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                status,
              }),
          }
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            "No se pudo actualizar el estado del pago."
        );

        return;
      }

      const updated =
        json.data as
          PaymentRecord;

      setPayments(
        (
          current
        ) =>
          current.map(
            (
              row
            ) =>
              row.id ===
              payment.id
                ? updated
                : row
          )
      );

      setSuccess(
        `Pago #${payment.id} actualizado correctamente.`
      );
    } catch (
      updateError
    ) {
      console.error(
        "Error updating payment status:",
        updateError
      );

      setError(
        "No se pudo actualizar el estado del pago."
      );
    } finally {
      setUpdatingId(
        null
      );
    }
  }

  if (
    loading
  ) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={22}
            className="animate-spin"
          />

          <span>
            Cargando cobros...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Cobros
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Consulta y gestiona los pagos registrados en el establecimiento.
          </p>
        </div>

        <button
          type="button"
          disabled={
            refreshing
          }
          onClick={() =>
            void loadPayments(
              true
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Actualizar
        </button>

      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2
            size={18}
          />

          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Cobros registrados"
          value={
            payments.length
          }
          subtitle="Todos los estados"
          icon={
            CreditCard
          }
        />

        <MetricCard
          title="Importe cobrado"
          value={
            formatAmount(
              totalPaid
            )
          }
          subtitle={`${paidCount} pagos completados`}
          icon={
            CheckCircle2
          }
        />

        <MetricCard
          title="Importe pendiente"
          value={
            formatAmount(
              totalPending
            )
          }
          subtitle="Pagos pendientes o parciales"
          icon={
            Clock3
          }
        />

        <MetricCard
          title="Reembolsos"
          value={
            refundedCount
          }
          subtitle="Pagos marcados como reembolsados"
          icon={
            RotateCcw
          }
        />

      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Buscar por ID, sesión o transacción..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <select
            value={
              statusFilter
            }
            onChange={(
              event
            ) =>
              setStatusFilter(
                event.target.value as
                  "all" |
                  PaymentStatus
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {STATUS_OPTIONS.map(
              (
                option
              ) => (
                <option
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {
                    option.label
                  }
                </option>
              )
            )}
          </select>

          <select
            value={
              methodFilter
            }
            onChange={(
              event
            ) =>
              setMethodFilter(
                event.target.value as
                  "all" |
                  PaymentMethod
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {METHOD_OPTIONS.map(
              (
                option
              ) => (
                <option
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {
                    option.label
                  }
                </option>
              )
            )}
          </select>

        </div>

        <p className="mt-3 text-xs text-slate-500">
          {filteredPayments.length} de {payments.length} cobros visibles.
        </p>

      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-900">
            Historial de cobros
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Los registros más recientes aparecen primero.
          </p>
        </div>

        {filteredPayments.length ===
        0 ? (
          <div className="px-6 py-14 text-center">

            <ReceiptText
              size={34}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-medium text-slate-700">
              No se encontraron cobros
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Cambia los filtros o espera a que se registre un nuevo pago.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-slate-200">

              <thead className="bg-slate-50">
                <tr>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pago
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Método
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Importe
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Estado
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Fecha
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Referencia
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Acciones
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredPayments.map(
                  (
                    payment
                  ) => {
                    const MethodIcon =
                      getMethodIcon(
                        payment.method
                      );

                    const nextStatuses =
                      getAllowedNextStatuses(
                        payment.status
                      );

                    const isUpdating =
                      updatingId ===
                      payment.id;

                    return (
                      <tr
                        key={
                          payment.id
                        }
                        className="align-top transition hover:bg-slate-50"
                      >

                        <td className="px-5 py-4">

                          <p className="font-semibold text-slate-900">
                            #{payment.id}
                          </p>

                          <p
                            className="mt-1 max-w-[180px] truncate text-xs text-slate-500"
                            title={
                              payment.sessionId
                            }
                          >
                            Sesión:{" "}
                            {
                              payment.sessionId
                            }
                          </p>

                          {payment.billSplitId && (
                            <p className="mt-1 text-xs text-slate-500">
                              División #{payment.billSplitId}
                            </p>
                          )}

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <MethodIcon
                              size={17}
                              className="text-slate-400"
                            />

                            {
                              getMethodLabel(
                                payment.method
                              )
                            }
                          </div>

                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right">

                          <span className="font-semibold text-slate-900">
                            {
                              formatAmount(
                                payment.amount
                              )
                            }
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClass(
                              payment.status
                            )}`}
                          >
                            {
                              getStatusLabel(
                                payment.status
                              )
                            }
                          </span>

                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                          {
                            formatDate(
                              payment.createdAt
                            )
                          }
                        </td>

                        <td className="px-5 py-4">

                          {payment.transactionId ? (
                            <div>
                              <p className="text-xs font-medium text-slate-700">
                                Transacción
                              </p>

                              <p
                                title={
                                  payment.transactionId
                                }
                                className="mt-1 max-w-[180px] truncate text-xs text-slate-500"
                              >
                                {
                                  payment.transactionId
                                }
                              </p>
                            </div>
                          ) : payment.stripePaymentIntentId ? (
                            <div>
                              <p className="text-xs font-medium text-slate-700">
                                Stripe
                              </p>

                              <p
                                title={
                                  payment.stripePaymentIntentId
                                }
                                className="mt-1 max-w-[180px] truncate text-xs text-slate-500"
                              >
                                {
                                  payment.stripePaymentIntentId
                                }
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              —
                            </span>
                          )}

                          {payment.receiptUrl && (
                            <a
                              href={
                                payment.receiptUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                            >
                              Recibo

                              <ExternalLink
                                size={13}
                              />
                            </a>
                          )}

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex min-w-[155px] flex-col items-end gap-2">

                            {isUpdating ? (
                              <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />

                                Actualizando...
                              </div>
                            ) : nextStatuses.length >
                              0 ? (
                              nextStatuses.map(
                                (
                                  nextStatus
                                ) => (
                                  <button
                                    key={
                                      nextStatus
                                    }
                                    type="button"
                                    onClick={() =>
                                      void updateStatus(
                                        payment,
                                        nextStatus
                                      )
                                    }
                                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                      nextStatus ===
                                      "refunded"
                                        ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                                        : nextStatus ===
                                          "paid"
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                        : "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                    }`}
                                  >
                                    {
                                      getActionLabel(
                                        nextStatus
                                      )
                                    }
                                  </button>
                                )
                              )
                            ) : (
                              <span className="text-xs text-slate-400">
                                Sin acciones
                              </span>
                            )}

                          </div>

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

    </div>
  );
}