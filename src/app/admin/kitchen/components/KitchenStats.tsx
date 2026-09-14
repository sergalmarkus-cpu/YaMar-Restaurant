"use client";

import {
  CheckCircle2,
  ChefHat,
  Clock3,
  PackageCheck,
  Truck,
} from "lucide-react";

import {
  ADMIN_KITCHEN_MESSAGES,
  type KitchenOrderStatus,
} from "@/config/admin-kitchen-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import type {
  KitchenOrder,
} from "../page";

interface Props {
  orders: KitchenOrder[];
}

const stats: Array<{
  status: KitchenOrderStatus;
  icon: typeof Clock3;
  color: string;
  bg: string;
}> = [
  {
    status: "pending",
    icon: Clock3,
    color:
      "text-yellow-600",
    bg: "bg-yellow-100",
  },
  {
    status: "accepted",
    icon: CheckCircle2,
    color:
      "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    status: "preparing",
    icon: ChefHat,
    color:
      "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    status: "ready",
    icon: PackageCheck,
    color:
      "text-green-600",
    bg: "bg-green-100",
  },
  {
    status: "delivered",
    icon: Truck,
    color:
      "text-indigo-600",
    bg: "bg-indigo-100",
  },
];

export default function KitchenStats({
  orders,
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

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {stats.map(
        (stat) => {
          const Icon =
            stat.icon;

          const value =
            orders.filter(
              (order) =>
                order.status ===
                stat.status
            ).length;

          return (
            <div
              key={
                stat.status
              }
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {
                      messages
                        .stats[
                        stat.status
                      ]
                    }
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {value}
                  </h2>
                </div>

                <div
                  className={`rounded-xl p-3 ${stat.bg}`}
                >
                  <Icon
                    className={`h-7 w-7 ${stat.color}`}
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