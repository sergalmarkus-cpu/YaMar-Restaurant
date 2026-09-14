"use client";

import {
  ArrowUpDown,
  BookOpen,
  Clock,
  Pencil,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";

import {
  ADMIN_MENUS_MESSAGES,
  getAdminMenuTypeLabel,
} from "@/config/admin-menus-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

interface Menu {
  id: number;
  name: any;
  description: any;
  type: string;
  icon: string;
  displayOrder: number;
  active: boolean;
  hasSchedule: boolean;
}

interface Props {
  menus: Menu[];
  onEdit: (
    menu: Menu
  ) => void;
  onDelete: (
    menu: Menu
  ) => void;
  onToggle: (
    menu: Menu
  ) => void;
  onSchedule: (
    menu: Menu
  ) => void;
}

export default function MenusGrid({
  menus,
  onEdit,
  onDelete,
  onToggle,
  onSchedule,
}: Props) {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_MENUS_MESSAGES[
      language
    ];

  function getMenuName(
    name: any
  ) {
    if (
      typeof name ===
      "string"
    ) {
      return name;
    }

    return (
      name?.[
        language
      ] ||
      name?.es ||
      name?.en ||
      messages.unnamed
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {menus.map(
        (menu) => (
          <div
            key={
              menu.id
            }
            className="rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                    <BookOpen
                      className="text-indigo-600"
                      size={
                        24
                      }
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">
                      {getMenuName(
                        menu.name
                      )}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {getAdminMenuTypeLabel(
                        menu.type,
                        messages
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onToggle(
                      menu
                    )
                  }
                  title={
                    menu.active
                      ? messages.inactive
                      : messages.active
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    menu.active
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  {menu.active ? (
                    <Power
                      size={
                        18
                      }
                      className="text-green-600"
                    />
                  ) : (
                    <PowerOff
                      size={
                        18
                      }
                      className="text-gray-500"
                    />
                  )}
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    menu.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {menu.active
                    ? messages.active
                    : messages.inactive}
                </span>

                <div className="flex items-center gap-2">
                  {menu.hasSchedule ? (
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                      {
                        messages.scheduled
                      }
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                      {
                        messages.noSchedule
                      }
                    </span>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ArrowUpDown
                      size={
                        15
                      }
                    />

                    {
                      messages.displayOrder
                    }{" "}
                    {
                      menu.displayOrder
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-t bg-gray-50 p-4">
              <button
                type="button"
                onClick={() =>
                  onSchedule(
                    menu
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border bg-white py-2 transition hover:bg-gray-100"
              >
                <Clock
                  size={
                    17
                  }
                />

                {
                  messages.schedules
                }
              </button>

              <button
                type="button"
                onClick={() =>
                  onEdit(
                    menu
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2 text-white transition hover:bg-indigo-700"
              >
                <Pencil
                  size={
                    17
                  }
                />

                {
                  messages.edit
                }
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete(
                    menu
                  )
                }
                title={
                  messages.delete
                }
                className="flex w-12 items-center justify-center rounded-xl border transition hover:bg-red-50"
              >
                <Trash2
                  size={
                    18
                  }
                  className="text-red-600"
                />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}