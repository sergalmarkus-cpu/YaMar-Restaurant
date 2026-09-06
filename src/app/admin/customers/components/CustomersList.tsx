"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BadgeEuro,
  Search,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

interface Customer {
  key: string;

  customerName:
    string | null;

  customerEmail:
    string | null;

  customerPhone:
    string | null;

  roomNumber:
    string | null;

  language:
    string | null;

  visits:
    number;

  activeSessions:
    number;

  orderCount:
    number;

  successfulOrders:
    number;

  cancelledOrders:
    number;

  totalOrdered:
    number;

  totalPaid:
    number;

  loyaltyPoints:
    number;

  firstVisit:
    string;

  lastVisit:
    string;

  anonymous:
    boolean;
}

function formatMoney(
  value: number
) {
  return new Intl.NumberFormat(
    "es-ES",
    {
      style:
        "currency",

      currency:
        "EUR",
    }
  ).format(
    value
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
    return "—";
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

export default function CustomersList() {
  const [
    customers,
    setCustomers,
  ] =
    useState<Customer[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const [
    search,
    setSearch,
  ] =
    useState(
      ""
    );

  const loadCustomers =
    useCallback(
      async () => {
        setError(
          ""
        );

        try {
          const response =
            await adminFetch(
              "/api/customers",
              {
                cache:
                  "no-store",
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
                json.message ||
                "No se pudieron cargar los clientes."
            );

            return;
          }

          setCustomers(
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
            "Error loading customers:",
            loadError
          );

          setError(
            "No se pudieron cargar los clientes."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(
    () => {
      void loadCustomers();
    },
    [
      loadCustomers,
    ]
  );

  const filteredCustomers =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return customers;
        }

        return customers.filter(
          (
            customer
          ) => {
            const values = [
              customer.customerName,
              customer.customerEmail,
              customer.customerPhone,
              customer.roomNumber,
            ];

            return values.some(
              (
                value
              ) =>
                value
                  ?.toLowerCase()
                  .includes(
                    query
                  )
            );
          }
        );
      },
      [
        customers,
        search,
      ]
    );

  const stats =
    useMemo(
      () => {
        const identified =
          customers.filter(
            (
              customer
            ) =>
              !customer.anonymous
          ).length;

        const active =
          customers.filter(
            (
              customer
            ) =>
              customer.activeSessions >
              0
          ).length;

        const paid =
          customers.reduce(
            (
              total,
              customer
            ) =>
              total +
              customer.totalPaid,
            0
          );

        const points =
          customers.reduce(
            (
              total,
              customer
            ) =>
              total +
              customer.loyaltyPoints,
            0
          );

        return {
          identified,
          active,
          paid,
          points,
        };
      },
      [
        customers,
      ]
    );

  if (
    loading
  ) {
    return (
      <div className="p-6 text-gray-500">
        Cargando clientes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Clientes
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Historial agregado de clientes y visitantes del establecimiento.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Clientes identificados"
          value={
            String(
              stats.identified
            )
          }
          icon={
            <UsersRound
              size={21}
            />
          }
        />

        <StatCard
          title="Ahora en sala"
          value={
            String(
              stats.active
            )
          }
          icon={
            <UserRound
              size={21}
            />
          }
        />

        <StatCard
          title="Cobrado"
          value={
            formatMoney(
              stats.paid
            )
          }
          icon={
            <BadgeEuro
              size={21}
            />
          }
        />

        <StatCard
          title="Puntos acumulados"
          value={
            String(
              stats.points
            )
          }
          icon={
            <Star
              size={21}
            />
          }
        />
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                event.target.value
              )
            }
            placeholder="Buscar por nombre, email, teléfono o habitación..."
            className="w-full rounded-lg border py-2 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {filteredCustomers.length ===
        0 ? (
          <div className="p-10 text-center text-gray-500">
            No hay clientes que mostrar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Cliente
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Visitas
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Pedidos
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Cobrado
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Puntos
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Última visita
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map(
                  (
                    customer
                  ) => (
                    <tr
                      key={
                        customer.key
                      }
                      className="hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
                            <UserRound
                              size={19}
                            />
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {customer.customerName ||
                                "Visitante"}
                            </p>

                            <p className="text-sm text-gray-500">
                              {customer.customerEmail ||
                                "Sin email"}
                            </p>

                            {customer.customerPhone && (
                              <p className="text-xs text-gray-400">
                                {
                                  customer.customerPhone
                                }
                              </p>
                            )}

                            {customer.roomNumber && (
                              <p className="text-xs text-gray-400">
                                Habitación:{" "}
                                {
                                  customer.roomNumber
                                }
                              </p>
                            )}

                            {customer.activeSessions >
                              0 && (
                              <span className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                                En sala
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {
                          customer.visits
                        }
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {
                            customer.orderCount
                          }
                        </p>

                        <p className="text-xs text-gray-400">
                          {
                            customer.successfulOrders
                          }{" "}
                          completados ·{" "}
                          {
                            customer.cancelledOrders
                          }{" "}
                          cancelados
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatMoney(
                            customer.totalPaid
                          )}
                        </p>

                        <p className="text-xs text-gray-400">
                          Pedidos:{" "}
                          {formatMoney(
                            customer.totalOrdered
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-gray-700">
                        {
                          customer.loyaltyPoints
                        }
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {formatDate(
                          customer.lastVisit
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon:
    React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          {icon}
        </div>
      </div>
    </div>
  );
}