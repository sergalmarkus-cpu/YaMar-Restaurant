"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BadgeCheck,
  CircleUserRound,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UserCog,
  UsersRound,
  X,
} from "lucide-react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_STAFF_MESSAGES,
  type AdminStaffRole,
} from "@/config/admin-staff-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

type UserRole =
  AdminStaffRole;

interface StaffUser {
  id: number;
  establishmentId: number;
  email: string;
  name: string;
  role: UserRole;
  phone: string | null;
  avatar: string | null;
  active: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

interface StaffFormState {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  avatar: string;
  active: boolean;
}

const EMPTY_FORM: StaffFormState = {
  name: "",
  email: "",
  password: "",
  role: "waiter",
  phone: "",
  avatar: "",
  active: true,
};

const ROLE_VALUES: UserRole[] = [
  "admin",
  "manager",
  "waiter",
  "kitchen",
  "bar",
  "cashier",
];

function formatDate(
  value: string | null,
  locale: string,
  neverLabel: string,
  invalidLabel: string
) {
  if (!value) {
    return neverLabel;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return invalidLabel;
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      dateStyle: "short",
      timeStyle: "short",
    }
  ).format(date);
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

export default function StaffManager() {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_STAFF_MESSAGES[
      language
    ];

  const locale =
    ADMIN_LANGUAGE_LOCALES[
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
    editingUser,
    setEditingUser,
  ] =
    useState<StaffUser | null>(
      null
    );

  const [
    form,
    setForm,
  ] =
    useState<StaffFormState>(
      EMPTY_FORM
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
    togglingId,
    setTogglingId,
  ] =
    useState<number | null>(
      null
    );

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
            "Error loading staff:",
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

  const stats =
    useMemo(
      () => ({
        total:
          users.length,

        active:
          users.filter(
            (user) =>
              user.active
          ).length,

        managers:
          users.filter(
            (user) =>
              user.role ===
                "admin" ||
              user.role ===
                "manager"
          ).length,

        operational:
          users.filter(
            (user) =>
              ![
                "admin",
                "manager",
              ].includes(
                user.role
              )
          ).length,
      }),
      [users]
    );

  function clearMessages() {
    setError("");
    setSuccessMessage(
      ""
    );
  }

  function openCreateModal() {
    clearMessages();

    setEditingUser(
      null
    );

    setForm({
      ...EMPTY_FORM,
    });

    setModalOpen(
      true
    );
  }

  function openEditModal(
    user: StaffUser
  ) {
    clearMessages();

    setEditingUser(
      user
    );

    setForm({
      name:
        user.name,

      email:
        user.email,

      password:
        "",

      role:
        user.role,

      phone:
        user.phone ??
        "",

      avatar:
        user.avatar ??
        "",

      active:
        user.active,
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

    setEditingUser(
      null
    );

    setForm({
      ...EMPTY_FORM,
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessages();

    const name =
      form.name.trim();

    const email =
      form.email
        .trim()
        .toLowerCase();

    const password =
      form.password;

    if (!name) {
      setError(
        messages.validation
          .nameRequired
      );

      return;
    }

    if (!email) {
      setError(
        messages.validation
          .emailRequired
      );

      return;
    }

    if (
      !editingUser &&
      password.length < 8
    ) {
      setError(
        messages.validation
          .passwordMin
      );

      return;
    }

    if (
      editingUser &&
      password &&
      password.length < 8
    ) {
      setError(
        messages.validation
          .newPasswordMin
      );

      return;
    }

    setSaving(
      true
    );

    try {
      const payload: Record<
        string,
        unknown
      > = {
        name,
        email,
        role:
          form.role,
        phone:
          form.phone.trim()
            ? form.phone.trim()
            : null,
        avatar:
          form.avatar.trim()
            ? form.avatar.trim()
            : null,
        active:
          form.active,
      };

      if (
        !editingUser ||
        password
      ) {
        payload.password =
          password;
      }

      const response =
        await adminFetch(
          editingUser
            ? `/api/users/${editingUser.id}`
            : "/api/users",
          {
            method:
              editingUser
                ? "PUT"
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
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          getApiError(
            json,
            editingUser
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

      setEditingUser(
        null
      );

      setForm({
        ...EMPTY_FORM,
      });

      setSuccessMessage(
        editingUser
          ? messages.success
              .updated
          : messages.success
              .created
      );

      await loadUsers({
        quiet: true,
      });
    } catch (
      saveError
    ) {
      console.error(
        "Error saving staff user:",
        saveError
      );

      setError(
        editingUser
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

  async function toggleActive(
    user: StaffUser
  ) {
    clearMessages();

    setTogglingId(
      user.id
    );

    try {
      const response =
        await adminFetch(
          `/api/users/${user.id}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                active:
                  !user.active,
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
          getApiError(
            json,
            messages.errors
              .toggle
          )
        );

        return;
      }

      setSuccessMessage(
        !user.active
          ? messages.success
              .activated
          : messages.success
              .deactivated
      );

      await loadUsers({
        quiet: true,
      });
    } catch (
      toggleError
    ) {
      console.error(
        "Error toggling staff status:",
        toggleError
      );

      setError(
        messages.errors
          .toggle
      );
    } finally {
      setTogglingId(
        null
      );
    }
  }

  async function deleteUser(
    user: StaffUser
  ) {
    if (
      !window.confirm(
        messages.confirmations
          .deleteUser(
            user.name
          )
      )
    ) {
      return;
    }

    clearMessages();

    setDeletingId(
      user.id
    );

    try {
      const response =
        await adminFetch(
          `/api/users/${user.id}`,
          {
            method:
              "DELETE",
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
              .delete
          )
        );

        return;
      }

      setSuccessMessage(
        messages.success
          .deleted
      );

      await loadUsers({
        quiet: true,
      });
    } catch (
      deleteError
    ) {
      console.error(
        "Error deleting staff user:",
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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                void loadUsers()
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

              {
                messages.page
                  .refresh
              }
            </button>

            <button
              type="button"
              onClick={
                openCreateModal
              }
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
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
              <UsersRound
                size={22}
              />
            }
          />

          <StatCard
            title={
              messages.stats
                .active
            }
            value={
              stats.active
            }
            icon={
              <BadgeCheck
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
              stats.managers
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
                .operational
            }
            value={
              stats.operational
            }
            icon={
              <UserCog
                size={22}
              />
            }
          />
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {users.length ===
          0 ? (
            <div className="px-6 py-16 text-center">
              <CircleUserRound
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
                {
                  messages.empty
                    .description
                }
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
                          .role
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
                          .lastLogin
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
                  {users.map(
                    (
                      user
                    ) => (
                      <tr
                        key={
                          user.id
                        }
                        className="hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-700">
                              {user.name
                                .trim()
                                .charAt(
                                  0
                                )
                                .toUpperCase() ||
                                "?"}
                            </div>

                            <div>
                              <p className="font-medium text-gray-900">
                                {
                                  user.name
                                }
                              </p>

                              <p className="text-sm text-gray-500">
                                {
                                  user.email
                                }
                              </p>

                              {user.phone && (
                                <p className="text-xs text-gray-400">
                                  {
                                    user.phone
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            {
                              messages.roles[
                                user.role
                              ]
                            }
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={
                              user.active
                                ? "inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                                : "inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500"
                            }
                          >
                            {user.active
                              ? messages
                                  .status
                                  .active
                              : messages
                                  .status
                                  .inactive}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(
                            user.lastLogin,
                            locale,
                            messages.dates
                              .never,
                            messages.dates
                              .invalid
                          )}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  user
                                )
                              }
                              className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50"
                              title={
                                messages.actions
                                  .edit
                              }
                              aria-label={`${messages.actions.edit} ${user.name}`}
                            >
                              <Pencil
                                size={
                                  17
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void toggleActive(
                                  user
                                )
                              }
                              disabled={
                                togglingId ===
                                user.id
                              }
                              className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                              title={
                                user.active
                                  ? messages
                                      .actions
                                      .deactivate
                                  : messages
                                      .actions
                                      .activate
                              }
                              aria-label={
                                user.active
                                  ? `${messages.actions.deactivate} ${user.name}`
                                  : `${messages.actions.activate} ${user.name}`
                              }
                            >
                              {user.active ? (
                                <ToggleRight
                                  size={
                                    20
                                  }
                                  className="text-green-600"
                                />
                              ) : (
                                <ToggleLeft
                                  size={
                                    20
                                  }
                                  className="text-gray-400"
                                />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void deleteUser(
                                  user
                                )
                              }
                              disabled={
                                deletingId ===
                                user.id
                              }
                              className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                              title={
                                messages.actions
                                  .delete
                              }
                              aria-label={`${messages.actions.delete} ${user.name}`}
                            >
                              <Trash2
                                size={
                                  17
                                }
                              />
                            </button>
                          </div>
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

      {modalOpen && (
        <StaffModal
          editingUser={
            editingUser
          }
          form={
            form
          }
          setForm={
            setForm
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

function StaffModal({
  editingUser,
  form,
  setForm,
  saving,
  messages,
  onClose,
  onSubmit,
}: {
  editingUser:
    StaffUser | null;

  form:
    StaffFormState;

  setForm:
    React.Dispatch<
      React.SetStateAction<StaffFormState>
    >;

  saving:
    boolean;

  messages:
    typeof ADMIN_STAFF_MESSAGES.es;

  onClose:
    () => void;

  onSubmit:
    (
      event: FormEvent<HTMLFormElement>
    ) => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editingUser
                ? messages.modal
                    .editTitle
                : messages.modal
                    .createTitle}
            </h2>

            <p className="text-sm text-gray-500">
              {editingUser
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
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label={
                messages.modal
                  .fields.name
              }
              required
            >
              <input
                type="text"
                required
                value={
                  form.name
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      name:
                        event
                          .target
                          .value,
                    })
                  )
                }
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder={
                  messages.modal
                    .placeholders
                    .name
                }
              />
            </Field>

            <Field
              label={
                messages.modal
                  .fields.email
              }
              required
            >
              <input
                type="email"
                required
                value={
                  form.email
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      email:
                        event
                          .target
                          .value,
                    })
                  )
                }
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder={
                  messages.modal
                    .placeholders
                    .email
                }
              />
            </Field>

            <Field
              label={
                editingUser
                  ? messages.modal
                      .fields
                      .newPassword
                  : messages.modal
                      .fields
                      .password
              }
              hint={
                editingUser
                  ? messages.modal
                      .hints
                      .passwordEdit
                  : messages.modal
                      .hints
                      .passwordCreate
              }
              required={
                !editingUser
              }
            >
              <input
                type="password"
                required={
                  !editingUser
                }
                value={
                  form.password
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      password:
                        event
                          .target
                          .value,
                    })
                  )
                }
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder={
                  editingUser
                    ? messages.modal
                        .placeholders
                        .passwordUnchanged
                    : messages.modal
                        .placeholders
                        .password
                }
              />
            </Field>

            <Field
              label={
                messages.modal
                  .fields.role
              }
              required
            >
              <select
                value={
                  form.role
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      role:
                        event
                          .target
                          .value as UserRole,
                    })
                  )
                }
                className="w-full rounded-lg border bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {ROLE_VALUES.map(
                  (
                    role
                  ) => (
                    <option
                      key={
                        role
                      }
                      value={
                        role
                      }
                    >
                      {
                        messages.roles[
                          role
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
                  .fields.phone
              }
            >
              <input
                type="text"
                value={
                  form.phone
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      phone:
                        event
                          .target
                          .value,
                    })
                  )
                }
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder={
                  messages.modal
                    .placeholders
                    .phone
                }
              />
            </Field>

            <Field
              label={
                messages.modal
                  .fields.avatar
              }
              hint={
                messages.modal
                  .hints.avatar
              }
            >
              <input
                type="text"
                value={
                  form.avatar
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (
                      current
                    ) => ({
                      ...current,
                      avatar:
                        event
                          .target
                          .value,
                    })
                  )
                }
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder={
                  messages.modal
                    .placeholders
                    .avatar
                }
              />
            </Field>
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-medium text-gray-900">
                {
                  messages.modal
                    .activeTitle
                }
              </p>

              <p className="text-sm text-gray-500">
                {
                  messages.modal
                    .activeDescription
                }
              </p>
            </div>

            <input
              type="checkbox"
              checked={
                form.active
              }
              onChange={(
                event
              ) =>
                setForm(
                  (
                    current
                  ) => ({
                    ...current,
                    active:
                      event
                        .target
                        .checked,
                  })
                )
              }
              className="h-5 w-5"
            />
          </label>

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
                : editingUser
                  ? messages.modal
                      .saveChanges
                  : messages.modal
                      .createEmployee}
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