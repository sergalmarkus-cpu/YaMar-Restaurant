"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  toast,
} from "sonner";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

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
      category.name?.es ??
        ""
    );

    setDescription(
      category.description
        ?.es ?? ""
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
          json.error ||
            "No se pudieron cargar los menús."
        );

        return;
      }

      setMenus(
        json.data
      );
    } catch (error) {
      console.error(
        "Error loading menus:",
        error
      );

      toast.error(
        "No se pudieron cargar los menús."
      );
    }
  }

  async function updateCategory() {
    if (!category) {
      return;
    }

    if (
      !menuId ||
      !name.trim()
    ) {
      toast.error(
        "Completa los campos obligatorios."
      );

      return;
    }

    setSaving(true);

    try {
      const res =
        await adminFetch(
          `/api/categories/${category.id}`,
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

                name: {
                  es:
                    name.trim(),
                },

                description:
                  description.trim()
                    ? {
                        es:
                          description.trim(),
                      }
                    : {},

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
            "No se pudo actualizar la categoría."
        );

        return;
      }

      toast.success(
        "Categoría actualizada."
      );

      await onUpdated();

      onClose();
    } catch (error) {
      console.error(
        "Error updating category:",
        error
      );

      toast.error(
        "No se pudo actualizar la categoría."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  if (
    !open ||
    !category
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            Editar Categoría
          </h2>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm mb-2">
              Menú
            </label>

            <select
              value={
                menuId
              }
              onChange={(
                event
              ) =>
                setMenuId(
                  event.target
                    .value
                )
              }
              className="w-full border rounded-xl p-3"
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
                    {typeof menu.name ===
                    "string"
                      ? menu.name
                      : menu.name
                          .es ||
                        Object.values(
                          menu.name
                        )[0]}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">
              Nombre
            </label>

            <input
              value={
                name
              }
              onChange={(
                event
              ) =>
                setName(
                  event.target
                    .value
                )
              }
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Descripción
            </label>

            <textarea
              value={
                description
              }
              onChange={(
                event
              ) =>
                setDescription(
                  event.target
                    .value
                )
              }
              rows={
                3
              }
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Orden
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
                    event.target
                      .value
                  )
                )
              }
              className="w-full border rounded-xl p-3"
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
                  event.target
                    .checked
                )
              }
            />

            Activa
          </label>
        </div>

        <div className="border-t p-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="px-5 py-3 border rounded-xl"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={
              saving
            }
            onClick={() =>
              void updateCategory()
            }
            className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}