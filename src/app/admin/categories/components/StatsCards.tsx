"use client";

import {
  ArrowUpDown,
  CheckCircle,
  FolderTree,
  XCircle,
} from "lucide-react";

import {
  ADMIN_CATEGORIES_MESSAGES,
} from "@/config/admin-categories-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

interface Props {
  total: number;
  active: number;
  inactive: number;
  menus: number;
}

export default function StatsCards({
  total,
  active,
  inactive,
  menus,
}: Props) {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_CATEGORIES_MESSAGES[
      language
    ];

  const cards = [
    {
      title:
        messages.totalCategories,
      value:
        total,
      icon:
        FolderTree,
      color:
        "text-indigo-600",
      bg:
        "bg-indigo-50",
    },
    {
      title:
        messages.activeCategories,
      value:
        active,
      icon:
        CheckCircle,
      color:
        "text-green-600",
      bg:
        "bg-green-50",
    },
    {
      title:
        messages.inactiveCategories,
      value:
        inactive,
      icon:
        XCircle,
      color:
        "text-red-600",
      bg:
        "bg-red-50",
    },
    {
      title:
        messages.menus,
      value:
        menus,
      icon:
        ArrowUpDown,
      color:
        "text-yellow-600",
      bg:
        "bg-yellow-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(
        (
          card
        ) => {
          const Icon =
            card.icon;

          return (
            <div
              key={
                card.title
              }
              className="rounded-2xl border bg-white p-6 shadow-sm"
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
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.bg}`}
                >
                  <Icon
                    size={
                      28
                    }
                    className={
                      card.color
                    }
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