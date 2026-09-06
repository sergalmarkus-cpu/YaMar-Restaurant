"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MailCheck,
  ReceiptText,
  RefreshCw,
  Search,
  WalletCards,
} from "lucide-react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

interface ReceiptItem {
  name?: string;
  quantity?: number;
  unitPrice?: string | number;
  subtotal?: string | number;
  [key: string]: unknown;
}

interface ReceiptRecord {
  id: number;
  sessionId: string;
  establishmentId: number;
  receiptNumber: string;
  pdfUrl: string;
  emailSent: boolean | null;
  total: string;
  items: unknown;
  createdAt: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: typeof ReceiptText;
}

type EmailFilter =
  | "all"
  | "sent"
  | "pending";

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
    Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return new Intl.NumberFormat(
    "es-ES",
    {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(number);
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
    return value;
  }

  return new Intl.DateTimeFormat(
    "es-ES",
    {
      dateStyle: "short",
      timeStyle: "short",
    }
  ).format(date);
}

function normalizeItems(
  value: unknown
): ReceiptItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (
      item
    ): item is ReceiptItem =>
      typeof item === "object" &&
      item !== null
  );
}

export default function InvoicesManager() {
  const [
    receipts,
    setReceipts,
  ] =
    useState<
      ReceiptRecord[]
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
    error,
    setError,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    emailFilter,
    setEmailFilter,
  ] =
    useState<EmailFilter>(
      "all"
    );

  const [
    expandedId,
    setExpandedId,
  ] =
    useState<
      number |
      null
    >(null);

  const loadReceipts =
    useCallback(
      async (
        manualRefresh =
          false
      ) => {
        setError("");

        if (manualRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        try {
          const response =
            await adminFetch(
              "/api/receipts"
            );

          const json =
            await response.json();

          if (
            !response.ok ||
            !json.success
          ) {
            setError(
              json.error ||
                json.message ||
                "No se pudieron cargar las facturas."
            );

            return;
          }

          const rows =
            Array.isArray(
              json.data
            )
              ? (
                  json.data as
                    ReceiptRecord[]
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

          setReceipts(
            rows
          );
        } catch (
          loadError
        ) {
          console.error(
            "Error loading receipts:",
            loadError
          );

          setError(
            "No se pudieron cargar las facturas."
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
      void loadReceipts();
    },
    [
      loadReceipts,
    ]
  );

  const filteredReceipts =
    useMemo(
      () => {
        const normalizedSearch =
          search
            .trim()
            .toLowerCase();

        return receipts.filter(
          (
            receipt
          ) => {
            const emailSent =
              receipt.emailSent ===
              true;

            if (
              emailFilter ===
                "sent" &&
              !emailSent
            ) {
              return false;
            }

            if (
              emailFilter ===
                "pending" &&
              emailSent
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
                receipt.id
              ),
              receipt.receiptNumber,
              receipt.sessionId,
              String(
                receipt.total
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
        emailFilter,
        receipts,
        search,
      ]
    );

  const totalBilled =
    useMemo(
      () =>
        receipts.reduce(
          (
            sum,
            receipt
          ) => {
            const value =
              Number(
                receipt.total
              );

            return Number.isFinite(
              value
            )
              ? sum + value
              : sum;
          },
          0
        ),
      [
        receipts,
      ]
    );

  const sentCount =
    receipts.filter(
      (
        receipt
      ) =>
        receipt.emailSent ===
        true
    ).length;

  const pendingCount =
    receipts.length -
    sentCount;

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={22}
            className="animate-spin"
          />

          <span>
            Cargando facturas...
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
            Facturas
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Consulta los recibos emitidos y su estado de envío.
          </p>
        </div>

        <button
          type="button"
          disabled={
            refreshing
          }
          onClick={() =>
            void loadReceipts(
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Facturas emitidas"
          value={
            receipts.length
          }
          subtitle="Recibos registrados"
          icon={
            ReceiptText
          }
        />

        <MetricCard
          title="Facturación total"
          value={
            formatAmount(
              totalBilled
            )
          }
          subtitle="Importe acumulado"
          icon={
            WalletCards
          }
        />

        <MetricCard
          title="Enviadas"
          value={
            sentCount
          }
          subtitle="Recibos enviados por email"
          icon={
            MailCheck
          }
        />

        <MetricCard
          title="Pendientes de envío"
          value={
            pendingCount
          }
          subtitle="Recibos todavía no enviados"
          icon={
            Mail
          }
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
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
              placeholder="Buscar por factura, ID, sesión o importe..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <select
            value={
              emailFilter
            }
            onChange={(
              event
            ) =>
              setEmailFilter(
                event.target
                  .value as
                  EmailFilter
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">
              Todos los envíos
            </option>

            <option value="sent">
              Enviadas
            </option>

            <option value="pending">
              Pendientes
            </option>
          </select>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {filteredReceipts.length} de{" "}
          {receipts.length} facturas visibles.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-900">
            Historial de facturas
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Las facturas más recientes aparecen primero.
          </p>
        </div>

        {filteredReceipts.length ===
        0 ? (
          <div className="px-6 py-14 text-center">
            <FileText
              size={34}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-medium text-slate-700">
              No se encontraron facturas
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Cambia los filtros o espera a que se emita un nuevo recibo.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Factura
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Sesión
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Fecha
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredReceipts.map(
                  (
                    receipt
                  ) => {
                    const items =
                      normalizeItems(
                        receipt.items
                      );

                    const expanded =
                      expandedId ===
                      receipt.id;

                    return (
                      <Fragment
                        key={
                          receipt.id
                        }
                      >
                        <tr
                          className="align-top transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-900">
                              {receipt.receiptNumber}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              ID #{receipt.id}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p
                              title={
                                receipt.sessionId
                              }
                              className="max-w-[190px] truncate text-sm text-slate-600"
                            >
                              {receipt.sessionId}
                            </p>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-right">
                            <span className="font-semibold text-slate-900">
                              {formatAmount(
                                receipt.total
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {receipt.emailSent ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                <CheckCircle2
                                  size={13}
                                />

                                Enviada
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                <Mail
                                  size={13}
                                />

                                Pendiente
                              </span>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                            {formatDate(
                              receipt.createdAt
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex min-w-[150px] flex-col items-end gap-2">
                              <a
                                href={
                                  receipt.pdfUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                              >
                                Ver PDF

                                <ExternalLink
                                  size={13}
                                />
                              </a>

                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedId(
                                    expanded
                                      ? null
                                      : receipt.id
                                  )
                                }
                                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
                              >
                                {expanded
                                  ? "Ocultar detalle"
                                  : "Ver detalle"}

                                {expanded ? (
                                  <ChevronUp
                                    size={14}
                                  />
                                ) : (
                                  <ChevronDown
                                    size={14}
                                  />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {expanded && (
                          <tr
                            className="bg-slate-50/70"
                          >
                            <td
                              colSpan={
                                6
                              }
                              className="px-5 py-5"
                            >
                              <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <h3 className="text-sm font-semibold text-slate-900">
                                      Detalle de la factura
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                      {items.length}{" "}
                                      {items.length ===
                                      1
                                        ? "línea"
                                        : "líneas"}{" "}
                                      registradas
                                    </p>
                                  </div>

                                  <p className="text-sm font-semibold text-slate-900">
                                    Total:{" "}
                                    {formatAmount(
                                      receipt.total
                                    )}
                                  </p>
                                </div>

                                {items.length ===
                                0 ? (
                                  <p className="mt-4 text-sm text-slate-500">
                                    No hay detalle de artículos disponible.
                                  </p>
                                ) : (
                                  <div className="mt-4 overflow-x-auto">
                                    <table className="min-w-full">
                                      <thead>
                                        <tr className="border-b border-slate-200">
                                          <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Producto
                                          </th>

                                          <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Cant.
                                          </th>

                                          <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Precio
                                          </th>

                                          <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Subtotal
                                          </th>
                                        </tr>
                                      </thead>

                                      <tbody className="divide-y divide-slate-100">
                                        {items.map(
                                          (
                                            item,
                                            index
                                          ) => (
                                            <tr
                                              key={`${receipt.id}-item-${index}`}
                                            >
                                              <td className="py-3 pr-4 text-sm text-slate-700">
                                                {typeof item.name ===
                                                "string"
                                                  ? item.name
                                                  : "Producto"}
                                              </td>

                                              <td className="px-4 py-3 text-right text-sm text-slate-600">
                                                {typeof item.quantity ===
                                                "number"
                                                  ? item.quantity
                                                  : "—"}
                                              </td>

                                              <td className="px-4 py-3 text-right text-sm text-slate-600">
                                                {item.unitPrice !==
                                                undefined
                                                  ? formatAmount(
                                                      String(
                                                        item.unitPrice
                                                      )
                                                    )
                                                  : "—"}
                                              </td>

                                              <td className="py-3 pl-4 text-right text-sm font-medium text-slate-900">
                                                {item.subtotal !==
                                                undefined
                                                  ? formatAmount(
                                                      String(
                                                        item.subtotal
                                                      )
                                                    )
                                                  : "—"}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
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