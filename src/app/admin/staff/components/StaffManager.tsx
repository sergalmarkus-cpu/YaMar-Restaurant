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
  adminFetch,
} from "@/lib/api/admin-fetch";

type UserRole =
  | "admin"
  | "manager"
  | "waiter"
  | "kitchen"
  | "bar"
  | "cashier";

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

const ROLE_OPTIONS: {
  value: UserRole;
  label: string;
}[] = [
  {
    value: "admin",
    label: "Administrador",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "waiter",
    label: "Camarero",
  },
  {
    value: "kitchen",
    label: "Cocina",
  },
  {
    value: "bar",
    label: "Bar",
  },
  {
    value: "cashier",
    label: "Caja",
  },
];

function roleLabel(
  role: UserRole
) {
  return (
    ROLE_OPTIONS.find(
      (option) =>
        option.value === role
    )?.label ?? role
  );
}

function formatDate(
  value: string | null
) {
  if (!value) {
    return "Nunca";
  }

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
    "es-ES",
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
                "No se pudo cargar el personal."
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
            "No se pudo cargar el personal."
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
        "El nombre es obligatorio."
      );

      return;
    }

    if (!email) {
      setError(
        "El email es obligatorio."
      );

      return;
    }

    if (
      !editingUser &&
      password.length < 8
    ) {
      setError(
        "La contraseña debe tener al menos 8 caracteres."
      );

      return;
    }

    if (
      editingUser &&
      password &&
      password.length < 8
    ) {
      setError(
        "La nueva contraseña debe tener al menos 8 caracteres."
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
              ? "No se pudo actualizar el empleado."
              : "No se pudo crear el empleado."
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
          ? "Empleado actualizado correctamente."
          : "Empleado creado correctamente."
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
          ? "No se pudo actualizar el empleado."
          : "No se pudo crear el empleado."
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
            "No se pudo cambiar el estado del empleado."
          )
        );

        return;
      }

      setSuccessMessage(
        !user.active
          ? "Empleado activado correctamente."
          : "Empleado desactivado correctamente."
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
        "No se pudo cambiar el estado del empleado."
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
        `¿Eliminar definitivamente a "${user.name}"?`
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
            "No se pudo eliminar el empleado."
          )
        );

        return;
      }

      setSuccessMessage(
        "Empleado eliminado correctamente."
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
        "No se pudo eliminar el empleado."
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
            Cargando personal...
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
              Personal
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Gestiona los usuarios y roles del establecimiento.
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

              Actualizar
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

              Nuevo empleado
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
            title="Total"
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
            title="Activos"
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
            title="Gestión"
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
            title="Operativos"
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
                No hay empleados
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Crea el primer usuario de personal del establecimiento.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Empleado
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Rol
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Estado
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Último acceso
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Acciones
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
                            {roleLabel(
                              user.role
                            )}
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
                              ? "Activo"
                              : "Inactivo"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(
                            user.lastLogin
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
                              title="Editar"
                              aria-label={`Editar ${user.name}`}
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
                                  ? "Desactivar"
                                  : "Activar"
                              }
                              aria-label={
                                user.active
                                  ? `Desactivar ${user.name}`
                                  : `Activar ${user.name}`
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
                              title="Eliminar"
                              aria-label={`Eliminar ${user.name}`}
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
                ? "Editar empleado"
                : "Nuevo empleado"}
            </h2>

            <p className="text-sm text-gray-500">
              {editingUser
                ? "Actualiza los datos y permisos del usuario."
                : "Crea un nuevo usuario para este establecimiento."}
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
            aria-label="Cerrar"
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
              label="Nombre"
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
                placeholder="Nombre del empleado"
              />
            </Field>

            <Field
              label="Email"
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
                placeholder="empleado@ejemplo.com"
              />
            </Field>

            <Field
              label={
                editingUser
                  ? "Nueva contraseña"
                  : "Contraseña"
              }
              hint={
                editingUser
                  ? "Déjala vacía para conservar la actual."
                  : "Mínimo 8 caracteres."
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
                    ? "Sin cambios"
                    : "Contraseña"
                }
              />
            </Field>

            <Field
              label="Rol"
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
                {ROLE_OPTIONS.map(
                  (
                    role
                  ) => (
                    <option
                      key={
                        role.value
                      }
                      value={
                        role.value
                      }
                    >
                      {
                        role.label
                      }
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field
              label="Teléfono"
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
                placeholder="+34 600 000 000"
              />
            </Field>

            <Field
              label="Avatar"
              hint="URL opcional."
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
                placeholder="https://..."
              />
            </Field>
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-medium text-gray-900">
                Usuario activo
              </p>

              <p className="text-sm text-gray-500">
                Los usuarios inactivos no pueden iniciar sesión.
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
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                saving
              }
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Guardando..."
                : editingUser
                  ? "Guardar cambios"
                  : "Crear empleado"}
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