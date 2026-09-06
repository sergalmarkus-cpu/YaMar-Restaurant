"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import StatsCards from "./StatsCards";
import MenusGrid from "./MenusGrid";
import NewMenuModal from "./NewMenuModal";
import EditMenuModal from "./EditMenuModal";
import MenuScheduleModal from "./MenuScheduleModal";

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
          json.error ||
            json.message ||
            "No se pudieron cargar los menús."
        );

        return;
      }

      setMenus(
        json.data
      );
    } catch (error) {
      console.error(
        "Error loading menus:",
        error
      );

      toast.error(
        "No se pudieron cargar los menús."
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
    if (
      !window.confirm(
        `¿Eliminar "${getName(
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
          json.error ||
            json.message ||
            "No se pudo eliminar el menú."
        );

        return;
      }

      toast.success(
        "Menú eliminado."
      );

      await loadMenus();
    } catch (error) {
      console.error(
        "Error deleting menu:",
        error
      );

      toast.error(
        "Error al eliminar el menú."
      );
    }
  }

  async function toggleMenu(
    menu: Menu
  ) {
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
          json.error ||
            json.message ||
            "No se pudo actualizar el menú."
        );

        return;
      }

      toast.success(
        "Estado actualizado."
      );

      await loadMenus();
    } catch (error) {
      console.error(
        "Error updating menu:",
        error
      );

      toast.error(
        "No se pudo actualizar."
      );
    }
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
      name?.es ||
      name?.en ||
      "Sin nombre"
    );
  }

  const filtered =
    useMemo(() => {
      return menus.filter(
        (
          menu
        ) =>
          getName(
            menu.name
          )
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      menus,
      search,
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
    total - active;

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

      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
              placeholder="Buscar menú..."
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className={`p-3 rounded-xl border transition ${
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
              className={`p-3 rounded-xl border transition ${
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
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5"
            >
              <Plus
                size={
                  18
                }
              />

              Nuevo menú
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border shadow-sm p-10 text-center text-gray-500">
          Cargando menús...
        </div>
      ) : filtered.length ===
        0 ? (
        <div className="bg-white rounded-2xl border shadow-sm p-10 text-center text-gray-500">
          No hay menús registrados.
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
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-4">
                    Nombre
                  </th>

                  <th className="p-4">
                    Tipo
                  </th>

                  <th className="p-4">
                    Orden
                  </th>

                  <th className="p-4">
                    Estado
                  </th>

                  <th className="p-4">
                    Horario
                  </th>

                  <th className="p-4 text-right">
                    Acciones
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
                        {
                          menu.type
                        }
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
                          className={`px-3 py-1 rounded-full text-xs ${
                            menu.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {menu.active
                            ? "Activo"
                            : "Inactivo"}
                        </button>
                      </td>

                      <td className="p-4">
                        {menu.hasSchedule ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                            Programado
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            Sin horario
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
                            className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                          >
                            Horarios
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setEditing(
                                menu
                              )
                            }
                            className="px-3 py-2 border rounded-lg hover:bg-gray-100"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void deleteMenu(
                                menu
                              )
                            }
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                          >
                            Eliminar
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