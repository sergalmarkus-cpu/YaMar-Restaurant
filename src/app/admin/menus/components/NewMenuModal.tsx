"use client";

import {
  useState,
} from "react";

import {
  toast,
} from "sonner";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

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

  if (!open) {
    return null;
  }

  async function createMenu() {
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
          json.error ||
            json.message ||
            "No se pudo crear el menú."
        );

        return;
      }

      setName(
        ""
      );

      setType(
        "restaurant"
      );

      setIcon(
        ""
      );

      setDisplayOrder(
        0
      );

      toast.success(
        "Menú creado."
      );

      await onCreated();

      onClose();
    } catch (error) {
      console.error(
        "Error creating menu:",
        error
      );

      toast.error(
        "No se pudo crear el menú."
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
            Nuevo menú
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
              placeholder="Ej: Carta Restaurante"
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
              placeholder="🍽️ ☕ 🍷 🥗"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Orden de visualización
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
              void createMenu()
            }
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50"
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