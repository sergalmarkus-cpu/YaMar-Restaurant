"use client";

import {
  Edit2,
  Grid3X3,
  QrCode,
  Trash2,
  Users,
} from "lucide-react";

import {
  ADMIN_TABLES_MESSAGES,
} from "@/config/admin-tables-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import type {
  Table,
} from "@/types/table";

interface Props {
  tables: Table[];
  onShowQR: (
    table: Table
  ) => void;
  onEdit: (
    table: Table
  ) => void;
  onDelete: (
    table: Table
  ) => void;
  onToggle: (
    table: Table
  ) => void;
}

export default function TablesGrid({
  tables,
  onShowQR,
  onEdit,
  onDelete,
  onToggle,
}: Props) {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_TABLES_MESSAGES[
      language
    ];

  function badge(
    status: string | null
  ) {
    switch (
      status
    ) {
      case "available":
        return "bg-green-100 text-green-700";

      case "occupied":
        return "bg-red-100 text-red-700";

      case "reserved":
        return "bg-yellow-100 text-yellow-700";

      case "cleaning":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function label(
    status: string | null
  ) {
    switch (
      status
    ) {
      case "available":
        return messages.statusAvailable;

      case "occupied":
        return messages.statusOccupied;

      case "reserved":
        return messages.statusReserved;

      case "cleaning":
        return messages.statusCleaning;

      default:
        return status;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {tables.map(
        (table) => (
          <div
            key={
              table.id
            }
            className="rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                    <Grid3X3
                      className="text-indigo-600"
                      size={24}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">
                      {
                        messages.table
                      }{" "}
                      {
                        table.code
                      }
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <Users
                        size={15}
                      />

                      {
                        table.capacity
                      }{" "}
                      {table.capacity ===
                      1
                        ? messages.person
                        : messages.people}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onToggle(
                      table
                    )
                  }
                  title={
                    table.active
                      ? messages.deactivateTable
                      : messages.activateTable
                  }
                  aria-label={
                    table.active
                      ? messages.deactivateTable
                      : messages.activateTable
                  }
                  className={`h-3 w-3 rounded-full ${
                    table.active
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              </div>

              <div className="mt-5">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${badge(
                    table.status
                  )}`}
                >
                  {
                    label(
                      table.status
                    )
                  }
                </span>
              </div>
            </div>

            <div className="flex gap-2 border-t bg-gray-50 p-4">
              <button
                type="button"
                onClick={() =>
                  onShowQR(
                    table
                  )
                }
                title={
                  messages.showQr
                }
                aria-label={
                  messages.showQr
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border bg-white py-2 transition hover:bg-gray-100"
              >
                <QrCode
                  size={17}
                />

                QR
              </button>

              <button
                type="button"
                onClick={() =>
                  onEdit(
                    table
                  )
                }
                title={
                  messages.editTableAction
                }
                aria-label={
                  messages.editTableAction
                }
                className="rounded-xl p-2 transition hover:bg-indigo-100"
              >
                <Edit2
                  size={18}
                  className="text-indigo-600"
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete(
                    table
                  )
                }
                title={
                  messages.deleteTableAction
                }
                aria-label={
                  messages.deleteTableAction
                }
                className="rounded-xl p-2 transition hover:bg-red-100"
              >
                <Trash2
                  size={18}
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