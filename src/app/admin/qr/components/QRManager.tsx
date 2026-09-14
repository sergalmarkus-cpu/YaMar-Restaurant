"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Grid3X3,
  Loader2,
  QrCode,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import QRModal from "@/app/admin/tables/components/QRModal";

import type {
  Table,
} from "@/types/table";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface QRResponse {
  tableId: number;
  tableCode: string;
  qrCode: string;
  qrImage: string;
  url: string;
}

function getStatusLabel(
  status:
    Table["status"]
) {
  switch (
    status
  ) {
    case "available":
      return "Disponible";

    case "occupied":
      return "Ocupada";

    case "reserved":
      return "Reservada";

    case "cleaning":
      return "Limpieza";

    default:
      return status;
  }
}

function getStatusClasses(
  status:
    Table["status"]
) {
  switch (
    status
  ) {
    case "available":
      return "bg-emerald-50 text-emerald-700";

    case "occupied":
      return "bg-red-50 text-red-700";

    case "reserved":
      return "bg-amber-50 text-amber-700";

    case "cleaning":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function QRManager() {
  const [
    tables,
    setTables,
  ] =
    useState<
      Table[]
    >([]);

  const [
    search,
    setSearch,
  ] =
    useState(
      ""
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
    generatingId,
    setGeneratingId,
  ] =
    useState<
      number |
      null
    >(
      null
    );

  const [
    selectedTable,
    setSelectedTable,
  ] =
    useState<
      Table |
      null
    >(
      null
    );

  const [
    qrData,
    setQrData,
  ] =
    useState<
      QRResponse |
      null
    >(
      null
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const loadTables =
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
              "/api/tables"
            );

          const json =
            (await response.json()) as
              ApiResponse<
                Table[]
              >;

          if (
            !response.ok ||
            !json.success
          ) {
            setError(
              json.error ||
                json.message ||
                "No se pudieron cargar las mesas."
            );

            return;
          }

          setTables(
            Array.isArray(
              json.data
            )
              ? json.data
              : []
          );
        } catch (
          loadError
        ) {
          console.error(
            "Error loading tables for QR:",
            loadError
          );

          setError(
            "No se pudieron cargar las mesas."
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
      void loadTables();
    },
    [
      loadTables,
    ]
  );

  const filteredTables =
    useMemo(
      () => {
        const normalized =
          search
            .trim()
            .toLowerCase();

        if (
          !normalized
        ) {
          return tables;
        }

        return tables.filter(
          (
            table
          ) => {
            const tableCode =
              table.code
                .toLowerCase();

            const qrCode =
              table.qrCode
                ?.toLowerCase() ??
              "";

            return (
              tableCode.includes(
                normalized
              ) ||
              qrCode.includes(
                normalized
              )
            );
          }
        );
      },
      [
        search,
        tables,
      ]
    );

  const activeTables =
    useMemo(
      () =>
        tables.filter(
          (
            table
          ) =>
            table.active
        ).length,
      [
        tables,
      ]
    );

  const availableTables =
    useMemo(
      () =>
        tables.filter(
          (
            table
          ) =>
            table.status ===
            "available"
        ).length,
      [
        tables,
      ]
    );

  async function showQR(
    table:
      Table
  ) {
    if (
      !table.qrCode
    ) {
      setError(
        `La mesa ${table.code} no tiene un código QR válido.`
      );

      return;
    }

    setGeneratingId(
      table.id
    );

    setError(
      ""
    );

    try {
      const response =
        await adminFetch(
          "/api/tables/qr",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                tableId:
                  table.id,
              }),
          }
        );

      const json =
        (await response.json()) as
          ApiResponse<
            QRResponse
          >;

      if (
        !response.ok ||
        !json.success ||
        !json.data
      ) {
        setError(
          json.error ||
            json.message ||
            "No se pudo generar el código QR."
        );

        return;
      }

      setQrData(
        json.data
      );

      setSelectedTable(
        table
      );
    } catch (
      qrError
    ) {
      console.error(
        "Error generating QR:",
        qrError
      );

      setError(
        "Error generando el código QR."
      );
    } finally {
      setGeneratingId(
        null
      );
    }
  }

  function closeQR() {
    setSelectedTable(
      null
    );

    setQrData(
      null
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
            Cargando códigos QR...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <QrCode
              size={
                23
              }
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Códigos QR
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Consulta, visualiza y descarga los códigos QR de las mesas.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadTables(
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <Grid3X3
                size={
                  20
                }
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Mesas
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {
                  tables.length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <CheckCircle2
                size={
                  20
                }
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Mesas activas
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {
                  activeTables
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-50 p-2.5 text-sky-600">
              <Users
                size={
                  20
                }
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Disponibles
              </p>

              <p className="mt-1 text-2xl font-bold text-sky-600">
                {
                  availableTables
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search
            size={
              18
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={
              search
            }
            onChange={(
              event
            ) =>
              setSearch(
                event.target
                  .value
              )
            }
            placeholder="Buscar por mesa o código QR..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {filteredTables.length ===
      0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
          <QrCode
            size={
              38
            }
            className="text-slate-300"
          />

          <h2 className="mt-4 font-semibold text-slate-900">
            No hay mesas
          </h2>

          <p className="mt-1 max-w-md text-sm text-slate-500">
            No se han encontrado mesas que coincidan con la búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTables.map(
            (
              table
            ) => {
              const hasQrCode =
                Boolean(
                  table.qrCode
                );

              return (
                <article
                  key={
                    table.id
                  }
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Mesa
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                          {
                            table.code
                          }
                        </h2>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                          table.status
                        )}`}
                      >
                        {
                          getStatusLabel(
                            table.status
                          )
                        }
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          Capacidad
                        </span>

                        <span className="font-medium text-slate-800">
                          {
                            table.capacity
                          }{" "}
                          personas
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          Estado administrativo
                        </span>

                        <span
                          className={
                            table.active
                              ? "font-medium text-emerald-600"
                              : "font-medium text-slate-400"
                          }
                        >
                          {table.active
                            ? "Activa"
                            : "Inactiva"}
                        </span>
                      </div>

                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                          Código QR
                        </p>

                        <p
                          title={
                            table.qrCode ??
                            undefined
                          }
                          className={
                            hasQrCode
                              ? "truncate rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600"
                              : "rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700"
                          }
                        >
                          {table.qrCode ??
                            "Sin código QR"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-slate-100 bg-slate-50 p-4">
                    <button
                      type="button"
                      onClick={() =>
                        void showQR(
                          table
                        )
                      }
                      disabled={
                        generatingId ===
                          table.id ||
                        !hasQrCode
                      }
                      title={
                        hasQrCode
                          ? "Visualizar código QR"
                          : "Esta mesa no tiene código QR"
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                    >
                      {generatingId ===
                      table.id ? (
                        <>
                          <Loader2
                            size={
                              16
                            }
                            className="animate-spin"
                          />

                          Generando...
                        </>
                      ) : (
                        <>
                          <QrCode
                            size={
                              16
                            }
                          />

                          {hasQrCode
                            ? "Ver QR"
                            : "Sin QR"}
                        </>
                      )}
                    </button>

                    {table.qrCode ? (
                      <a
                        href={`/client/${encodeURIComponent(
                          table.qrCode
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Abrir experiencia del cliente"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 text-slate-600 transition hover:bg-slate-100"
                      >
                        <ExternalLink
                          size={
                            17
                          }
                        />
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        title="Esta mesa no tiene código QR"
                        className="inline-flex cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-3.5 text-slate-300"
                      >
                        <ExternalLink
                          size={
                            17
                          }
                        />
                      </button>
                    )}
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}

      <QRModal
        open={
          selectedTable !==
            null &&
          qrData !==
            null
        }
        tableCode={
          selectedTable?.code ??
          ""
        }
        qrImage={
          qrData?.qrImage ??
          ""
        }
        onClose={
          closeQR
        }
      />
    </div>
  );
}