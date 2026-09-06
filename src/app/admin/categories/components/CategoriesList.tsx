"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import StatsCards from "./StatsCards";
import CategoriesGrid from "./CategoriesGrid";
import NewCategoryModal from "./NewCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

interface Category {
  id: number;
  menuId: number;
  name: Record<string, string>;
  description:
    Record<string, string> | null;
  displayOrder: number;
  active: boolean;
}

export default function CategoriesList() {
  const [
    categories,
    setCategories,
  ] =
    useState<Category[]>([]);

  const [
    loading,
    setLoading,
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
    useState<Category | null>(
      null
    );

  useEffect(() => {
    void loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);

    try {
      const res =
        await adminFetch(
          "/api/categories"
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        toast.error(
          json.error ||
            "No se pudieron cargar las categorías."
        );

        return;
      }

      setCategories(
        json.data
      );
    } catch (error) {
      console.error(
        "Error loading categories:",
        error
      );

      toast.error(
        "No se pudieron cargar las categorías."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  async function deleteCategory(
    category: Category
  ) {
    const categoryName =
      category.name.es ||
      Object.values(
        category.name
      )[0] ||
      `#${category.id}`;

    if (
      !window.confirm(
        `¿Eliminar "${categoryName}"?`
      )
    ) {
      return;
    }

    try {
      const res =
        await adminFetch(
          `/api/categories/${category.id}`,
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
            "No se pudo eliminar la categoría."
        );

        return;
      }

      toast.success(
        "Categoría eliminada."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Error deleting category:",
        error
      );

      toast.error(
        "No se pudo eliminar la categoría."
      );
    }
  }

  async function toggleCategory(
    category: Category
  ) {
    try {
      const res =
        await adminFetch(
          `/api/categories/${category.id}`,
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
                  !category.active,
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
            "No se pudo actualizar la categoría."
        );

        return;
      }

      toast.success(
        "Estado actualizado."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Error updating category:",
        error
      );

      toast.error(
        "No se pudo actualizar."
      );
    }
  }

  const stats =
    useMemo(() => {
      const total =
        categories.length;

      const active =
        categories.filter(
          (
            category
          ) =>
            category.active
        ).length;

      const inactive =
        total - active;

      const menus =
        new Set(
          categories.map(
            (
              category
            ) =>
              category.menuId
          )
        ).size;

      return {
        total,
        active,
        inactive,
        menus,
      };
    }, [
      categories,
    ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">
          Cargando categorías...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Categorías
          </h1>

          <p className="text-gray-500 mt-1">
            Gestiona las categorías de los menús.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setNewOpen(
              true
            )
          }
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition"
        >
          <Plus
            size={
              18
            }
          />

          Nueva categoría
        </button>
      </div>

      <StatsCards
        total={
          stats.total
        }
        active={
          stats.active
        }
        inactive={
          stats.inactive
        }
        menus={
          stats.menus
        }
      />

      <CategoriesGrid
        categories={
          categories
        }
        onEdit={(
          category
        ) =>
          setEditing(
            category
          )
        }
        onDelete={
          deleteCategory
        }
        onToggle={
          toggleCategory
        }
      />

      <NewCategoryModal
        open={
          newOpen
        }
        onClose={() =>
          setNewOpen(
            false
          )
        }
        onCreated={
          loadCategories
        }
      />

      <EditCategoryModal
        open={
          editing !==
          null
        }
        category={
          editing
        }
        onClose={() =>
          setEditing(
            null
          )
        }
        onUpdated={
          loadCategories
        }
      />
    </div>
  );
}