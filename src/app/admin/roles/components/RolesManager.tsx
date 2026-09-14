"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BadgeDollarSign,
  ChefHat,
  CookingPot,
  RefreshCw,
  ShieldCheck,
  UserCog,
  UsersRound,
  UtensilsCrossed,
} from "lucide-react";

import {
  ADMIN_ROLES_MESSAGES,
  type AdminRole,
} from "@/config/admin-roles-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

interface StaffUser {
  id: number;
  establishmentId: number;
  email: string;
  name: string;
  role: AdminRole;
  active: boolean;
}

const ROLE_VALUES: AdminRole[] = [
  "admin",
  "manager",
  "waiter",
  "kitchen",
  "bar",
  "cashier",
];

function getRoleIcon(
  role: AdminRole
) {
  switch (role) {
    case "admin":
      return (
        <ShieldCheck
          size={22}
        />
      );

    case "manager":
      return (
        <UserCog
          size={22}
        />
      );

    case "waiter":
      return (
        <UtensilsCrossed
          size={22}
        />
      );

    case "kitchen":
      return (
        <ChefHat
          size={22}
        />
      );

    case "bar":
      return (
        <CookingPot
          size={22}
        />
      );

    case "cashier":
      return (
        <BadgeDollarSign
          size={22}
        />
      );
  }
}

function getApiError(
  json: any,
  fallback: string
) {
  if (
    typeof json?.error ===
      "string" &&
    json.error
  ) {
    return json.error;
  }

  if (
    typeof json?.message ===
      "string" &&
    !json?.success
  ) {
    return json.message;
  }

  return fallback;
}

export default function RolesManager() {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_ROLES_MESSAGES[
      language
    ];

  const [
    users,
    setUsers,
  ] =
    useState<StaffUser[]>([]);

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

  const loadUsers =
    useCallback(
      async (
        options?: {
          quiet?: boolean;
        }
      ) => {
        const quiet =
          options?.quiet ??
          false;

        if (!quiet) {
          setRefreshing(
            true
          );
        }

        setError("");

        try {
          const response =
            await adminFetch(
              "/api/users",
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
              getApiError(
                json,
                messages.errors
                  .load
              )
            );

            return;
          }

          setUsers(
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
            "Error loading roles:",
            loadError
          );

          setError(
            messages.errors
              .load
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
        messages.errors
          .load,
      ]
    );

  useEffect(() => {
    void loadUsers({
      quiet: true,
    });
  }, [loadUsers]);

  const roleStats =
    useMemo(
      () =>
        ROLE_VALUES.map(
          (role) => {
            const roleUsers =
              users.filter(
                (user) =>
                  user.role ===
                  role
              );

            return {
              value: role,

              label:
                messages.roles[
                  role
                ].label,

              description:
                messages.roles[
                  role
                ]
                  .description,

              access:
                messages.roles[
                  role
                ].access,

              icon:
                getRoleIcon(
                  role
                ),

              total:
                roleUsers.length,

              active:
                roleUsers.filter(
                  (user) =>
                    user.active
                ).length,
            };
          }
        ),
      [
        messages.roles,
        users,
      ]
    );

  const totalActive =
    useMemo(
      () =>
        users.filter(
          (user) =>
            user.active
        ).length,
      [users]
    );

  const managementUsers =
    useMemo(
      () =>
        users.filter(
          (user) =>
            user.role ===
              "admin" ||
            user.role ===
              "manager"
        ).length,
      [users]
    );

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-gray-500">
            {
              messages.loading
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {
              messages.page
                .title
            }
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {
              messages.page
                .subtitle
            }
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadUsers()
          }
          disabled={
            refreshing
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {
            messages.page
              .refresh
          }
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={
            messages.stats
              .available
          }
          value={
            ROLE_VALUES.length
          }
          icon={
            <ShieldCheck
              size={22}
            />
          }
        />

        <StatCard
          title={
            messages.stats
              .staff
          }
          value={
            users.length
          }
          icon={
            <UsersRound
              size={22}
            />
          }
        />

        <StatCard
          title={
            messages.stats
              .activeUsers
          }
          value={
            totalActive
          }
          icon={
            <UserCog
              size={22}
            />
          }
        />

        <StatCard
          title={
            messages.stats
              .management
          }
          value={
            managementUsers
          }
          icon={
            <ShieldCheck
              size={22}
            />
          }
        />
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-4">
        <p className="font-semibold text-indigo-900">
          {
            messages.permissions
              .title
          }
        </p>

        <p className="mt-1 text-sm leading-6 text-indigo-800">
          {
            messages.permissions
              .description
          }
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roleStats.map(
          (role) => (
            <div
              key={
                role.value
              }
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    {
                      role.icon
                    }
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {
                        role.label
                      }
                    </h2>

                    <p className="mt-0.5 font-mono text-xs text-gray-400">
                      {
                        role.value
                      }
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  {
                    role.access
                  }
                </span>
              </div>

              <p className="mt-4 min-h-[48px] text-sm leading-6 text-gray-500">
                {
                  role.description
                }
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {
                      messages.roleCard
                        .users
                    }
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {
                      role.total
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {
                      messages.roleCard
                        .active
                    }
                  </p>

                  <p className="mt-1 text-xl font-bold text-green-600">
                    {
                      role.active
                    }
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">
          {
            messages.assignments
              .title
          }
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {
            messages.assignments
              .description
          }
        </p>

        <a
          href="/admin/staff"
          className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {
            messages.assignments
              .goToStaff
          }
        </a>
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
  value: number;
  icon:
    React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
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