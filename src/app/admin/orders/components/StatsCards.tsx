"use client";

import {
  CheckCircle,
  ChefHat,
  Clock,
  ShoppingCart,
} from "lucide-react";

import {
  ADMIN_ORDERS_MESSAGES,
} from "@/config/admin-orders-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

interface Props {
  total: number;
  pending: number;
  preparing: number;
  delivered: number;
}

export default function StatsCards({
  total,
  pending,
  preparing,
  delivered,
}: Props) {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_ORDERS_MESSAGES[
      language
    ];

  const cards = [
    {
      key: "orders",
      title:
        messages.stats.orders,
      value: total,
      icon: ShoppingCart,
      color: "bg-indigo-500",
    },
    {
      key: "pending",
      title:
        messages.stats.pending,
      value: pending,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      key: "preparing",
      title:
        messages.stats.preparing,
      value: preparing,
      icon: ChefHat,
      color: "bg-orange-500",
    },
    {
      key: "delivered",
      title:
        messages.stats.delivered,
      value: delivered,
      icon: CheckCircle,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(
        (card) => {
          const Icon =
            card.icon;

          return (
            <div
              key={
                card.key
              }
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {
                      card.title
                    }
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {
                      card.value
                    }
                  </h2>
                </div>

                <div
                  className={`${card.color} flex h-12 w-12 items-center justify-center rounded-xl`}
                >
                  <Icon
                    size={
                      22
                    }
                    className="text-white"
                  />
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}