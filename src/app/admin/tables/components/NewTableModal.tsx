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

interface Area {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function NewTableModal({
  open,
  onClose,
  onCreated,
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
    useState(
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
        !open
      ) {
        return;
      }

      void loadAreas();
    },
    [
      open,
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

  async function saveTable() {
    const currentMessages =
      ADMIN_TABLES_MESSAGES[
        useAdminLanguageStore
          .getState()
          .language
      ];

    const normalizedCode =
      code.trim();

    if (
      !normalizedCode
    ) {
      alert(
        currentMessages.enterTableCode
      );

      return;
    }

    if (
      capacity <
      1
    ) {
      alert(
        currentMessages.minimumCapacity
      );

      return;
    }

    setSaving(
      true
    );

    try {
      const payload = {
        establishmentId:
          1,

        areaId:
          areaId
            ? Number(
                areaId
              )
            : null,

        code:
          normalizedCode,

        capacity,

        active:
          true,
      };

      const response =
        await adminFetch(
          "/api/tables",
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
        console.error(
          "Error creating table:",
          json
        );

        alert(
          json.message ??
            currentMessages.createError
        );

        return;
      }

      setCode(
        ""
      );

      setCapacity(
        4
      );

      setAreaId(
        ""
      );

      await onCreated();

      onClose();
    } catch (
      error
    ) {
      console.error(
        "Error creating table:",
        error
      );

      alert(
        currentMessages.createGenericError
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  if (
    !open
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            {
              messages.createTitle
            }
          </h2>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
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
              className="w-full rounded-xl border p-3"
              placeholder={
                messages.codePlaceholder
              }
              disabled={
                saving
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
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
              className="w-full rounded-xl border p-3"
              disabled={
                saving
              }
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
            <label className="mb-2 block text-sm font-medium">
              {
                messages.capacity
              }
            </label>

            <input
              type="number"
              min={1}
              value={
                capacity
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
              className="w-full rounded-xl border p-3"
              disabled={
                saving
              }
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
            onClick={() =>
              void saveTable()
            }
            disabled={
              saving
            }
            className="rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving
              ? messages.saving
              : messages.save}
          </button>
        </div>
      </div>
    </div>
  );
}