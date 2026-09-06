'use client';

import {
  FolderTree,
  Edit2,
  Trash2,
} from 'lucide-react';

interface Category {
  id: number;
  menuId: number;
  name: Record<string, string>;
  description: Record<string, string> | null;
  displayOrder: number;
  active: boolean;
}

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggle: (category: Category) => void;
}

export default function CategoriesGrid({
  categories,
  onEdit,
  onDelete,
  onToggle,
}: Props) {

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">

      {categories.map((category) => (

        <div
          key={category.id}
          className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition"
        >

          <div className="p-6">

            <div className="flex justify-between items-start">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

                  <FolderTree
                    size={24}
                    className="text-indigo-600"
                  />

                </div>

                <div>

                  <h3 className="font-bold text-lg">

                    {category.name?.es ?? '-'}

                  </h3>

                  <p className="text-gray-500 text-sm mt-1">

                    Orden: {category.displayOrder}

                  </p>

                </div>

              </div>

              <button
                onClick={() => onToggle(category)}
                className={`w-3 h-3 rounded-full ${
                  category.active
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />

            </div>

            <p className="mt-5 text-sm text-gray-600 line-clamp-3">

              {category.description?.es || 'Sin descripción'}

            </p>

          </div>

          <div className="border-t bg-gray-50 p-4 flex justify-end gap-2">

            <button
              onClick={() => onEdit(category)}
              className="p-2 rounded-xl hover:bg-indigo-100 transition"
            >

              <Edit2
                size={18}
                className="text-indigo-600"
              />

            </button>

            <button
              onClick={() => onDelete(category)}
              className="p-2 rounded-xl hover:bg-red-100 transition"
            >

              <Trash2
                size={18}
                className="text-red-600"
              />

            </button>

          </div>

        </div>

      ))}

    </div>

  );

}