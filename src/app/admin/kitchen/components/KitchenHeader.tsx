"use client";

import {
  ChefHat,
  RefreshCw,
} from "lucide-react";

import {
  ADMIN_KITCHEN_MESSAGES,
} from "@/config/admin-kitchen-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

export default function KitchenHeader() {
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
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-orange-100 p-3">
            <ChefHat className="h-8 w-8 text-orange-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {
                messages.header
                  .title
              }
            </h1>

            <p className="text-gray-500">
              {
                messages.header
                  .subtitle
              }
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          onClick={() =>
            window.location.reload()
          }
        >
          <RefreshCw
            size={18}
          />

          {
            messages.header
              .refresh
          }
        </button>
      </div>
    </div>
  );
}