"use client";

import {
  Clock3,
} from "lucide-react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_KITCHEN_MESSAGES,
  type KitchenOrderStatus,
} from "@/config/admin-kitchen-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  tableName: string | null;
  total: number;
  status: string;
  createdAt: string;
}

interface Props {
  order: Order;

  currency: string;

  onStatusChange: (
    id: number,
    status: string
  ) => void;
}

const nextStatus: Record<
  KitchenOrderStatus,
  KitchenOrderStatus | null
> = {
  pending: "accepted",
  accepted: "preparing",
  preparing: "ready",
  ready: "delivered",
  delivered: null,
};

export default function OrderCard({
  order,
  currency,
  onStatusChange,
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

  const locale =
    ADMIN_LANGUAGE_LOCALES[
      language
    ];

  const created =
    new Date(
      order.createdAt
    );

  const minutes =
    Math.max(
      0,
      Math.floor(
        (Date.now() -
          created.getTime()) /
          60000
      )
    );

  const currentStatus =
    order.status as
      KitchenOrderStatus;

  const targetStatus =
    nextStatus[
      currentStatus
    ] ?? null;

  function formatMoney(
    value: number
  ) {
    const numericValue =
      Number(value);

    if (
      !Number.isFinite(
        numericValue
      )
    ) {
      return "—";
    }

    if (!currency) {
      return numericValue.toFixed(
        2
      );
    }

    try {
      return new Intl.NumberFormat(
        locale,
        {
          style:
            "currency",
          currency,
        }
      ).format(
        numericValue
      );
    } catch {
      return `${numericValue.toFixed(
        2
      )} ${currency}`;
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex justify-between gap-3">
        <h3 className="font-bold">
          #
          {
            order.orderNumber
          }
        </h3>

        <span className="font-semibold">
          {formatMoney(
            order.total
          )}
        </span>
      </div>

      <p className="mt-2 text-gray-600">
        {
          messages.card
            .table
        }{" "}
        {order.tableName ??
          order.tableId}
      </p>

      <div className="mt-3 flex items-center gap-2 text-orange-600">
        <Clock3
          size={16}
        />

        {minutes}{" "}
        {
          messages.card
            .minutes
        }
      </div>

      {targetStatus && (
        <button
          type="button"
          onClick={() =>
            onStatusChange(
              order.id,
              targetStatus
            )
          }
          className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700"
        >
          {
            messages.card
              .actions[
              currentStatus as
                | "pending"
                | "accepted"
                | "preparing"
                | "ready"
            ]
          }
        </button>
      )}
    </div>
  );
}