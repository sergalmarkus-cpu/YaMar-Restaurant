"use client";

import {
  ADMIN_KITCHEN_MESSAGES,
  type KitchenOrderStatus,
} from "@/config/admin-kitchen-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import type {
  KitchenOrder,
} from "../page";

import OrderCard from "./OrderCard";

interface Props {
  orders: KitchenOrder[];
  currency: string;
  loading: boolean;
  onRefresh: () => Promise<void>;
}

const columns:
  KitchenOrderStatus[] = [
    "pending",
    "accepted",
    "preparing",
    "ready",
    "delivered",
  ];

export default function KitchenBoard({
  orders,
  currency,
  loading,
  onRefresh,
}: Props) {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_KITCHEN_MESSAGES[
      language
    ];

  async function updateStatus(
    id: number,
    status: string
  ) {
    try {
      const res =
        await adminFetch(
          `/api/orders/${id}`,
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
              }),
          }
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        console.error(
          messages.board
            .updateError,
          json.error ??
            json.message
        );

        return;
      }

      await onRefresh();
    } catch (
      error
    ) {
      console.error(
        messages.board
          .updateError,
        error
      );
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {columns.map(
        (column) => {
          const columnOrders =
            orders.filter(
              (order) =>
                order.status ===
                column
            );

          return (
            <div
              key={
                column
              }
              className="rounded-xl bg-gray-100 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold">
                  {
                    messages
                      .status[
                      column
                    ]
                  }
                </h2>

                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">
                  {
                    columnOrders.length
                  }
                </span>
              </div>

              <div className="space-y-3">
                {columnOrders.map(
                  (
                    order
                  ) => (
                    <OrderCard
                      key={
                        order.id
                      }
                      order={
                        order
                      }
                      currency={
                        currency
                      }
                      onStatusChange={
                        updateStatus
                      }
                    />
                  )
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}