"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Map,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from "lucide-react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

interface Area {
  id: number;
  establishmentId: number;
  name: string;
  description?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  radius?: number | null;
  active: boolean;
}

interface CreateAreaForm {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  radius: string;
}

const EMPTY_FORM: CreateAreaForm = {
  name: "",
  description: "",
  latitude: "",
  longitude: "",
  radius: "",
};

export default function AreasList() {
  const [
    areas,
    setAreas,
  ] =
    useState<Area[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    showCreateForm,
    setShowCreateForm,
  ] =
    useState(false);

  const [
    creating,
    setCreating,
  ] =
    useState(false);

  const [
    form,
    setForm,
  ] =
    useState<CreateAreaForm>(
      EMPTY_FORM
    );

  useEffect(() => {
    void loadAreas();
  }, []);

  async function loadAreas() {
    setError("");

    try {
      const res =
        await adminFetch(
          "/api/areas"
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            "No se pudieron cargar las áreas."
        );

        return;
      }

      setAreas(
        json.data
      );
    } catch (error) {
      console.error(
        "Error loading areas:",
        error
      );

      setError(
        "No se pudieron cargar las áreas."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  function updateForm(
    field: keyof CreateAreaForm,
    value: string
  ) {
    setForm(
      (
        current
      ) => ({
        ...current,
        [field]:
          value,
      })
    );
  }

  function resetCreateForm() {
    setForm(
      EMPTY_FORM
    );

    setShowCreateForm(
      false
    );
  }

  async function createArea(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const name =
      form.name.trim();

    if (
      !name
    ) {
      setError(
        "El nombre del área es obligatorio."
      );

      return;
    }

    let radius:
      | number
      | undefined;

    if (
      form.radius.trim()
    ) {
      radius =
        Number(
          form.radius
        );

      if (
        !Number.isInteger(
          radius
        ) ||
        radius <= 0 ||
        radius > 10000
      ) {
        setError(
          "El radio debe ser un número entero entre 1 y 10000 metros."
        );

        return;
      }
    }

    let latitude:
      | number
      | undefined;

    if (
      form.latitude.trim()
    ) {
      latitude =
        Number(
          form.latitude
        );

      if (
        !Number.isFinite(
          latitude
        )
      ) {
        setError(
          "La latitud no es válida."
        );

        return;
      }
    }

    let longitude:
      | number
      | undefined;

    if (
      form.longitude.trim()
    ) {
      longitude =
        Number(
          form.longitude
        );

      if (
        !Number.isFinite(
          longitude
        )
      ) {
        setError(
          "La longitud no es válida."
        );

        return;
      }
    }

    const payload: {
      name: string;
      description?: string | null;
      latitude?: number;
      longitude?: number;
      radius?: number;
      active: boolean;
    } = {
      name,
      active:
        true,
    };

    const description =
      form.description.trim();

    if (
      description
    ) {
      payload.description =
        description;
    }

    if (
      latitude !==
      undefined
    ) {
      payload.latitude =
        latitude;
    }

    if (
      longitude !==
      undefined
    ) {
      payload.longitude =
        longitude;
    }

    if (
      radius !==
      undefined
    ) {
      payload.radius =
        radius;
    }

    setCreating(
      true
    );

    try {
      const res =
        await adminFetch(
          "/api/areas",
          {
            method:
              "POST",

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
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            "No se pudo crear el área."
        );

        return;
      }

      resetCreateForm();

      await loadAreas();
    } catch (error) {
      console.error(
        "Error creating area:",
        error
      );

      setError(
        "No se pudo crear el área."
      );
    } finally {
      setCreating(
        false
      );
    }
  }

  async function toggleActive(
    id: number,
    current: boolean
  ) {
    setError("");

    try {
      const res =
        await adminFetch(
          `/api/areas/${id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                active:
                  !current,
              }),
          }
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            "No se pudo actualizar el área."
        );

        return;
      }

      await loadAreas();
    } catch (error) {
      console.error(
        "Error updating area:",
        error
      );

      setError(
        "No se pudo actualizar el área."
      );
    }
  }

  async function deleteArea(
    id: number
  ) {
    if (
      !window.confirm(
        "¿Desactivar esta área?"
      )
    ) {
      return;
    }

    setError("");

    try {
      const res =
        await adminFetch(
          `/api/areas/${id}`,
          {
            method:
              "DELETE",
          }
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            "No se pudo desactivar el área."
        );

        return;
      }

      await loadAreas();
    } catch (error) {
      console.error(
        "Error deleting area:",
        error
      );

      setError(
        "No se pudo desactivar el área."
      );
    }
  }

  if (
    loading
  ) {
    return (
      <div className="p-6">
        Cargando áreas...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Áreas
          </h2>

          <p className="text-gray-500">
            Gestión de zonas del establecimiento
          </p>
        </div>

        {!showCreateForm && (
          <button
            type="button"
            onClick={() =>
              setShowCreateForm(
                true
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus
              size={
                18
              }
            />

            Añadir área
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showCreateForm && (
        <form
          onSubmit={
            createArea
          }
          className="space-y-5 rounded-xl border bg-white p-6 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Nueva área
              </h3>

              <p className="text-sm text-gray-500">
                Crea una zona para organizar las mesas del establecimiento.
              </p>
            </div>

            <button
              type="button"
              onClick={
                resetCreateForm
              }
              disabled={
                creating
              }
              aria-label="Cerrar formulario"
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X
                size={
                  20
                }
              />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="area-name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nombre *
              </label>

              <input
                id="area-name"
                type="text"
                value={
                  form.name
                }
                onChange={(
                  event
                ) =>
                  updateForm(
                    "name",
                    event
                      .target
                      .value
                  )
                }
                maxLength={
                  100
                }
                required
                disabled={
                  creating
                }
                placeholder="Ej. Sala principal"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="area-description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Descripción
              </label>

              <textarea
                id="area-description"
                value={
                  form.description
                }
                onChange={(
                  event
                ) =>
                  updateForm(
                    "description",
                    event
                      .target
                      .value
                  )
                }
                maxLength={
                  500
                }
                disabled={
                  creating
                }
                rows={
                  3
                }
                placeholder="Ej. Zona interior del restaurante"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="area-latitude"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Latitud
              </label>

              <input
                id="area-latitude"
                type="number"
                step="any"
                value={
                  form.latitude
                }
                onChange={(
                  event
                ) =>
                  updateForm(
                    "latitude",
                    event
                      .target
                      .value
                  )
                }
                disabled={
                  creating
                }
                placeholder="Ej. 36.5297"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="area-longitude"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Longitud
              </label>

              <input
                id="area-longitude"
                type="number"
                step="any"
                value={
                  form.longitude
                }
                onChange={(
                  event
                ) =>
                  updateForm(
                    "longitude",
                    event
                      .target
                      .value
                  )
                }
                disabled={
                  creating
                }
                placeholder="Ej. -6.2924"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="area-radius"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Radio de geolocalización (m)
              </label>

              <input
                id="area-radius"
                type="number"
                min={
                  1
                }
                max={
                  10000
                }
                step={
                  1
                }
                value={
                  form.radius
                }
                onChange={(
                  event
                ) =>
                  updateForm(
                    "radius",
                    event
                      .target
                      .value
                  )
                }
                disabled={
                  creating
                }
                placeholder="Ej. 50"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />

              <p className="mt-1 text-xs text-gray-500">
                Opcional. Entre 1 y 10000 metros.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                resetCreateForm
              }
              disabled={
                creating
              }
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                creating
              }
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? "Creando..."
                : "Crear área"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {areas.map(
          (
            area
          ) => (
            <div
              key={
                area.id
              }
              className="rounded-xl border bg-white p-6 shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Map
                    size={
                      24
                    }
                  />

                  <div>
                    <h3 className="font-semibold">
                      {
                        area.name
                      }
                    </h3>

                    <p className="text-sm text-gray-500">
                      {area.description ||
                        "Sin descripción"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      void toggleActive(
                        area.id,
                        area.active
                      )
                    }
                    aria-label={
                      area.active
                        ? "Desactivar área"
                        : "Activar área"
                    }
                  >
                    {area.active ? (
                      <ToggleRight
                        size={
                          28
                        }
                        className="text-green-600"
                      />
                    ) : (
                      <ToggleLeft
                        size={
                          28
                        }
                        className="text-gray-400"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void deleteArea(
                        area.id
                      )
                    }
                    aria-label="Desactivar área"
                  >
                    <Trash2
                      size={
                        20
                      }
                      className="text-red-500"
                    />
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {areas.length ===
        0 && (
        <div className="rounded-xl border bg-white p-6 text-gray-500">
          No hay áreas configuradas.
        </div>
      )}
    </div>
  );
}