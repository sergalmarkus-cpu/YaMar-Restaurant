"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  toast,
} from "sonner";

import {
  ADMIN_CATEGORIES_MESSAGES,
  getAdminMenuText,
} from "@/config/admin-categories-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

interface Menu {
  id: number;
  name:
    | Record<
        string,
        string
      >
    | string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function NewCategoryModal({
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
    ADMIN_CATEGORIES_MESSAGES[
      language
    ];

  const [
    menus,
    setMenus,
  ] =
    useState<Menu[]>([]);

  const [
    menuId,
    setMenuId,
  ] =
    useState("");

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    description,
    setDescription,
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
    return ADMIN_CATEGORIES_MESSAGES[
      useAdminLanguageStore
        .getState()
        .language
    ];
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    void loadMenus();
  }, [
    open,
  ]);

  async function loadMenus() {
    try {
      const res =
        await adminFetch(
          "/api/menus"
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        toast.error(
          currentMessages()
            .menusLoadError
        );

        return;
      }

      setMenus(
        json.data
      );
    } catch (
      error
    ) {
      console.error(
        "Error loading menus:",
        error
      );

      toast.error(
        currentMessages()
          .menusLoadError
      );
    }
  }

  async function saveCategory() {
    const currentLanguage =
      useAdminLanguageStore
        .getState()
        .language;

    const activeMessages =
      ADMIN_CATEGORIES_MESSAGES[
        currentLanguage
      ];

    if (
      !menuId ||
      !name.trim()
    ) {
      toast.error(
        activeMessages
          .requiredFields
      );

      return;
    }

    setSaving(true);

    try {
      const trimmedDescription =
        description.trim();

      const res =
        await adminFetch(
          "/api/categories",
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
                  Number(
                    menuId
                  ),

                name: {
                  [currentLanguage]:
                    name.trim(),
                },

                description:
                  trimmedDescription
                    ? {
                        [currentLanguage]:
                          trimmedDescription,
                      }
                    : {},

                displayOrder,

                active:
                  true,
              }),
          }
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        toast.error(
          json.error ||
            activeMessages
              .createError
        );

        return;
      }

      setMenuId("");
      setName("");
      setDescription("");
      setDisplayOrder(0);

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
        "Error creating category:",
        error
      );

      toast.error(
        activeMessages
          .createError
      );
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return null;
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
                messages.menu
              }
            </label>

            <select
              value={
                menuId
              }
              onChange={(
                event
              ) =>
                setMenuId(
                  event.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            >
              <option value="">
                {
                  messages.selectMenu
                }
              </option>

              {menus.map(
                (
                  menu
                ) => (
                  <option
                    key={
                      menu.id
                    }
                    value={
                      menu.id
                    }
                  >
                    {getAdminMenuText(
                      menu.name,
                      language,
                      messages
                        .unnamedMenu
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm">
              {
                messages.name
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
                messages.namePlaceholder
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              {
                messages.description
              }
            </label>

            <textarea
              value={
                description
              }
              onChange={(
                event
              ) =>
                setDescription(
                  event.target.value
                )
              }
              className="w-full rounded-xl border p-3"
              rows={
                3
              }
              placeholder={
                messages.descriptionPlaceholder
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
              min={
                0
              }
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
            onClick={() =>
              void saveCategory()
            }
            disabled={
              saving
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