"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  notes?: string;
}

const statuses = [
  {
    value: "pending",
    label: "Pendiente",
  },
  {
    value: "accepted",
    label: "Aceptado",
  },
  {
    value: "preparing",
    label: "En preparación",
  },
  {
    value: "ready",
    label: "Listo",
  },
  {
    value: "delivering",
    label: "En reparto",
  },
  {
    value: "delivered",
    label: "Entregado",
  },
  {
    value: "cancelled",
    label: "Cancelado",
  },
];

export default function EditOrderModal({
  open,
  order,
  onClose,
  onUpdated,
}: {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [
    status,
    setStatus,
  ] =
    useState("");

  const [
    notes,
    setNotes,
  ] =
    useState("");

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  useEffect(() => {
    if (!order) {
      return;
    }

    setStatus(
      order.status
    );

    setNotes(
      order.notes ?? ""
    );
  }, [order]);

  if (
    !open ||
    !order
  ) {
    return null;
  }

  async function save() {
    if (!order) {
      return;
    }

    setSaving(
      true
    );

    try {
      const res =
        await adminFetch(
          `/api/orders/${order.id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                status,
                notes,
              }),
          }
        );

      const json =
        await res.json();

      if (json.success) {
        onUpdated();
      } else {
        alert(
          json.error ??
            "No se pudo actualizar el pedido."
        );
      }
    } catch (error) {
      console.error(
        error
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6">
        <h2 className="mb-6 text-xl font-bold">
          Editar pedido{" "}
          {order.orderNumber}
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">
              Estado
            </label>

            <select
              value={
                status
              }
              onChange={(
                event
              ) =>
                setStatus(
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border p-2"
            >
              {statuses.map(
                (item) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {
                      item.label
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Observaciones
            </label>

            <textarea
              rows={
                4
              }
              value={
                notes
              }
              onChange={(
                event
              ) =>
                setNotes(
                  event.target
                    .value
                )
              }
              className="w-full rounded-lg border p-2"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={
              onClose
            }
            className="rounded-lg border px-4 py-2"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              void save();
            }}
            disabled={
              saving
            }
            className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
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