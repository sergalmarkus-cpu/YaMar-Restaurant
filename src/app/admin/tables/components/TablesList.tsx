"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
} from "lucide-react";

import {
  toast,
} from "sonner";

import StatsCards from "./StatsCards";
import TablesGrid from "./TablesGrid";
import NewTableModal from "./NewTableModal";
import EditTableModal from "./EditTableModal";
import QRModal from "./QRModal";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  ADMIN_TABLES_MESSAGES,
} from "@/config/admin-tables-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import type {
  Table,
} from "@/types/table";

interface Area {
  id: number;
  name: string;
}

export default function TablesList() {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_TABLES_MESSAGES[
      language
    ];

  const [
    tables,
    setTables,
  ] =
    useState<Table[]>(
      []
    );

  const [
    areas,
    setAreas,
  ] =
    useState<Area[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    search,
    setSearch,
  ] =
    useState(
      ""
    );

  const [
    selectedArea,
    setSelectedArea,
  ] =
    useState(
      ""
    );

  const [
    showNewModal,
    setShowNewModal,
  ] =
    useState(
      false
    );

  const [
    editingTable,
    setEditingTable,
  ] =
    useState<Table | null>(
      null
    );

  const [
    qrTable,
    setQrTable,
  ] =
    useState<Table | null>(
      null
    );

  const [
    qrImage,
    setQrImage,
  ] =
    useState(
      ""
    );

  useEffect(
    () => {
      void loadData();
    },
    []
  );

  async function loadData() {
    setLoading(
      true
    );

    try {
      await Promise.all([
        loadTables(),
        loadAreas(),
      ]);
    } catch (
      error
    ) {
      console.error(
        error
      );

      toast.error(
        ADMIN_TABLES_MESSAGES[
          useAdminLanguageStore
            .getState()
            .language
        ].areasLoadError
      );
    }

    setLoading(
      false
    );
  }

  async function loadTables() {
    const response =
      await adminFetch(
        "/api/tables"
      );

    const json =
      await response.json();

    if (
      json.success
    ) {
      setTables(
        json.data
      );
    }
  }

  async function loadAreas() {
    const response =
      await adminFetch(
        "/api/areas"
      );

    const json =
      await response.json();

    if (
      json.success
    ) {
      setAreas(
        json.data
      );
    }
  }

  async function toggleTable(
    table: Table
  ) {
    const currentMessages =
      ADMIN_TABLES_MESSAGES[
        useAdminLanguageStore
          .getState()
          .language
      ];

    try {
      const response =
        await adminFetch(
          `/api/tables/${table.id}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                active:
                  !table.active,
              }),
          }
        );

      const json =
        await response.json();

      if (
        json.success
      ) {
        toast.success(
          table.active
            ? currentMessages.tableDeactivated
            : currentMessages.tableActivated
        );

        await loadTables();
      } else {
        toast.error(
          currentMessages.updateError
        );
      }
    } catch (
      error
    ) {
      console.error(
        error
      );

      toast.error(
        currentMessages.updateGenericError
      );
    }
  }

  async function deleteTable(
    table: Table
  ) {
    const currentMessages =
      ADMIN_TABLES_MESSAGES[
        useAdminLanguageStore
          .getState()
          .language
      ];

    if (
      !window.confirm(
        currentMessages.deleteConfirm(
          table.code
        )
      )
    ) {
      return;
    }

    try {
      const response =
        await adminFetch(
          `/api/tables/${table.id}`,
          {
            method:
              "DELETE",
          }
        );

      const json =
        await response.json();

      if (
        json.success
      ) {
        toast.success(
          currentMessages.deletedSuccessfully
        );

        await loadTables();
      } else {
        toast.error(
          currentMessages.deleteError
        );
      }
    } catch (
      error
    ) {
      console.error(
        error
      );

      toast.error(
        currentMessages.deleteGenericError
      );
    }
  }

  async function showQR(
    table: Table
  ) {
    const currentMessages =
      ADMIN_TABLES_MESSAGES[
        useAdminLanguageStore
          .getState()
          .language
      ];

    try {
      const response =
        await adminFetch(
          "/api/tables/qr",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                tableId:
                  table.id,
              }),
          }
        );

      const json =
        await response.json();

      if (
        json.success
      ) {
        setQrImage(
          json.data.qrImage
        );

        setQrTable(
          table
        );
      } else {
        toast.error(
          json.error ||
            currentMessages.qrGenerationError
        );
      }
    } catch (
      error
    ) {
      console.error(
        error
      );

      toast.error(
        currentMessages.qrGenerationGenericError
      );
    }
  }

  const filteredTables =
    useMemo(
      () => {
        return tables.filter(
          (table) => {
            const matchesSearch =
              table.code
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                );

            const matchesArea =
              selectedArea ===
                "" ||
              String(
                table.areaId ??
                  ""
              ) ===
                selectedArea;

            return (
              matchesSearch &&
              matchesArea
            );
          }
        );
      },
      [
        tables,
        search,
        selectedArea,
      ]
    );

  const stats =
    useMemo(
      () => ({
        total:
          tables.length,

        available:
          tables.filter(
            (table) =>
              table.status ===
              "available"
          ).length,

        occupied:
          tables.filter(
            (table) =>
              table.status ===
              "occupied"
          ).length,

        reserved:
          tables.filter(
            (table) =>
              table.status ===
              "reserved"
          ).length,
      }),
      [
        tables,
      ]
    );

  if (
    loading
  ) {
    return (
      <div className="p-8">
        {
          messages.loading
        }
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {
              messages.title
            }
          </h1>

          <p className="mt-1 text-gray-500">
            {
              messages.subtitle
            }
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowNewModal(
              true
            )
          }
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700"
        >
          <Plus
            size={18}
          />

          {
            messages.newTable
          }
        </button>
      </div>

      <StatsCards
        total={
          stats.total
        }
        available={
          stats.available
        }
        occupied={
          stats.occupied
        }
        reserved={
          stats.reserved
        }
      />

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder={
                messages.searchPlaceholder
              }
              className="w-full rounded-xl border py-3 pl-10 pr-4"
            />
          </div>

          <select
            value={
              selectedArea
            }
            onChange={(
              event
            ) =>
              setSelectedArea(
                event.target.value
              )
            }
            className="rounded-xl border px-4 py-3 lg:w-64"
          >
            <option value="">
              {
                messages.allAreas
              }
            </option>

            {areas.map(
              (area) => (
                <option
                  key={
                    area.id
                  }
                  value={String(
                    area.id
                  )}
                >
                  {
                    area.name
                  }
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <TablesGrid
        tables={
          filteredTables
        }
        onShowQR={
          showQR
        }
        onEdit={
          setEditingTable
        }
        onDelete={
          deleteTable
        }
        onToggle={
          toggleTable
        }
      />

      <NewTableModal
        open={
          showNewModal
        }
        onClose={() =>
          setShowNewModal(
            false
          )
        }
        onCreated={
          loadTables
        }
      />

      <EditTableModal
        open={
          editingTable !==
          null
        }
        table={
          editingTable
        }
        onClose={() =>
          setEditingTable(
            null
          )
        }
        onUpdated={() => {
          void loadTables();

          setEditingTable(
            null
          );
        }}
      />

      <QRModal
        open={
          qrTable !==
          null
        }
        tableCode={
          qrTable?.code ??
          ""
        }
        qrImage={
          qrImage
        }
        onClose={() => {
          setQrTable(
            null
          );

          setQrImage(
            ""
          );
        }}
      />
    </div>
  );
}