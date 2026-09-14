"use client";

import {
  ChefHat,
  Edit2,
  Image as ImageIcon,
  ShoppingBag,
  Star,
  Trash2,
} from "lucide-react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_PRODUCTS_MESSAGES,
} from "@/config/admin-products-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import type {
  Product,
} from "@/types/product";

interface Props {
  products:
    Product[];

  currency:
    string;

  onEdit:
    (
      product:
        Product
    ) => void;

  onDelete:
    (
      product:
        Product
    ) => void;

  onToggle:
    (
      product:
        Product
    ) => void;
}

export default function ProductsGrid({
  products,
  currency,
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
    ADMIN_PRODUCTS_MESSAGES[
      language
    ];

  function formatPrice(
    value:
      number
  ) {
    if (!currency) {
      return Number(
        value
      ).toFixed(
        2
      );
    }

    try {
      return new Intl.NumberFormat(
        ADMIN_LANGUAGE_LOCALES[
          language
        ],
        {
          style:
            "currency",
          currency,
        }
      ).format(
        Number(
          value
        )
      );
    } catch {
      return `${Number(
        value
      ).toFixed(
        2
      )} ${currency}`;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map(
        (
          product
        ) => (
          <div
            key={
              product.id
            }
            className="rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
          >
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-t-2xl bg-gray-100">
              {product.image ? (
                <img
                  src={
                    product.image
                  }
                  alt={
                    product.name
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon
                  size={
                    42
                  }
                  className="text-gray-400"
                />
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">
                    {
                      product.name
                    }
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {
                      product.category
                    }
                  </p>
                </div>

                <button
                  type="button"
                  title={
                    product.available
                      ? messages.available
                      : messages.unavailable
                  }
                  aria-label={
                    product.available
                      ? messages.available
                      : messages.unavailable
                  }
                  onClick={() =>
                    onToggle(
                      product
                    )
                  }
                  className={`h-3 w-3 rounded-full ${
                    product.available
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              </div>

              {product.description && (
                <p className="mt-4 line-clamp-3 text-sm text-gray-600">
                  {
                    product.description
                  }
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {product.featured && (
                  <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                    <Star
                      size={
                        12
                      }
                    />

                    {
                      messages.featured
                    }
                  </span>
                )}

                {product.dailySpecial && (
                  <span className="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700">
                    <ChefHat
                      size={
                        12
                      }
                    />

                    {
                      messages.dailySpecial
                    }
                  </span>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-bold text-indigo-600">
                  {
                    formatPrice(
                      product.price
                    )
                  }
                </span>

                <ShoppingBag
                  size={
                    18
                  }
                  className="text-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-2 border-t bg-gray-50 p-4">
              <button
                type="button"
                onClick={() =>
                  onEdit(
                    product
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border bg-white py-2 transition hover:bg-gray-100"
              >
                <Edit2
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
                    product
                  )
                }
                title={
                  messages.deleteProduct
                }
                aria-label={
                  messages.deleteProduct
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
        )
      )}
    </div>
  );
}