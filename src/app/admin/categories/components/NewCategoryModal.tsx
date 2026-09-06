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

  async function saveCategory() {
    if (
      !menuId ||
      !name.trim()
    ) {
      toast.error(
        "Completa todos los campos obligatorios."
      );

      return;
    }

    setSaving(true);

    try {
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
            "No se pudo crear la categoría."
        );

        return;
      }

      setMenuId(
        ""
      );

      setName(
        ""
      );

      setDescription(
        ""
      );

      setDisplayOrder(
        0
      );

      toast.success(
        "Categoría creada."
      );

      await onCreated();

      onClose();
    } catch (error) {
      console.error(
        "Error creating category:",
        error
      );

      toast.error(
        "No se pudo crear la categoría."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            Nueva Categoría
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
              <option value="">
                Selecciona un menú
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
              placeholder="Ej: Entrantes"
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
              className="w-full border rounded-xl p-3"
              rows={
                3
              }
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
            onClick={() =>
              void saveCategory()
            }
            disabled={
              saving
            }
            className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}