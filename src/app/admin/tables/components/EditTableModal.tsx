"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ADMIN_TABLES_MESSAGES,
} from "@/config/admin-tables-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import type {
  Table,
} from "@/types/table";

interface Area {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  table: Table | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditTableModal({
  open,
  table,
  onClose,
  onUpdated,
}: Props) {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_TABLES_MESSAGES[
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
    code,
    setCode,
  ] =
    useState(
      ""
    );

  const [
    capacity,
    setCapacity,
  ] =
    useState<number | null>(
      4
    );

  const [
    areaId,
    setAreaId,
  ] =
    useState(
      ""
    );

  const [
    saving,
    setSaving,
  ] =
    useState(
      false
    );

  useEffect(
    () => {
      if (
        !open ||
        !table
      ) {
        return;
      }

      setCode(
        table.code
      );

      setCapacity(
        table.capacity ??
          4
      );

      setAreaId(
        table.areaId
          ? table.areaId.toString()
          : ""
      );

      void loadAreas();
    },
    [
      open,
      table,
    ]
  );

  async function loadAreas() {
    const currentMessages =
      ADMIN_TABLES_MESSAGES[
        useAdminLanguageStore
          .getState()
          .language
      ];

    try {
      const response =
        await adminFetch(
          "/api/areas"
        );

      if (
        !response.ok
      ) {
        throw new Error(
          currentMessages.areasLoadError
        );
      }

      const json =
        await response.json();

      if (
        json.success
      ) {
        setAreas(
          json.data
        );
      }
    } catch (
      error
    ) {
      console.error(
        currentMessages.areasLoadError,
        error
      );
    }
  }

  async function saveChanges() {
    if (
      !table
    ) {
      return;
    }

    setSaving(
      true
    );

    try {
      const response =
        await adminFetch(
          `/api/tables/${table.id}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                code,

                capacity,

                areaId:
                  areaId
                    ? Number(
                        areaId
                      )
                    : null,
              }),
          }
        );

      const json =
        await response.json();

      if (
        json.success
      ) {
        onUpdated();
        onClose();
      }
    } catch (
      error
    ) {
      console.error(
        error
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  if (
    !open ||
    !table
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            {
              messages.editTitle
            }
          </h2>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm">
              {
                messages.code
              }
            </label>

            <input
              value={
                code
              }
              onChange={(
                event
              ) =>
                setCode(
                  event.target.value
                )
              }
              disabled={
                saving
              }
              className="w-full rounded-xl border p-3 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              {
                messages.area
              }
            </label>

            <select
              value={
                areaId
              }
              onChange={(
                event
              ) =>
                setAreaId(
                  event.target.value
                )
              }
              disabled={
                saving
              }
              className="w-full rounded-xl border p-3 disabled:opacity-50"
            >
              <option value="">
                {
                  messages.noArea
                }
              </option>

              {areas.map(
                (area) => (
                  <option
                    key={
                      area.id
                    }
                    value={String(
                      area.id
                    )}
                  >
                    {
                      area.name
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm">
              {
                messages.capacity
              }
            </label>

            <input
              type="number"
              min={1}
              value={
                capacity ??
                ""
              }
              onChange={(
                event
              ) =>
                setCapacity(
                  Math.max(
                    1,
                    Number(
                      event.target.value
                    )
                  )
                )
              }
              disabled={
                saving
              }
              className="w-full rounded-xl border p-3 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t p-6">
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="rounded-xl border px-5 py-3 disabled:opacity-50"
          >
            {
              messages.cancel
            }
          </button>

          <button
            type="button"
            disabled={
              saving
            }
            onClick={() =>
              void saveChanges()
            }
            className="rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving
              ? messages.saving
              : messages.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
}