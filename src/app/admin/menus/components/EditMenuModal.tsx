"use client";

import {
  useEffect,
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

interface Menu {
  id: number;
  name: any;
  type: string;
  icon: string;
  displayOrder: number;
  active: boolean;
}

interface Props {
  open: boolean;
  menu: Menu | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditMenuModal({
  open,
  menu,
  onClose,
  onUpdated,
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
    active,
    setActive,
  ] =
    useState(true);

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

  useEffect(() => {
    if (!menu) {
      return;
    }

    const currentLanguage =
      useAdminLanguageStore
        .getState()
        .language;

    setName(
      typeof menu.name ===
        "string"
        ? menu.name
        : menu.name?.[
              currentLanguage
            ] ??
            menu.name?.es ??
            menu.name?.en ??
            ""
    );

    setType(
      menu.type
    );

    setIcon(
      menu.icon ??
        ""
    );

    setDisplayOrder(
      menu.displayOrder ??
        0
    );

    setActive(
      menu.active
    );
  }, [
    menu,
    language,
  ]);

  if (
    !open ||
    !menu
  ) {
    return null;
  }

  async function updateMenu() {
    const currentMenu =
      menu;

    if (!currentMenu) {
      return;
    }

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
      const existingNames =
        typeof currentMenu.name ===
          "object" &&
        currentMenu.name !==
          null
          ? currentMenu.name
          : {};

      const response =
        await adminFetch(
          `/api/menus/${currentMenu.id}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name: {
                  ...existingNames,
                  [language]:
                    name.trim(),
                },

                type,

                icon:
                  icon.trim(),

                displayOrder,

                active,
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
            .editError
        );

        return;
      }

      toast.success(
        activeMessages
          .editSuccess
      );

      await onUpdated();

      onClose();
    } catch (
      error
    ) {
      console.error(
        "Error updating menu:",
        error
      );

      toast.error(
        activeMessages
          .editError
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
              messages.editTitle
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

          <div className="flex items-center justify-between rounded-xl border p-4">
            <span>
              {
                messages.activeMenu
              }
            </span>

            <input
              type="checkbox"
              checked={
                active
              }
              onChange={(
                event
              ) =>
                setActive(
                  event.target.checked
                )
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
              void updateMenu()
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