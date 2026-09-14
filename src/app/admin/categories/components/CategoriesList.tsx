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
  ADMIN_CATEGORIES_MESSAGES,
  getAdminCategoryText,
} from "@/config/admin-categories-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

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
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_CATEGORIES_MESSAGES[
      language
    ];

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

  function currentMessages() {
    return ADMIN_CATEGORIES_MESSAGES[
      useAdminLanguageStore
        .getState()
        .language
    ];
  }

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
          currentMessages()
            .loadError
        );

        return;
      }

      setCategories(
        json.data
      );
    } catch (
      error
    ) {
      console.error(
        "Error loading categories:",
        error
      );

      toast.error(
        currentMessages()
          .loadError
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(
    category: Category
  ) {
    const activeMessages =
      currentMessages();

    const currentLanguage =
      useAdminLanguageStore
        .getState()
        .language;

    const categoryName =
      getAdminCategoryText(
        category.name,
        currentLanguage,
        activeMessages
          .unnamedCategory
      );

    if (
      !window.confirm(
        `${activeMessages.deleteConfirmPrefix} "${categoryName}"?`
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
            activeMessages
              .deleteError
        );

        return;
      }

      toast.success(
        activeMessages
          .deleteSuccess
      );

      await loadCategories();
    } catch (
      error
    ) {
      console.error(
        "Error deleting category:",
        error
      );

      toast.error(
        activeMessages
          .deleteError
      );
    }
  }

  async function toggleCategory(
    category: Category
  ) {
    const activeMessages =
      currentMessages();

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
            activeMessages
              .updateError
        );

        return;
      }

      toast.success(
        activeMessages
          .updateSuccess
      );

      await loadCategories();
    } catch (
      error
    ) {
      console.error(
        "Error updating category:",
        error
      );

      toast.error(
        activeMessages
          .updateError
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
          {
            messages.loading
          }
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
            setNewOpen(
              true
            )
          }
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700"
        >
          <Plus
            size={
              18
            }
          />

          {
            messages.newCategory
          }
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