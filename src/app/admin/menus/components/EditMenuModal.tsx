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

  useEffect(() => {
    if (!menu) {
      return;
    }

    setName(
      typeof menu.name ===
        "string"
        ? menu.name
        : menu.name?.es ??
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
  ]);

  if (
    !open ||
    !menu
  ) {
    return null;
  }

  async function updateMenu() {
    if (
      !menu
    ) {
      return;
    }

    if (
      !name.trim()
    ) {
      toast.error(
        "Introduce un nombre para el menú."
      );

      return;
    }

    setSaving(
      true
    );

    try {
      const response =
        await adminFetch(
          `/api/menus/${menu.id}`,
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
                  es:
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
          json.error ||
            json.message ||
            "No se pudo actualizar el menú."
        );

        return;
      }

      toast.success(
        "Menú actualizado."
      );

      await onUpdated();

      onClose();
    } catch (error) {
      console.error(
        "Error updating menu:",
        error
      );

      toast.error(
        "No se pudo actualizar el menú."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            Editar menú
          </h2>
        </div>

        <div className="p-6 space-y-5">
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
                  event.target.value
                )
              }
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Tipo
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
              className="w-full border rounded-xl p-3"
            >
              <option value="restaurant">
                Restaurante
              </option>

              <option value="snacks">
                Snacks
              </option>

              <option value="coffee">
                Cafetería
              </option>

              <option value="cocktails">
                Cócteles
              </option>

              <option value="breakfast">
                Desayunos
              </option>

              <option value="desserts">
                Postres
              </option>

              <option value="custom">
                Personalizado
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">
              Icono
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
                    event.target.value
                  )
                )
              }
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div className="flex items-center justify-between border rounded-xl p-4">
            <span>
              Menú activo
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
              void updateMenu()
            }
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50"
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