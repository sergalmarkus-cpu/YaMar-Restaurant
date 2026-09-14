"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  toast,
} from "sonner";

import {
  ADMIN_PRODUCTS_MESSAGES,
  getAdminProductText,
} from "@/config/admin-products-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import type {
  Product,
} from "@/types/product";

interface Category {
  id: number;

  name:
    | string
    | Record<
        string,
        string
      >;
}

interface Props {
  open: boolean;

  product:
    Product | null;

  currency:
    string;

  onClose:
    () => void;

  onUpdated:
    () => void;
}

export default function EditProductModal({
  open,
  product,
  currency,
  onClose,
  onUpdated,
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

  const [
    categories,
    setCategories,
  ] =
    useState<Category[]>([]);

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    description,
    setDescription,
  ] =
    useState("");

  const [
    categoryId,
    setCategoryId,
  ] =
    useState("");

  const [
    price,
    setPrice,
  ] =
    useState("");

  const [
    available,
    setAvailable,
  ] =
    useState(true);

  const [
    featured,
    setFeatured,
  ] =
    useState(false);

  const [
    dailySpecial,
    setDailySpecial,
  ] =
    useState(false);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  function currentMessages() {
    return ADMIN_PRODUCTS_MESSAGES[
      useAdminLanguageStore
        .getState()
        .language
    ];
  }

  useEffect(() => {
    if (
      !open ||
      !product
    ) {
      return;
    }

    setName(
      getAdminProductText(
        product.nameTranslations,
        language,
        product.name
      )
    );

    setDescription(
      getAdminProductText(
        product.descriptionTranslations,
        language,
        ""
      )
    );

    setCategoryId(
      product.categoryId.toString()
    );

    setPrice(
      product.price.toString()
    );

    setAvailable(
      product.available
    );

    setFeatured(
      product.featured
    );

    setDailySpecial(
      product.dailySpecial
    );

    void loadCategories();
  }, [
    open,
    product,
    language,
  ]);

  async function loadCategories() {
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
            .loadCategoriesError
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
          .loadCategoriesError
      );
    }
  }

  async function updateProduct() {
    const currentProduct =
      product;

    if (!currentProduct) {
      return;
    }

    const currentLanguage =
      useAdminLanguageStore
        .getState()
        .language;

    const activeMessages =
      ADMIN_PRODUCTS_MESSAGES[
        currentLanguage
      ];

    const normalizedName =
      name.trim();

    const normalizedDescription =
      description.trim();

    const normalizedPrice =
      price.trim();

    if (
      !normalizedName
    ) {
      toast.error(
        activeMessages
          .nameRequired
      );

      return;
    }

    if (
      !categoryId
    ) {
      toast.error(
        activeMessages
          .categoryRequired
      );

      return;
    }

    if (
      !normalizedPrice
    ) {
      toast.error(
        activeMessages
          .priceRequired
      );

      return;
    }

    const numericPrice =
      Number(
        normalizedPrice
      );

    if (
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice <=
        0
    ) {
      toast.error(
        activeMessages
          .priceInvalid
      );

      return;
    }

    const nextName = {
      ...currentProduct
        .nameTranslations,

      [currentLanguage]:
        normalizedName,
    };

    const nextDescription = {
      ...currentProduct
        .descriptionTranslations,
    };

    if (
      normalizedDescription
    ) {
      nextDescription[
        currentLanguage
      ] =
        normalizedDescription;
    }

    if (
      !normalizedDescription
    ) {
      delete nextDescription[
        currentLanguage
      ];
    }

    setSaving(true);

    try {
      const res =
        await adminFetch(
          `/api/products/${currentProduct.id}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                categoryId:
                  Number(
                    categoryId
                  ),

                name:
                  nextName,

                description:
                  nextDescription,

                price:
                  numericPrice.toFixed(
                    2
                  ),

                available,

                featured,

                dailySpecial,
              }),
          }
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        console.error(
          "Error updating product:",
          json
        );

        toast.error(
          json.error ||
            json.message ||
            activeMessages
              .editError
        );

        return;
      }

      toast.success(
        activeMessages
          .editSuccess
      );

      await onUpdated();

      onClose();
    } catch (
      error
    ) {
      console.error(
        "Error updating product:",
        error
      );

      toast.error(
        activeMessages
          .editUnexpectedError
      );
    } finally {
      setSaving(false);
    }
  }

  if (
    !open ||
    !product
  ) {
    return null;
  }

  const priceLabel =
    currency
      ? `${messages.price} (${currency})`
      : messages.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            {
              messages.editTitle
            }
          </h2>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              {
                messages.name
              }
            </label>

            <input
              value={
                name
              }
              onChange={(
                event
              ) =>
                setName(
                  event.target.value
                )
              }
              className="w-full rounded-xl border p-3"
              disabled={
                saving
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {
                messages.category
              }
            </label>

            <select
              value={
                categoryId
              }
              onChange={(
                event
              ) =>
                setCategoryId(
                  event.target.value
                )
              }
              className="w-full rounded-xl border p-3"
              disabled={
                saving
              }
            >
              {categories.map(
                (
                  category
                ) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      String(
                        category.id
                      )
                    }
                  >
                    {getAdminProductText(
                      category.name,
                      language,
                      messages
                        .unnamedCategory
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {
                priceLabel
              }
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={
                price
              }
              onChange={(
                event
              ) =>
                setPrice(
                  event.target.value
                )
              }
              className="w-full rounded-xl border p-3"
              disabled={
                saving
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {
                messages.description
              }
            </label>

            <textarea
              rows={
                4
              }
              value={
                description
              }
              onChange={(
                event
              ) =>
                setDescription(
                  event.target.value
                )
              }
              className="w-full rounded-xl border p-3"
              disabled={
                saving
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  available
                }
                onChange={(
                  event
                ) =>
                  setAvailable(
                    event.target.checked
                  )
                }
                disabled={
                  saving
                }
              />

              {
                messages.activeAvailable
              }
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  featured
                }
                onChange={(
                  event
                ) =>
                  setFeatured(
                    event.target.checked
                  )
                }
                disabled={
                  saving
                }
              />

              {
                messages.activeFeatured
              }
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  dailySpecial
                }
                onChange={(
                  event
                ) =>
                  setDailySpecial(
                    event.target.checked
                  )
                }
                disabled={
                  saving
                }
              />

              {
                messages.activeDailySpecial
              }
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t p-6">
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="rounded-xl border px-5 py-3 disabled:opacity-50"
          >
            {
              messages.cancel
            }
          </button>

          <button
            type="button"
            disabled={
              saving
            }
            onClick={() =>
              void updateProduct()
            }
            className="rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving
              ? messages.saving
              : messages.update}
          </button>
        </div>
      </div>
    </div>
  );
}