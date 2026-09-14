"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Banknote,
  Search,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_CUSTOMERS_MESSAGES,
  type AdminCustomersLanguage,
} from "@/config/admin-customers-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

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

interface EstablishmentRow {
  id: number;

  currency?:
    | string
    | null;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

function formatMoney(
  value: number,
  language:
    AdminCustomersLanguage,
  currency: string
) {
  try {
    return new Intl.NumberFormat(
      ADMIN_LANGUAGE_LOCALES[
        language
      ],
      {
        style:
          "currency",
        currency,
      }
    ).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

function formatDate(
  value: string,
  language:
    AdminCustomersLanguage
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
    ADMIN_LANGUAGE_LOCALES[
      language
    ],
    {
      dateStyle:
        "short",
      timeStyle:
        "short",
    }
  ).format(date);
}

export default function CustomersList() {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    ) as AdminCustomersLanguage;

  const messages =
    ADMIN_CUSTOMERS_MESSAGES[
      language
    ];

  const [
    customers,
    setCustomers,
  ] =
    useState<Customer[]>(
      []
    );

  const [
    currency,
    setCurrency,
  ] =
    useState(
      "EUR"
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

  function currentMessages() {
    const currentLanguage =
      useAdminLanguageStore
        .getState()
        .language as
        AdminCustomersLanguage;

    return ADMIN_CUSTOMERS_MESSAGES[
      currentLanguage
    ];
  }

  const loadCurrency =
    useCallback(
      async () => {
        try {
          const response =
            await adminFetch(
              "/api/establishments"
            );

          if (!response.ok) {
            return;
          }

          const json =
            (await response.json()) as
              ApiResponse<
                EstablishmentRow[]
              >;

          const establishment =
            Array.isArray(
              json.data
            )
              ? json.data[0]
              : undefined;

          const nextCurrency =
            establishment?.currency
              ?.trim()
              .toUpperCase();

          if (nextCurrency) {
            setCurrency(
              nextCurrency
            );
          }
        } catch (
          currencyError
        ) {
          console.error(
            "Error loading establishment currency:",
            currencyError
          );
        }
      },
      []
    );

  const loadCustomers =
    useCallback(
      async () => {
        setError("");

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
            (await response.json()) as
              ApiResponse<
                Customer[]
              >;

          if (
            !response.ok ||
            !json.success
          ) {
            setError(
              currentMessages()
                .loadError
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
            currentMessages()
              .loadError
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
      void Promise.all([
        loadCustomers(),
        loadCurrency(),
      ]);
    },
    [
      loadCurrency,
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
        {
          messages.loading
        }
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {
            messages.title
          }
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {
            messages.subtitle
          }
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={
            messages
              .identifiedCustomers
          }
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
          title={
            messages
              .currentlyInVenue
          }
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
          title={
            messages.collected
          }
          value={
            formatMoney(
              stats.paid,
              language,
              currency
            )
          }
          icon={
            <Banknote
              size={21}
            />
          }
        />

        <StatCard
          title={
            messages
              .accumulatedPoints
          }
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
            placeholder={
              messages
                .searchPlaceholder
            }
            className="w-full rounded-lg border py-2 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {filteredCustomers.length ===
        0 ? (
          <div className="p-10 text-center text-gray-500">
            {
              messages.noCustomers
            }
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    {
                      messages.customer
                    }
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    {
                      messages.visits
                    }
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    {
                      messages.orders
                    }
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    {
                      messages.collected
                    }
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    {
                      messages.points
                    }
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    {
                      messages.lastVisit
                    }
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
                                messages.visitor}
                            </p>

                            <p className="text-sm text-gray-500">
                              {customer.customerEmail ||
                                messages.noEmail}
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
                                {
                                  messages.room
                                }
                                :{" "}
                                {
                                  customer.roomNumber
                                }
                              </p>
                            )}

                            {customer.activeSessions >
                              0 && (
                              <span className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                                {
                                  messages.inVenue
                                }
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
                          {
                            messages.completed
                          }
                          {" · "}
                          {
                            customer.cancelledOrders
                          }{" "}
                          {
                            messages.cancelled
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {
                            formatMoney(
                              customer.totalPaid,
                              language,
                              currency
                            )
                          }
                        </p>

                        <p className="text-xs text-gray-400">
                          {
                            messages.ordersPrefix
                          }
                          :{" "}
                          {
                            formatMoney(
                              customer.totalOrdered,
                              language,
                              currency
                            )
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-gray-700">
                        {
                          customer.loyaltyPoints
                        }
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {
                          formatDate(
                            customer.lastVisit,
                            language
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