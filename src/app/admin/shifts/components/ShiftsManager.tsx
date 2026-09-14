"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_SHIFTS_MESSAGES,
  type AdminShiftRole,
  type AdminShiftStatus,
} from "@/config/admin-shifts-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

type UserRole =
  AdminShiftRole;

type ShiftStatus =
  AdminShiftStatus;

interface StaffUser {
  id: number;
  establishmentId: number;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
}

interface StaffShift {
  id: number;
  establishmentId: number;
  userId: number;
  startAt: string;
  endAt: string;
  status: ShiftStatus;
  notes: string | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;

  userName?: string;
  userEmail?: string;
  userRole?: UserRole;
}

interface ShiftFormState {
  userId: string;
  startAt: string;
  endAt: string;
  status: ShiftStatus;
  notes: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const EMPTY_FORM: ShiftFormState = {
  userId: "",
  startAt: "",
  endAt: "",
  status: "scheduled",
  notes: "",
};

const STATUS_VALUES: ShiftStatus[] = [
  "scheduled",
  "completed",
  "cancelled",
];

function getApiError(
  json: unknown,
  fallback: string
) {
  if (
    typeof json !== "object" ||
    json === null
  ) {
    return fallback;
  }

  const response =
    json as {
      success?: boolean;
      error?: unknown;
      message?: unknown;
    };

  if (
    typeof response.error ===
      "string" &&
    response.error
  ) {
    return response.error;
  }

  if (
    typeof response.message ===
      "string" &&
    response.message &&
    response.success === false
  ) {
    return response.message;
  }

  return fallback;
}

function toLocalInputValue(
  value:
    | string
    | Date
    | null
    | undefined
) {
  if (!value) {
    return "";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const timezoneOffset =
    date.getTimezoneOffset();

  const localDate =
    new Date(
      date.getTime() -
        timezoneOffset * 60_000
    );

  return localDate
    .toISOString()
    .slice(0, 16);
}

function formatDateTime(
  value: string,
  locale: string
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
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

function formatDuration(
  startAt: string,
  endAt: string
) {
  const start =
    new Date(startAt);

  const end =
    new Date(endAt);

  const milliseconds =
    end.getTime() -
    start.getTime();

  if (
    !Number.isFinite(
      milliseconds
    ) ||
    milliseconds <= 0
  ) {
    return "—";
  }

  const totalMinutes =
    Math.round(
      milliseconds / 60_000
    );

  const hours =
    Math.floor(
      totalMinutes / 60
    );

  const minutes =
    totalMinutes % 60;

  if (
    hours > 0 &&
    minutes > 0
  ) {
    return `${hours} h ${minutes} min`;
  }

  if (hours > 0) {
    return `${hours} h`;
  }

  return `${minutes} min`;
}

function statusClass(
  status: ShiftStatus
) {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-indigo-50 text-indigo-700";
  }
}

function createInitialForm(): ShiftFormState {
  const start =
    new Date();

  start.setMinutes(
    0,
    0,
    0
  );

  start.setHours(
    start.getHours() + 1
  );

  const end =
    new Date(
      start.getTime() +
        4 * 60 * 60 * 1000
    );

  return {
    ...EMPTY_FORM,

    startAt:
      toLocalInputValue(
        start
      ),

    endAt:
      toLocalInputValue(
        end
      ),
  };
}

export default function ShiftsManager() {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_SHIFTS_MESSAGES[
      language
    ];

  const locale =
    ADMIN_LANGUAGE_LOCALES[
      language
    ];

  const [
    shifts,
    setShifts,
  ] =
    useState<StaffShift[]>([]);

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

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState("");

  const [
    modalOpen,
    setModalOpen,
  ] =
    useState(false);

  const [
    editingShift,
    setEditingShift,
  ] =
    useState<StaffShift | null>(
      null
    );

  const [
    form,
    setForm,
  ] =
    useState<ShiftFormState>(
      createInitialForm()
    );

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    deletingId,
    setDeletingId,
  ] =
    useState<number | null>(
      null
    );

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
      "all" | ShiftStatus
    >("all");

  const loadData =
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
          const [
            shiftsResponse,
            usersResponse,
          ] =
            await Promise.all([
              adminFetch(
                "/api/shifts",
                {
                  cache:
                    "no-store",
                }
              ),

              adminFetch(
                "/api/users",
                {
                  cache:
                    "no-store",
                }
              ),
            ]);

          const shiftsJson =
            (await shiftsResponse.json()) as
              ApiResponse<
                StaffShift[]
              >;

          const usersJson =
            (await usersResponse.json()) as
              ApiResponse<
                StaffUser[]
              >;

          if (
            !shiftsResponse.ok ||
            !shiftsJson.success
          ) {
            setError(
              getApiError(
                shiftsJson,
                messages.errors
                  .loadShifts
              )
            );

            return;
          }

          if (
            !usersResponse.ok ||
            !usersJson.success
          ) {
            setError(
              getApiError(
                usersJson,
                messages.errors
                  .loadStaff
              )
            );

            return;
          }

          setShifts(
            Array.isArray(
              shiftsJson.data
            )
              ? shiftsJson.data
              : []
          );

          setUsers(
            Array.isArray(
              usersJson.data
            )
              ? usersJson.data
              : []
          );
        } catch (
          loadError
        ) {
          console.error(
            "Error loading shifts:",
            loadError
          );

          setError(
            messages.errors
              .loadShifts
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
          .loadShifts,
        messages.errors
          .loadStaff,
      ]
    );

  useEffect(() => {
    void loadData({
      quiet: true,
    });
  }, [loadData]);

  const userMap =
    useMemo(
      () =>
        new Map(
          users.map(
            (user) => [
              user.id,
              user,
            ]
          )
        ),
      [users]
    );

  const activeUsers =
    useMemo(
      () =>
        users
          .filter(
            (user) =>
              user.active
          )
          .sort(
            (
              left,
              right
            ) =>
              left.name.localeCompare(
                right.name,
                locale
              )
          ),
      [
        users,
        locale,
      ]
    );

  const filteredShifts =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        return shifts.filter(
          (shift) => {
            if (
              statusFilter !==
                "all" &&
              shift.status !==
                statusFilter
            ) {
              return false;
            }

            if (!query) {
              return true;
            }

            const user =
              userMap.get(
                shift.userId
              );

            const haystack = [
              user?.name,
              user?.email,
              user?.role,
              user?.role
                ? messages.roles[
                    user.role
                  ]
                : null,
              shift.userName,
              shift.userEmail,
              shift.userRole,
              shift.userRole
                ? messages.roles[
                    shift.userRole
                  ]
                : null,
              shift.notes,
            ]
              .filter(
                Boolean
              )
              .join(" ")
              .toLowerCase();

            return haystack.includes(
              query
            );
          }
        );
      },
      [
        messages.roles,
        search,
        shifts,
        statusFilter,
        userMap,
      ]
    );

  const stats =
    useMemo(
      () => ({
        total:
          shifts.length,

        scheduled:
          shifts.filter(
            (shift) =>
              shift.status ===
              "scheduled"
          ).length,

        completed:
          shifts.filter(
            (shift) =>
              shift.status ===
              "completed"
          ).length,

        cancelled:
          shifts.filter(
            (shift) =>
              shift.status ===
              "cancelled"
          ).length,
      }),
      [shifts]
    );

  function clearMessages() {
    setError("");
    setSuccessMessage("");
  }

  function openCreateModal() {
    clearMessages();

    setEditingShift(
      null
    );

    const initial =
      createInitialForm();

    if (
      activeUsers.length > 0
    ) {
      initial.userId =
        String(
          activeUsers[0].id
        );
    }

    setForm(
      initial
    );

    setModalOpen(
      true
    );
  }

  function openEditModal(
    shift: StaffShift
  ) {
    clearMessages();

    setEditingShift(
      shift
    );

    setForm({
      userId:
        String(
          shift.userId
        ),

      startAt:
        toLocalInputValue(
          shift.startAt
        ),

      endAt:
        toLocalInputValue(
          shift.endAt
        ),

      status:
        shift.status,

      notes:
        shift.notes ??
        "",
    });

    setModalOpen(
      true
    );
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(
      false
    );

    setEditingShift(
      null
    );

    setForm(
      createInitialForm()
    );
  }

  function validateForm() {
    const userId =
      Number(
        form.userId
      );

    if (
      !Number.isInteger(
        userId
      ) ||
      userId <= 0
    ) {
      return messages.validation
        .employeeRequired;
    }

    if (
      !form.startAt ||
      !form.endAt
    ) {
      return messages.validation
        .datesRequired;
    }

    const startAt =
      new Date(
        form.startAt
      );

    const endAt =
      new Date(
        form.endAt
      );

    if (
      Number.isNaN(
        startAt.getTime()
      ) ||
      Number.isNaN(
        endAt.getTime()
      )
    ) {
      return messages.validation
        .invalidSchedule;
    }

    if (
      endAt <= startAt
    ) {
      return messages.validation
        .endAfterStart;
    }

    if (
      form.notes.length >
      2000
    ) {
      return messages.validation
        .notesMax;
    }

    return null;
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessages();

    const validationError =
      validateForm();

    if (
      validationError
    ) {
      setError(
        validationError
      );

      return;
    }

    const userId =
      Number(
        form.userId
      );

    const payload = {
      userId,

      startAt:
        new Date(
          form.startAt
        ).toISOString(),

      endAt:
        new Date(
          form.endAt
        ).toISOString(),

      status:
        form.status,

      notes:
        form.notes.trim()
          ? form.notes.trim()
          : null,
    };

    setSaving(
      true
    );

    try {
      const response =
        await adminFetch(
          editingShift
            ? `/api/shifts/${editingShift.id}`
            : "/api/shifts",
          {
            method:
              editingShift
                ? "PATCH"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      const json =
        (await response.json()) as
          ApiResponse<
            StaffShift
          >;

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          getApiError(
            json,
            editingShift
              ? messages.errors
                  .update
              : messages.errors
                  .create
          )
        );

        return;
      }

      setModalOpen(
        false
      );

      setEditingShift(
        null
      );

      setForm(
        createInitialForm()
      );

      setSuccessMessage(
        editingShift
          ? messages.success
              .updated
          : messages.success
              .created
      );

      await loadData({
        quiet: true,
      });
    } catch (
      saveError
    ) {
      console.error(
        "Error saving shift:",
        saveError
      );

      setError(
        editingShift
          ? messages.errors
              .update
          : messages.errors
              .create
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  async function deleteShift(
    shift: StaffShift
  ) {
    const user =
      userMap.get(
        shift.userId
      );

    const employeeName =
      user?.name ??
      shift.userName ??
      messages.fallbackUser(
        shift.userId
      );

    const confirmed =
      window.confirm(
        messages.confirmations
          .delete(
            employeeName
          )
      );

    if (!confirmed) {
      return;
    }

    clearMessages();

    setDeletingId(
      shift.id
    );

    try {
      const response =
        await adminFetch(
          `/api/shifts/${shift.id}`,
          {
            method:
              "DELETE",
          }
        );

      const json =
        (await response.json()) as
          ApiResponse<null>;

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          getApiError(
            json,
            messages.errors
              .delete
          )
        );

        return;
      }

      setSuccessMessage(
        messages.success
          .deleted
      );

      await loadData({
        quiet: true,
      });
    } catch (
      deleteError
    ) {
      console.error(
        "Error deleting shift:",
        deleteError
      );

      setError(
        messages.errors
          .delete
      );
    } finally {
      setDeletingId(
        null
      );
    }
  }

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
    <>
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

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                void loadData()
              }
              disabled={
                refreshing
              }
              className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? messages.page
                    .refreshing
                : messages.page
                    .refresh}
            </button>

            <button
              type="button"
              onClick={
                openCreateModal
              }
              disabled={
                activeUsers.length ===
                0
              }
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus
                size={18}
              />

              {
                messages.page
                  .create
              }
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {activeUsers.length ===
          0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {
              messages.page
                .noActiveUsers
            }
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title={
              messages.stats
                .total
            }
            value={
              stats.total
            }
            icon={
              <CalendarClock
                size={22}
              />
            }
          />

          <StatCard
            title={
              messages.stats
                .scheduled
            }
            value={
              stats.scheduled
            }
            icon={
              <Clock3
                size={22}
              />
            }
          />

          <StatCard
            title={
              messages.stats
                .completed
            }
            value={
              stats.completed
            }
            icon={
              <CheckCircle2
                size={22}
              />
            }
          />

          <StatCard
            title={
              messages.stats
                .cancelled
            }
            value={
              stats.cancelled
            }
            icon={
              <XCircle
                size={22}
              />
            }
          />
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
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
                messages.filters
                  .search
              }
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) =>
                setStatusFilter(
                  event.target
                    .value as
                    | "all"
                    | ShiftStatus
                )
              }
              className="rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">
                {
                  messages.filters
                    .allStatuses
                }
              </option>

              {STATUS_VALUES.map(
                (status) => (
                  <option
                    key={
                      status
                    }
                    value={
                      status
                    }
                  >
                    {
                      messages.statuses[
                        status
                      ]
                    }
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {filteredShifts.length ===
          0 ? (
            <div className="px-6 py-16 text-center">
              <CalendarClock
                size={44}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-4 font-semibold text-gray-900">
                {
                  messages.empty
                    .title
                }
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {shifts.length ===
                0
                  ? messages.empty
                      .first
                  : messages.empty
                      .filtered}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {
                        messages.table
                          .employee
                      }
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {
                        messages.table
                          .start
                      }
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {
                        messages.table
                          .end
                      }
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {
                        messages.table
                          .duration
                      }
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {
                        messages.table
                          .status
                      }
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {
                        messages.table
                          .notes
                      }
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {
                        messages.table
                          .actions
                      }
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredShifts.map(
                    (shift) => {
                      const user =
                        userMap.get(
                          shift.userId
                        );

                      const name =
                        user?.name ??
                        shift.userName ??
                        messages.fallbackUser(
                          shift.userId
                        );

                      const email =
                        user?.email ??
                        shift.userEmail ??
                        "";

                      const role =
                        user?.role ??
                        shift.userRole;

                      return (
                        <tr
                          key={
                            shift.id
                          }
                          className="hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-700">
                                {name
                                  .trim()
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase() ||
                                  "?"}
                              </div>

                              <div>
                                <p className="font-medium text-gray-900">
                                  {name}
                                </p>

                                {email && (
                                  <p className="text-sm text-gray-500">
                                    {email}
                                  </p>
                                )}

                                {role && (
                                  <p className="text-xs text-gray-400">
                                    {
                                      messages.roles[
                                        role
                                      ]
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                            {formatDateTime(
                              shift.startAt,
                              locale
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                            {formatDateTime(
                              shift.endAt,
                              locale
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-700">
                            {formatDuration(
                              shift.startAt,
                              shift.endAt
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                                shift.status
                              )}`}
                            >
                              {
                                messages.statuses[
                                  shift.status
                                ]
                              }
                            </span>
                          </td>

                          <td className="max-w-[260px] px-6 py-4 text-sm text-gray-500">
                            {shift.notes ? (
                              <span
                                title={
                                  shift.notes
                                }
                                className="block truncate"
                              >
                                {
                                  shift.notes
                                }
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    shift
                                  )
                                }
                                className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50"
                                title={
                                  messages.actions
                                    .edit
                                }
                                aria-label={
                                  messages.actions
                                    .editShift(
                                      name
                                    )
                                }
                              >
                                <Pencil
                                  size={17}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  void deleteShift(
                                    shift
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  shift.id
                                }
                                className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                title={
                                  messages.actions
                                    .delete
                                }
                                aria-label={
                                  messages.actions
                                    .deleteShift(
                                      name
                                    )
                                }
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>
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

      {modalOpen && (
        <ShiftModal
          editingShift={
            editingShift
          }
          form={
            form
          }
          setForm={
            setForm
          }
          users={
            activeUsers
          }
          allUsers={
            users
          }
          saving={
            saving
          }
          messages={
            messages
          }
          onClose={
            closeModal
          }
          onSubmit={
            handleSubmit
          }
        />
      )}
    </>
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

function ShiftModal({
  editingShift,
  form,
  setForm,
  users,
  allUsers,
  saving,
  messages,
  onClose,
  onSubmit,
}: {
  editingShift:
    StaffShift | null;

  form:
    ShiftFormState;

  setForm:
    React.Dispatch<
      React.SetStateAction<ShiftFormState>
    >;

  users:
    StaffUser[];

  allUsers:
    StaffUser[];

  saving:
    boolean;

  messages:
    typeof ADMIN_SHIFTS_MESSAGES.es;

  onClose:
    () => void;

  onSubmit:
    (
      event:
        FormEvent<HTMLFormElement>
    ) => Promise<void>;
}) {
  const selectableUsers =
    useMemo(
      () => {
        if (!editingShift) {
          return users;
        }

        const currentUser =
          allUsers.find(
            (user) =>
              user.id ===
              editingShift.userId
          );

        if (
          !currentUser ||
          currentUser.active ||
          users.some(
            (user) =>
              user.id ===
              currentUser.id
          )
        ) {
          return users;
        }

        return [
          currentUser,
          ...users,
        ];
      },
      [
        allUsers,
        editingShift,
        users,
      ]
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editingShift
                ? messages.modal
                    .editTitle
                : messages.modal
                    .createTitle}
            </h2>

            <p className="text-sm text-gray-500">
              {editingShift
                ? messages.modal
                    .editDescription
                : messages.modal
                    .createDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            aria-label={
              messages.modal
                .close
            }
          >
            <X
              size={20}
            />
          </button>
        </div>

        <form
          onSubmit={
            onSubmit
          }
          className="space-y-5 p-6"
        >
          <Field
            label={
              messages.modal
                .fields.employee
            }
            required
          >
            <select
              required
              value={
                form.userId
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    current
                  ) => ({
                    ...current,

                    userId:
                      event.target
                        .value,
                  })
                )
              }
              className="w-full rounded-lg border bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                {
                  messages.modal
                    .selectEmployee
                }
              </option>

              {selectableUsers.map(
                (user) => (
                  <option
                    key={
                      user.id
                    }
                    value={
                      user.id
                    }
                  >
                    {user.name} ·{" "}
                    {
                      messages.roles[
                        user.role
                      ]
                    }
                    {!user.active
                      ? ` · ${messages.modal.inactive}`
                      : ""}
                  </option>
                )
              )}
            </select>
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label={
                messages.modal
                  .fields.start
              }
              required
            >
              <input
                type="datetime-local"
                required
                value={
                  form.startAt
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      startAt:
                        event.target
                          .value,
                    })
                  )
                }
                className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>

            <Field
              label={
                messages.modal
                  .fields.end
              }
              required
            >
              <input
                type="datetime-local"
                required
                value={
                  form.endAt
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      endAt:
                        event.target
                          .value,
                    })
                  )
                }
                className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </Field>
          </div>

          <Field
            label={
              messages.modal
                .fields.status
            }
            required
          >
            <select
              value={
                form.status
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    current
                  ) => ({
                    ...current,

                    status:
                      event.target
                        .value as
                        ShiftStatus,
                  })
                )
              }
              className="w-full rounded-lg border bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {STATUS_VALUES.map(
                (status) => (
                  <option
                    key={
                      status
                    }
                    value={
                      status
                    }
                  >
                    {
                      messages.statuses[
                        status
                      ]
                    }
                  </option>
                )
              )}
            </select>
          </Field>

          <Field
            label={
              messages.modal
                .fields.notes
            }
            hint={
              messages.modal
                .notesHint(
                  form.notes.length
                )
            }
          >
            <textarea
              rows={4}
              maxLength={2000}
              value={
                form.notes
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    current
                  ) => ({
                    ...current,

                    notes:
                      event.target
                        .value,
                  })
                )
              }
              placeholder={
                messages.modal
                  .notesPlaceholder
              }
              className="w-full resize-y rounded-lg border px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </Field>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <UserRound
                size={19}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div className="text-sm text-blue-800">
                <p className="font-medium">
                  {
                    messages.modal
                      .infoTitle
                  }
                </p>

                <p className="mt-1 text-blue-700">
                  {
                    messages.modal
                      .infoDescription
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                saving
              }
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {
                messages.modal
                  .cancel
              }
            </button>

            <button
              type="submit"
              disabled={
                saving
              }
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? messages.modal
                    .saving
                : editingShift
                  ? messages.modal
                      .saveChanges
                  : messages.modal
                      .createShift}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children:
    React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      {children}

      {hint && (
        <span className="mt-1 block text-xs text-gray-400">
          {hint}
        </span>
      )}
    </label>
  );
}