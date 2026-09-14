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

  currency:
    string;

  onClose:
    () => void;

  onCreated:
    () => void;
}

export default function NewProductModal({
  open,
  currency,
  onClose,
  onCreated,
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
    description,
    setDescription,
  ] =
    useState("");

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
    if (!open) {
      return;
    }

    void loadCategories();
  }, [
    open,
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

  async function saveProduct() {
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

    setSaving(true);

    try {
      const payload = {
        categoryId:
          Number(
            categoryId
          ),

        name: {
          [currentLanguage]:
            normalizedName,
        },

        description:
          normalizedDescription
            ? {
                [currentLanguage]:
                  normalizedDescription,
              }
            : {},

        price:
          numericPrice.toFixed(
            2
          ),

        image:
          null,

        allergens:
          [],

        dietary:
          [],

        available:
          true,

        stock:
          0,

        preparationTime:
          10,

        displayOrder:
          0,

        featured:
          false,

        dailySpecial:
          false,

        active:
          true,
      };

      const res =
        await adminFetch(
          "/api/products",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      const json =
        await res.json();

      if (
        !res.ok ||
        !json.success
      ) {
        console.error(
          "Error creating product:",
          json
        );

        toast.error(
          json.error ||
            json.message ||
            activeMessages
              .createError
        );

        return;
      }

      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");

      toast.success(
        activeMessages
          .createSuccess
      );

      await onCreated();

      onClose();
    } catch (
      error
    ) {
      console.error(
        "Error creating product:",
        error
      );

      toast.error(
        activeMessages
          .createUnexpectedError
      );
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
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
              messages.createTitle
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
              <option value="">
                {
                  messages.selectCategory
                }
              </option>

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
              rows={
                4
              }
              className="w-full rounded-xl border p-3"
              disabled={
                saving
              }
            />
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
            onClick={() =>
              void saveProduct()
            }
            disabled={
              saving
            }
            className="rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving
              ? messages.saving
              : messages.save}
          </button>
        </div>
      </div>
    </div>
  );
}