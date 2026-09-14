"use client";

import {
  Edit2,
  FolderTree,
  Trash2,
} from "lucide-react";

import {
  ADMIN_CATEGORIES_MESSAGES,
  getAdminCategoryText,
} from "@/config/admin-categories-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

interface Category {
  id: number;
  menuId: number;
  name:
    Record<string, string>;
  description:
    Record<string, string> | null;
  displayOrder: number;
  active: boolean;
}

interface Props {
  categories:
    Category[];
  onEdit:
    (category: Category) =>
      void;
  onDelete:
    (category: Category) =>
      void;
  onToggle:
    (category: Category) =>
      void;
}

export default function CategoriesGrid({
  categories,
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
    ADMIN_CATEGORIES_MESSAGES[
      language
    ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {categories.map(
        (
          category
        ) => {
          const name =
            getAdminCategoryText(
              category.name,
              language,
              messages
                .unnamedCategory
            );

          const description =
            getAdminCategoryText(
              category.description,
              language,
              messages
                .noDescription
            );

          return (
            <div
              key={
                category.id
              }
              className="rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                      <FolderTree
                        size={
                          24
                        }
                        className="text-indigo-600"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold">
                        {
                          name
                        }
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {
                          messages.order
                        }
                        :{" "}
                        {
                          category.displayOrder
                        }
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onToggle(
                        category
                      )
                    }
                    title={
                      category.active
                        ? messages.deactivate
                        : messages.activate
                    }
                    aria-label={
                      category.active
                        ? messages.deactivate
                        : messages.activate
                    }
                    className={`h-3 w-3 rounded-full ${
                      category.active
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                </div>

                <p className="mt-5 line-clamp-3 text-sm text-gray-600">
                  {
                    description
                  }
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t bg-gray-50 p-4">
                <button
                  type="button"
                  onClick={() =>
                    onEdit(
                      category
                    )
                  }
                  title={
                    messages.edit
                  }
                  aria-label={
                    messages.edit
                  }
                  className="rounded-xl p-2 transition hover:bg-indigo-100"
                >
                  <Edit2
                    size={
                      18
                    }
                    className="text-indigo-600"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete(
                      category
                    )
                  }
                  title={
                    messages.delete
                  }
                  aria-label={
                    messages.delete
                  }
                  className="rounded-xl p-2 transition hover:bg-red-100"
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
          );
        }
      )}
    </div>
  );
}