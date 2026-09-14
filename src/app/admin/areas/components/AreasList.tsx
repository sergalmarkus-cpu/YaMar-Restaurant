"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
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
  ADMIN_AREAS_MESSAGES,
} from "@/config/admin-areas-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

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
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_AREAS_MESSAGES[
      language
    ];

  const [
    areas,
    setAreas,
  ] =
    useState<Area[]>(
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
    showCreateForm,
    setShowCreateForm,
  ] =
    useState(
      false
    );

  const [
    creating,
    setCreating,
  ] =
    useState(
      false
    );

  const [
    form,
    setForm,
  ] =
    useState<CreateAreaForm>(
      EMPTY_FORM
    );

  useEffect(
    () => {
      void loadAreas();
    },
    []
  );

  function currentMessages() {
    return ADMIN_AREAS_MESSAGES[
      useAdminLanguageStore
        .getState()
        .language
    ];
  }

  async function loadAreas() {
    setError(
      ""
    );

    try {
      const response =
        await adminFetch(
          "/api/areas"
        );

      const json =
        await response.json();

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

      setAreas(
        json.data
      );
    } catch (
      error
    ) {
      console.error(
        "Error loading areas:",
        error
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
  }

  function updateForm(
    field: keyof CreateAreaForm,
    value: string
  ) {
    setForm(
      (current) => ({
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

    setError(
      ""
    );
  }

  async function createArea(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(
      ""
    );

    const activeMessages =
      currentMessages();

    const name =
      form.name.trim();

    if (
      !name
    ) {
      setError(
        activeMessages.nameRequired
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
          activeMessages.invalidRadius
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
          activeMessages.invalidLatitude
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
          activeMessages.invalidLongitude
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
      const response =
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
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          activeMessages.createError
        );

        return;
      }

      resetCreateForm();

      await loadAreas();
    } catch (
      error
    ) {
      console.error(
        "Error creating area:",
        error
      );

      setError(
        activeMessages.createError
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
    setError(
      ""
    );

    const activeMessages =
      currentMessages();

    try {
      const response =
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
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          activeMessages.updateError
        );

        return;
      }

      await loadAreas();
    } catch (
      error
    ) {
      console.error(
        "Error updating area:",
        error
      );

      setError(
        activeMessages.updateError
      );
    }
  }

  async function deleteArea(
    id: number
  ) {
    const activeMessages =
      currentMessages();

    if (
      !window.confirm(
        activeMessages.deleteConfirm
      )
    ) {
      return;
    }

    setError(
      ""
    );

    try {
      const response =
        await adminFetch(
          `/api/areas/${id}`,
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
        if (
          response.status ===
          409
        ) {
          setError(
            activeMessages.areaHasTables
          );
        } else {
          setError(
            activeMessages.deleteError
          );
        }

        return;
      }

      await loadAreas();
    } catch (
      error
    ) {
      console.error(
        "Error deleting area:",
        error
      );

      setError(
        activeMessages.deleteError
      );
    }
  }

  if (
    loading
  ) {
    return (
      <div className="p-6">
        {
          messages.loading
        }
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {
              messages.title
            }
          </h2>

          <p className="text-gray-500">
            {
              messages.subtitle
            }
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
              size={18}
            />

            {
              messages.addArea
            }
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {
            error
          }
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
                {
                  messages.newArea
                }
              </h3>

              <p className="text-sm text-gray-500">
                {
                  messages.newAreaDescription
                }
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
              aria-label={
                messages.closeForm
              }
              title={
                messages.closeForm
              }
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X
                size={20}
              />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="area-name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {
                  messages.name
                }{" "}
                *
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
                    event.target.value
                  )
                }
                maxLength={
                  100
                }
                required
                disabled={
                  creating
                }
                placeholder={
                  messages.namePlaceholder
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="area-description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {
                  messages.description
                }
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
                    event.target.value
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
                placeholder={
                  messages.descriptionPlaceholder
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="area-latitude"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {
                  messages.latitude
                }
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
                    event.target.value
                  )
                }
                disabled={
                  creating
                }
                placeholder={
                  messages.latitudePlaceholder
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="area-longitude"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {
                  messages.longitude
                }
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
                    event.target.value
                  )
                }
                disabled={
                  creating
                }
                placeholder={
                  messages.longitudePlaceholder
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="area-radius"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {
                  messages.radius
                }
              </label>

              <input
                id="area-radius"
                type="number"
                min={1}
                max={10000}
                step={1}
                value={
                  form.radius
                }
                onChange={(
                  event
                ) =>
                  updateForm(
                    "radius",
                    event.target.value
                  )
                }
                disabled={
                  creating
                }
                placeholder={
                  messages.radiusPlaceholder
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />

              <p className="mt-1 text-xs text-gray-500">
                {
                  messages.radiusHint
                }
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
              {
                messages.cancel
              }
            </button>

            <button
              type="submit"
              disabled={
                creating
              }
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? messages.creating
                : messages.createArea}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {areas.map(
          (area) => (
            <div
              key={
                area.id
              }
              className="rounded-xl border bg-white p-6 shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Map
                    size={24}
                  />

                  <div>
                    <h3 className="font-semibold">
                      {
                        area.name
                      }
                    </h3>

                    <p className="text-sm text-gray-500">
                      {area.description ||
                        messages.noDescription}
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
                        ? messages.deactivateArea
                        : messages.activateArea
                    }
                    title={
                      area.active
                        ? messages.deactivateArea
                        : messages.activateArea
                    }
                  >
                    {area.active ? (
                      <ToggleRight
                        size={28}
                        className="text-green-600"
                      />
                    ) : (
                      <ToggleLeft
                        size={28}
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
                    aria-label={
                      messages.deleteArea
                    }
                    title={
                      messages.deleteArea
                    }
                  >
                    <Trash2
                      size={20}
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
          {
            messages.noAreas
          }
        </div>
      )}
    </div>
  );
}