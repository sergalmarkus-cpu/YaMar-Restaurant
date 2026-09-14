"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  LayoutGrid,
  List,
  Plus,
  Search,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  ADMIN_MENUS_MESSAGES,
  getAdminMenuTypeLabel,
} from "@/config/admin-menus-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import EditMenuModal from "./EditMenuModal";
import MenuScheduleModal from "./MenuScheduleModal";
import MenusGrid from "./MenusGrid";
import NewMenuModal from "./NewMenuModal";
import StatsCards from "./StatsCards";

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

export default function MenusList() {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_MENUS_MESSAGES[
      language
    ];

  const [
    menus,
    setMenus,
  ] =
    useState<Menu[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    grid,
    setGrid,
  ] =
    useState(true);

  const [
    newOpen,
    setNewOpen,
  ] =
    useState(false);

  const [
    editing,
    setEditing,
  ] =
    useState<Menu | null>(
      null
    );

  const [
    scheduling,
    setScheduling,
  ] =
    useState<Menu | null>(
      null
    );

  function currentMessages() {
    return ADMIN_MENUS_MESSAGES[
      useAdminLanguageStore
        .getState()
        .language
    ];
  }

  function getName(
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

  useEffect(() => {
    void loadMenus();
  }, []);

  async function loadMenus() {
    setLoading(
      true
    );

    try {
      const res =
        await adminFetch(
          "/api/menus"
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        toast.error(
          currentMessages()
            .loadError
        );

        return;
      }

      setMenus(
        json.data
      );
    } catch (
      error
    ) {
      console.error(
        "Error loading menus:",
        error
      );

      toast.error(
        currentMessages()
          .loadError
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  async function deleteMenu(
    menu: Menu
  ) {
    const activeMessages =
      currentMessages();

    if (
      !window.confirm(
        `${activeMessages.deleteConfirmPrefix} "${getName(
          menu.name
        )}"?`
      )
    ) {
      return;
    }

    try {
      const res =
        await adminFetch(
          `/api/menus/${menu.id}`,
          {
            method:
              "DELETE",
          }
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        toast.error(
          activeMessages
            .deleteError
        );

        return;
      }

      toast.success(
        activeMessages
          .deleteSuccess
      );

      await loadMenus();
    } catch (
      error
    ) {
      console.error(
        "Error deleting menu:",
        error
      );

      toast.error(
        activeMessages
          .deleteUnexpectedError
      );
    }
  }

  async function toggleMenu(
    menu: Menu
  ) {
    const activeMessages =
      currentMessages();

    try {
      const res =
        await adminFetch(
          `/api/menus/${menu.id}`,
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
                  !menu.active,
              }),
          }
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        toast.error(
          activeMessages
            .updateError
        );

        return;
      }

      toast.success(
        activeMessages
          .updateSuccess
      );

      await loadMenus();
    } catch (
      error
    ) {
      console.error(
        "Error updating menu:",
        error
      );

      toast.error(
        activeMessages
          .updateUnexpectedError
      );
    }
  }

  const filtered =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return menus.filter(
        (
          menu
        ) => {
          const menuName =
            getName(
              menu.name
            )
              .toLowerCase();

          const typeLabel =
            getAdminMenuTypeLabel(
              menu.type,
              messages
            )
              .toLowerCase();

          return (
            menuName.includes(
              normalizedSearch
            ) ||
            typeLabel.includes(
              normalizedSearch
            )
          );
        }
      );
    }, [
      menus,
      search,
      language,
    ]);

  const total =
    filtered.length;

  const active =
    filtered.filter(
      (
        menu
      ) =>
        menu.active
    ).length;

  const inactive =
    total -
    active;

  const scheduled =
    filtered.filter(
      (
        menu
      ) =>
        menu.hasSchedule
    ).length;

  return (
    <div className="space-y-6">
      <StatsCards
        total={
          total
        }
        active={
          active
        }
        inactive={
          inactive
        }
        scheduled={
          scheduled
        }
      />

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search
              size={
                18
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
              className="w-full rounded-xl border py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                setGrid(
                  true
                )
              }
              title="Grid"
              className={`rounded-xl border p-3 transition ${
                grid
                  ? "bg-indigo-600 text-white"
                  : "bg-white"
              }`}
            >
              <LayoutGrid
                size={
                  18
                }
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setGrid(
                  false
                )
              }
              title="List"
              className={`rounded-xl border p-3 transition ${
                !grid
                  ? "bg-indigo-600 text-white"
                  : "bg-white"
              }`}
            >
              <List
                size={
                  18
                }
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setNewOpen(
                  true
                )
              }
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 text-white hover:bg-indigo-700"
            >
              <Plus
                size={
                  18
                }
              />

              {
                messages.newMenu
              }
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-gray-500 shadow-sm">
          {
            messages.loadingMenus
          }
        </div>
      ) : filtered.length ===
        0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-gray-500 shadow-sm">
          {
            messages.noMenus
          }
        </div>
      ) : grid ? (
        <MenusGrid
          menus={
            filtered
          }
          onEdit={(
            menu
          ) =>
            setEditing(
              menu
            )
          }
          onDelete={(
            menu
          ) =>
            void deleteMenu(
              menu
            )
          }
          onToggle={(
            menu
          ) =>
            void toggleMenu(
              menu
            )
          }
          onSchedule={(
            menu
          ) =>
            setScheduling(
              menu
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-4">
                    {
                      messages.name
                    }
                  </th>

                  <th className="p-4">
                    {
                      messages.type
                    }
                  </th>

                  <th className="p-4">
                    {
                      messages.order
                    }
                  </th>

                  <th className="p-4">
                    {
                      messages.status
                    }
                  </th>

                  <th className="p-4">
                    {
                      messages.schedule
                    }
                  </th>

                  <th className="p-4 text-right">
                    {
                      messages.actions
                    }
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (
                    menu
                  ) => (
                    <tr
                      key={
                        menu.id
                      }
                      className="border-t"
                    >
                      <td className="p-4 font-medium">
                        {getName(
                          menu.name
                        )}
                      </td>

                      <td className="p-4">
                        {getAdminMenuTypeLabel(
                          menu.type,
                          messages
                        )}
                      </td>

                      <td className="p-4">
                        {
                          menu.displayOrder
                        }
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() =>
                            void toggleMenu(
                              menu
                            )
                          }
                          className={`rounded-full px-3 py-1 text-xs ${
                            menu.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {menu.active
                            ? messages.active
                            : messages.inactive}
                        </button>
                      </td>

                      <td className="p-4">
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
                      </td>

                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setScheduling(
                                menu
                              )
                            }
                            className="rounded-lg border px-3 py-2 hover:bg-gray-100"
                          >
                            {
                              messages.schedules
                            }
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setEditing(
                                menu
                              )
                            }
                            className="rounded-lg border px-3 py-2 hover:bg-gray-100"
                          >
                            {
                              messages.edit
                            }
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void deleteMenu(
                                menu
                              )
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                          >
                            {
                              messages.delete
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <NewMenuModal
        open={
          newOpen
        }
        onClose={() =>
          setNewOpen(
            false
          )
        }
        onCreated={
          loadMenus
        }
      />

      <EditMenuModal
        open={
          editing !==
          null
        }
        menu={
          editing
        }
        onClose={() =>
          setEditing(
            null
          )
        }
        onUpdated={
          loadMenus
        }
      />

      <MenuScheduleModal
        open={
          scheduling !==
          null
        }
        menu={
          scheduling
        }
        onClose={() => {
          setScheduling(
            null
          );

          void loadMenus();
        }}
      />
    </div>
  );
}