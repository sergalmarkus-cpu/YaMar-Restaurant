"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ADMIN_ORDERS_MESSAGES,
  type AdminOrderStatus,
} from "@/config/admin-orders-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  notes?: string;
}

const STATUSES:
  AdminOrderStatus[] = [
    "pending",
    "accepted",
    "preparing",
    "ready",
    "delivering",
    "delivered",
    "cancelled",
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
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_ORDERS_MESSAGES[
      language
    ];

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

      if (
        res.ok &&
        json.success
      ) {
        onUpdated();
      } else {
        alert(
          json.error ??
            json.message ??
            messages.edit
              .updateError
        );
      }
    } catch (error) {
      console.error(
        error
      );

      alert(
        messages.edit
          .updateError
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
          {
            messages.edit
              .title
          }{" "}
          {
            order.orderNumber
          }
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">
              {
                messages.edit
                  .status
              }
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
              {STATUSES.map(
                (
                  item
                ) => (
                  <option
                    key={
                      item
                    }
                    value={
                      item
                    }
                  >
                    {
                      messages
                        .status[
                        item
                      ]
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              {
                messages.edit
                  .notes
              }
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
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="rounded-lg border px-4 py-2 disabled:opacity-60"
          >
            {
              messages.edit
                .cancel
            }
          </button>

          <button
            type="button"
            onClick={() => {
              void save();
            }}
            disabled={
              saving
            }
            className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving
              ? messages.edit
                  .saving
              : messages.edit
                  .save}
          </button>
        </div>
      </div>
    </div>
  );
}