"use client";

import {
  useState,
} from "react";

import {
  toast,
} from "sonner";

import {
  ADMIN_MENUS_MESSAGES,
} from "@/config/admin-menus-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function NewMenuModal({
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
    ADMIN_MENUS_MESSAGES[
      language
    ];

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    type,
    setType,
  ] =
    useState(
      "restaurant"
    );

  const [
    icon,
    setIcon,
  ] =
    useState("");

  const [
    displayOrder,
    setDisplayOrder,
  ] =
    useState(0);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  function currentMessages() {
    return ADMIN_MENUS_MESSAGES[
      useAdminLanguageStore
        .getState()
        .language
    ];
  }

  if (!open) {
    return null;
  }

  async function createMenu() {
    const activeMessages =
      currentMessages();

    if (
      !name.trim()
    ) {
      toast.error(
        activeMessages
          .menuNameRequired
      );

      return;
    }

    setSaving(
      true
    );

    try {
      const response =
        await adminFetch(
          "/api/menus",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name: {
                  es:
                    name.trim(),
                },

                description:
                  {},

                type,

                icon:
                  icon.trim(),

                displayOrder,

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
          activeMessages
            .createError
        );

        return;
      }

      setName("");
      setType(
        "restaurant"
      );
      setIcon("");
      setDisplayOrder(
        0
      );

      toast.success(
        activeMessages
          .createSuccess
      );

      await onCreated();

      onClose();
    } catch (
      error
    ) {
      console.error(
        "Error creating menu:",
        error
      );

      toast.error(
        activeMessages
          .createError
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            {
              messages.createTitle
            }
          </h2>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm">
              {
                messages.menuName
              }
            </label>

            <input
              value={
                name
              }
              onChange={(
                event
              ) =>
                setName(
                  event.target.value
                )
              }
              className="w-full rounded-xl border p-3"
              placeholder={
                messages.menuNamePlaceholder
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              {
                messages.menuType
              }
            </label>

            <select
              value={
                type
              }
              onChange={(
                event
              ) =>
                setType(
                  event.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            >
              <option value="restaurant">
                {
                  messages.restaurant
                }
              </option>

              <option value="snacks">
                {
                  messages.snacks
                }
              </option>

              <option value="coffee">
                {
                  messages.coffee
                }
              </option>

              <option value="cocktails">
                {
                  messages.cocktails
                }
              </option>

              <option value="breakfast">
                {
                  messages.breakfast
                }
              </option>

              <option value="desserts">
                {
                  messages.desserts
                }
              </option>

              <option value="custom">
                {
                  messages.custom
                }
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm">
              {
                messages.icon
              }
            </label>

            <input
              value={
                icon
              }
              onChange={(
                event
              ) =>
                setIcon(
                  event.target.value
                )
              }
              className="w-full rounded-xl border p-3"
              placeholder={
                messages.iconPlaceholder
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              {
                messages.displayOrder
              }
            </label>

            <input
              type="number"
              min={0}
              value={
                displayOrder
              }
              onChange={(
                event
              ) =>
                setDisplayOrder(
                  Number(
                    event.target.value
                  )
                )
              }
              className="w-full rounded-xl border p-3"
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
            className="rounded-xl border px-5 py-3"
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
              void createMenu()
            }
            className="rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 disabled:opacity-50"
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