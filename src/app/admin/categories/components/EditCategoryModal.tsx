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
  getAdminCategoryText,
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

interface Category {
  id: number;
  menuId: number;

  name:
    Record<
      string,
      string
    >;

  description:
    | Record<
        string,
        string
      >
    | null;

  displayOrder: number;
  active: boolean;
}

interface Props {
  open: boolean;

  category:
    Category | null;

  onClose: () => void;
  onUpdated: () => void;
}

export default function EditCategoryModal({
  open,
  category,
  onClose,
  onUpdated,
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
    return ADMIN_CATEGORIES_MESSAGES[
      useAdminLanguageStore
        .getState()
        .language
    ];
  }

  useEffect(() => {
    if (
      !open ||
      !category
    ) {
      return;
    }

    void loadMenus();

    setMenuId(
      String(
        category.menuId
      )
    );

    setName(
      getAdminCategoryText(
        category.name,
        language,
        ""
      )
    );

    setDescription(
      getAdminCategoryText(
        category.description,
        language,
        ""
      )
    );

    setDisplayOrder(
      category.displayOrder
    );

    setActive(
      category.active
    );
  }, [
    open,
    category,
    language,
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

  async function updateCategory() {
    const currentCategory =
      category;

    if (!currentCategory) {
      return;
    }

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

    const nextName = {
      ...currentCategory.name,

      [currentLanguage]:
        name.trim(),
    };

    const nextDescription = {
      ...(
        currentCategory.description ??
        {}
      ),
    };

    const trimmedDescription =
      description.trim();

    if (
      trimmedDescription
    ) {
      nextDescription[
        currentLanguage
      ] =
        trimmedDescription;
    }

    if (
      !trimmedDescription
    ) {
      delete nextDescription[
        currentLanguage
      ];
    }

    setSaving(true);

    try {
      const res =
        await adminFetch(
          `/api/categories/${currentCategory.id}`,
          {
            method:
              "PUT",

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

                name:
                  nextName,

                description:
                  nextDescription,

                displayOrder,

                active,
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
        "Error updating category:",
        error
      );

      toast.error(
        activeMessages
          .editError
      );
    } finally {
      setSaving(false);
    }
  }

  if (
    !open ||
    !category
  ) {
    return null;
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
              rows={
                3
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

          <label className="flex items-center gap-3">
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

            {
              messages.activeLabel
            }
          </label>
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
              void updateCategory()
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