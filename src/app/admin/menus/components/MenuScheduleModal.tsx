"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  Clock,
  Copy,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Trash2,
  X,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

interface Menu {
  id: number;
  name: any;
}

interface Schedule {
  id: number;
  menuId: number;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  active: boolean;
}

interface Props {
  open: boolean;
  menu: Menu | null;
  onClose: () => void;
}

const DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function getMenuName(
  name: any
) {
  if (
    typeof name ===
    "string"
  ) {
    return name;
  }

  return (
    name?.es ||
    name?.en ||
    "Sin nombre"
  );
}

function invalidTimeRange(
  openTime: string,
  closeTime: string
) {
  return (
    !openTime ||
    !closeTime ||
    openTime ===
      closeTime
  );
}

export default function MenuScheduleModal({
  open,
  menu,
  onClose,
}: Props) {
  const [
    schedules,
    setSchedules,
  ] =
    useState<
      Schedule[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    dayOfWeek,
    setDayOfWeek,
  ] =
    useState(1);

  const [
    openTime,
    setOpenTime,
  ] =
    useState(
      "11:30"
    );

  const [
    closeTime,
    setCloseTime,
  ] =
    useState(
      "13:00"
    );

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    editingSchedule,
    setEditingSchedule,
  ] =
    useState<
      Schedule | null
    >(null);

  const [
    editingOpenTime,
    setEditingOpenTime,
  ] =
    useState("");

  const [
    editingCloseTime,
    setEditingCloseTime,
  ] =
    useState("");

  const [
    savingScheduleId,
    setSavingScheduleId,
  ] =
    useState<
      number | null
    >(null);

  const [
    applyOpenTime,
    setApplyOpenTime,
  ] =
    useState(
      "11:30"
    );

  const [
    applyCloseTime,
    setApplyCloseTime,
  ] =
    useState(
      "13:00"
    );

  const [
    selectedDays,
    setSelectedDays,
  ] =
    useState<
      number[]
    >([]);

  const [
    applyingSchedule,
    setApplyingSchedule,
  ] =
    useState(false);

  const [
    deletingAll,
    setDeletingAll,
  ] =
    useState(false);

  useEffect(() => {
    if (
      !open ||
      !menu
    ) {
      return;
    }

    void loadSchedules();

    resetForm();

    setSelectedDays(
      []
    );
  }, [
    open,
    menu,
  ]);

  const schedulesByDay =
    useMemo(
      () =>
        DAYS.map(
          (
            _,
            index
          ) =>
            schedules.filter(
              (
                schedule
              ) =>
                schedule.dayOfWeek ===
                index
            )
        ),
      [
        schedules,
      ]
    );

  function resetForm() {
    setDayOfWeek(
      1
    );

    setOpenTime(
      "11:30"
    );

    setCloseTime(
      "13:00"
    );

    cancelEdit();
  }

  function cancelEdit() {
    setEditingSchedule(
      null
    );

    setEditingOpenTime(
      ""
    );

    setEditingCloseTime(
      ""
    );
  }

  async function loadSchedules() {
    if (!menu) {
      return;
    }

    setLoading(
      true
    );

    try {
      const response =
        await adminFetch(
          `/api/menu-schedules?menuId=${menu.id}`
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        toast.error(
          json.error ||
            json.message ||
            "No se pudieron cargar los horarios."
        );

        return;
      }

      setSchedules(
        json.data
      );
    } catch (error) {
      console.error(
        "Error loading menu schedules:",
        error
      );

      toast.error(
        "No se pudieron cargar los horarios."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  function startEdit(
    schedule: Schedule
  ) {
    setEditingSchedule(
      schedule
    );

    setEditingOpenTime(
      schedule.openTime
    );

    setEditingCloseTime(
      schedule.closeTime
    );
  }

  function toggleDaySelection(
    day: number
  ) {
    setSelectedDays(
      (
        current
      ) => {
        if (
          current.includes(
            day
          )
        ) {
          return current.filter(
            (
              item
            ) =>
              item !==
              day
          );
        }

        return [
          ...current,
          day,
        ].sort(
          (
            a,
            b
          ) =>
            a - b
        );
      }
    );
  }

  function toggleAllDays() {
    setSelectedDays(
      (
        current
      ) =>
        current.length ===
        7
          ? []
          : [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
            ]
    );
  }

  async function createSchedule() {
    if (!menu) {
      return;
    }

    if (
      invalidTimeRange(
        openTime,
        closeTime
      )
    ) {
      toast.error(
        "La hora de apertura y cierre no pueden ser iguales."
      );

      return;
    }

    setSaving(
      true
    );

    try {
      const response =
        await adminFetch(
          "/api/menu-schedules",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                menuId:
                  menu.id,

                dayOfWeek,

                openTime,

                closeTime,

                active:
                  true,
              }),
          }
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        toast.error(
          json.error ||
            json.message ||
            "No se pudo crear el horario."
        );

        return;
      }

      toast.success(
        "Horario añadido."
      );

      resetForm();

      await loadSchedules();
    } catch (error) {
      console.error(
        "Error creating menu schedule:",
        error
      );

      toast.error(
        "No se pudo crear el horario."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  async function applyScheduleToDays() {
    if (!menu) {
      return;
    }

    if (
      selectedDays.length ===
      0
    ) {
      toast.error(
        "Selecciona al menos un día."
      );

      return;
    }

    if (
      invalidTimeRange(
        applyOpenTime,
        applyCloseTime
      )
    ) {
      toast.error(
        "La hora de apertura y cierre no pueden ser iguales."
      );

      return;
    }

    setApplyingSchedule(
      true
    );

    try {
      const response =
        await adminFetch(
          "/api/menu-schedules/apply",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                menuId:
                  menu.id,

                daysOfWeek:
                  selectedDays,

                openTime:
                  applyOpenTime,

                closeTime:
                  applyCloseTime,

                active:
                  true,
              }),
          }
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        toast.error(
          json.error ||
            json.message ||
            "No se pudo aplicar el horario."
        );

        return;
      }

      toast.success(
        "Horario aplicado a los días seleccionados."
      );

      setSelectedDays(
        []
      );

      await loadSchedules();
    } catch (error) {
      console.error(
        "Error applying menu schedule:",
        error
      );

      toast.error(
        "No se pudo aplicar el horario."
      );
    } finally {
      setApplyingSchedule(
        false
      );
    }
  }

  async function updateScheduleInline(
    schedule: Schedule
  ) {
    if (
      invalidTimeRange(
        editingOpenTime,
        editingCloseTime
      )
    ) {
      toast.error(
        "La hora de apertura y cierre no pueden ser iguales."
      );

      return;
    }

    setSavingScheduleId(
      schedule.id
    );

    try {
      const response =
        await adminFetch(
          `/api/menu-schedules/${schedule.id}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                openTime:
                  editingOpenTime,

                closeTime:
                  editingCloseTime,
              }),
          }
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        toast.error(
          json.error ||
            json.message ||
            "No se pudo actualizar el horario."
        );

        return;
      }

      toast.success(
        "Horario actualizado correctamente."
      );

      cancelEdit();

      await loadSchedules();
    } catch (error) {
      console.error(
        "Error updating menu schedule:",
        error
      );

      toast.error(
        "No se pudo actualizar el horario."
      );
    } finally {
      setSavingScheduleId(
        null
      );
    }
  }

  async function toggleSchedule(
    schedule: Schedule
  ) {
    try {
      const response =
        await adminFetch(
          `/api/menu-schedules/${schedule.id}`,
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
                  !schedule.active,
              }),
          }
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        toast.error(
          json.error ||
            json.message ||
            "No se pudo actualizar el horario."
        );

        return;
      }

      await loadSchedules();
    } catch (error) {
      console.error(
        "Error toggling menu schedule:",
        error
      );

      toast.error(
        "No se pudo actualizar el horario."
      );
    }
  }

  async function deleteSchedule(
    schedule: Schedule
  ) {
    if (
      !window.confirm(
        `¿Eliminar el horario ${schedule.openTime} → ${schedule.closeTime}?`
      )
    ) {
      return;
    }

    try {
      const response =
        await adminFetch(
          `/api/menu-schedules/${schedule.id}`,
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
        toast.error(
          json.error ||
            json.message ||
            "No se pudo eliminar el horario."
        );

        return;
      }

      if (
        editingSchedule?.id ===
        schedule.id
      ) {
        cancelEdit();
      }

      toast.success(
        "Horario eliminado."
      );

      await loadSchedules();
    } catch (error) {
      console.error(
        "Error deleting menu schedule:",
        error
      );

      toast.error(
        "No se pudo eliminar el horario."
      );
    }
  }

  async function deleteAllSchedules() {
    if (!menu) {
      return;
    }

    if (
      schedules.length ===
      0
    ) {
      toast.info(
        "No hay franjas horarias que eliminar."
      );

      return;
    }

    if (
      !window.confirm(
        `¿Eliminar todas las franjas horarias de "${getMenuName(
          menu.name
        )}"?\n\nEsta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setDeletingAll(
      true
    );

    try {
      const response =
        await adminFetch(
          `/api/menu-schedules?menuId=${menu.id}`,
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
        toast.error(
          json.error ||
            json.message ||
            "No se pudieron eliminar las franjas horarias."
        );

        return;
      }

      cancelEdit();

      setSelectedDays(
        []
      );

      toast.success(
        "Todas las franjas horarias han sido eliminadas."
      );

      await loadSchedules();
    } catch (error) {
      console.error(
        "Error deleting all menu schedules:",
        error
      );

      toast.error(
        "No se pudieron eliminar las franjas horarias."
      );
    } finally {
      setDeletingAll(
        false
      );
    }
  }

  if (
    !open ||
    !menu
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
              <Clock
                size={
                  22
                }
                className="text-indigo-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Horarios
              </h2>

              <p className="text-sm text-gray-500">
                {getMenuName(
                  menu.name
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-xl p-2 hover:bg-gray-100"
          >
            <X
              size={
                20
              }
            />
          </button>
        </div>

        <div className="max-h-[calc(90vh-90px)] overflow-y-auto p-6">
          <div className="mb-6 rounded-2xl border bg-gray-50 p-5">
            <h3 className="mb-4 font-semibold">
              Añadir horario
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Día
                </label>

                <select
                  value={
                    dayOfWeek
                  }
                  onChange={(
                    event
                  ) =>
                    setDayOfWeek(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="w-full rounded-xl border bg-white px-3 py-2.5"
                >
                  {DAYS.map(
                    (
                      day,
                      index
                    ) => (
                      <option
                        key={
                          day
                        }
                        value={
                          index
                        }
                      >
                        {
                          day
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Apertura
                </label>

                <input
                  type="time"
                  value={
                    openTime
                  }
                  onChange={(
                    event
                  ) =>
                    setOpenTime(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border bg-white px-3 py-2.5"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Cierre
                </label>

                <input
                  type="time"
                  value={
                    closeTime
                  }
                  onChange={(
                    event
                  ) =>
                    setCloseTime(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border bg-white px-3 py-2.5"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() =>
                    void createSchedule()
                  }
                  disabled={
                    saving
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Plus
                    size={
                      18
                    }
                  />

                  {saving
                    ? "Guardando..."
                    : "Añadir"}
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Los horarios pueden atravesar medianoche, por ejemplo 20:00 → 02:00.
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                <Copy
                  size={
                    19
                  }
                  className="text-indigo-600"
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Aplicar horario a varios días
                </h3>

                <p className="text-sm text-gray-600">
                  Configura la misma franja para varios días de la semana.
                </p>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={
                  toggleAllDays
                }
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  selectedDays.length ===
                  7
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "bg-white hover:bg-indigo-100"
                }`}
              >
                {selectedDays.length ===
                7
                  ? "Quitar todos"
                  : "Todos los días"}
              </button>

              {DAYS.map(
                (
                  day,
                  index
                ) => {
                  const selected =
                    selectedDays.includes(
                      index
                    );

                  return (
                    <button
                      key={
                        day
                      }
                      type="button"
                      onClick={() =>
                        toggleDaySelection(
                          index
                        )
                      }
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        selected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "bg-white hover:bg-indigo-100"
                      }`}
                    >
                      {
                        day
                      }
                    </button>
                  );
                }
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Apertura
                </label>

                <input
                  type="time"
                  value={
                    applyOpenTime
                  }
                  onChange={(
                    event
                  ) =>
                    setApplyOpenTime(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border bg-white px-3 py-2.5"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Cierre
                </label>

                <input
                  type="time"
                  value={
                    applyCloseTime
                  }
                  onChange={(
                    event
                  ) =>
                    setApplyCloseTime(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border bg-white px-3 py-2.5"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() =>
                    void applyScheduleToDays()
                  }
                  disabled={
                    applyingSchedule ||
                    selectedDays.length ===
                      0
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Copy
                    size={
                      18
                    }
                  />

                  {applyingSchedule
                    ? "Aplicando..."
                    : "Aplicar horario"}
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-red-800">
                Gestión de horarios
              </h3>

              <p className="text-sm text-red-700">
                Elimina todas las franjas horarias configuradas para este menú.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void deleteAllSchedules()
              }
              disabled={
                loading ||
                deletingAll ||
                schedules.length ===
                  0
              }
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2
                size={
                  18
                }
              />

              {deletingAll
                ? "Eliminando..."
                : "Eliminar todos los horarios"}
            </button>
          </div>

          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Cargando horarios...
            </div>
          ) : (
            <div className="space-y-4">
              {DAYS.map(
                (
                  day,
                  dayIndex
                ) => {
                  const daySchedules =
                    schedulesByDay[
                      dayIndex
                    ];

                  return (
                    <div
                      key={
                        day
                      }
                      className="overflow-hidden rounded-2xl border"
                    >
                      <div className="flex items-center justify-between bg-gray-50 px-5 py-3">
                        <h3 className="font-semibold">
                          {
                            day
                          }
                        </h3>

                        <span className="text-xs text-gray-500">
                          {
                            daySchedules.length
                          }{" "}
                          {daySchedules.length ===
                          1
                            ? "franja"
                            : "franjas"}
                        </span>
                      </div>

                      <div className="p-4">
                        {daySchedules.length ===
                        0 ? (
                          <p className="text-sm text-gray-400">
                            Sin horario configurado.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {daySchedules.map(
                              (
                                schedule
                              ) => {
                                const isEditing =
                                  editingSchedule?.id ===
                                  schedule.id;

                                const isSaving =
                                  savingScheduleId ===
                                  schedule.id;

                                return (
                                  <div
                                    key={
                                      schedule.id
                                    }
                                    className="rounded-xl border bg-white p-3"
                                  >
                                    {isEditing ? (
                                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 lg:w-32">
                                          <Clock
                                            size={
                                              18
                                            }
                                            className="text-indigo-600"
                                          />

                                          {
                                            day
                                          }
                                        </div>

                                        <div className="flex flex-1 items-center gap-3">
                                          <div className="flex-1">
                                            <label className="mb-1 block text-xs text-gray-500">
                                              Apertura
                                            </label>

                                            <input
                                              type="time"
                                              value={
                                                editingOpenTime
                                              }
                                              onChange={(
                                                event
                                              ) =>
                                                setEditingOpenTime(
                                                  event.target.value
                                                )
                                              }
                                              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                          </div>

                                          <span className="mt-5 text-gray-400">
                                            →
                                          </span>

                                          <div className="flex-1">
                                            <label className="mb-1 block text-xs text-gray-500">
                                              Cierre
                                            </label>

                                            <input
                                              type="time"
                                              value={
                                                editingCloseTime
                                              }
                                              onChange={(
                                                event
                                              ) =>
                                                setEditingCloseTime(
                                                  event.target.value
                                                )
                                              }
                                              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              void updateScheduleInline(
                                                schedule
                                              )
                                            }
                                            disabled={
                                              isSaving
                                            }
                                            className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50"
                                            title="Guardar"
                                          >
                                            <Check
                                              size={
                                                16
                                              }
                                            />
                                          </button>

                                          <button
                                            type="button"
                                            onClick={
                                              cancelEdit
                                            }
                                            disabled={
                                              isSaving
                                            }
                                            className="rounded-lg border p-2 hover:bg-gray-100 disabled:opacity-50"
                                            title="Cancelar"
                                          >
                                            <X
                                              size={
                                                16
                                              }
                                            />
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                          <Clock
                                            size={
                                              18
                                            }
                                            className="text-indigo-600"
                                          />

                                          <span className="font-medium">
                                            {
                                              schedule.openTime
                                            }{" "}
                                            →{" "}
                                            {
                                              schedule.closeTime
                                            }
                                          </span>

                                          <span
                                            className={`rounded-full px-2.5 py-1 text-xs ${
                                              schedule.active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-500"
                                            }`}
                                          >
                                            {schedule.active
                                              ? "Activo"
                                              : "Inactivo"}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              startEdit(
                                                schedule
                                              )
                                            }
                                            className="rounded-lg border p-2 hover:bg-indigo-50"
                                            title="Editar horario"
                                          >
                                            <Pencil
                                              size={
                                                16
                                              }
                                              className="text-indigo-600"
                                            />
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              void toggleSchedule(
                                                schedule
                                              )
                                            }
                                            className="rounded-lg border p-2 hover:bg-gray-50"
                                            title={
                                              schedule.active
                                                ? "Desactivar"
                                                : "Activar"
                                            }
                                          >
                                            {schedule.active ? (
                                              <Power
                                                size={
                                                  16
                                                }
                                                className="text-green-600"
                                              />
                                            ) : (
                                              <PowerOff
                                                size={
                                                  16
                                                }
                                                className="text-gray-500"
                                              />
                                            )}
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              void deleteSchedule(
                                                schedule
                                              )
                                            }
                                            className="rounded-lg border p-2 hover:bg-red-50"
                                            title="Eliminar horario"
                                          >
                                            <Trash2
                                              size={
                                                16
                                              }
                                              className="text-red-600"
                                            />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}