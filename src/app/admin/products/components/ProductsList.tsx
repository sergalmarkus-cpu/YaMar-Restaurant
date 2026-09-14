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
  ADMIN_PRODUCTS_MESSAGES,
  getAdminProductText,
  toAdminProductTranslations,
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

import StatsCards from "./StatsCards";
import ProductsGrid from "./ProductsGrid";
import NewProductModal from "./NewProductModal";
import EditProductModal from "./EditProductModal";

interface ApiCategory {
  id: number;

  name:
    | string
    | Record<
        string,
        string
      >;
}

interface ApiProduct {
  id: number;
  establishmentId: number;
  categoryId: number;

  name:
    | string
    | Record<
        string,
        string
      >;

  description:
    | string
    | Record<
        string,
        string
      >
    | null;

  price: string;

  image:
    string | null;

  available: boolean;

  featured: boolean;

  dailySpecial: boolean;

  active: boolean;
}

interface ApiEstablishment {
  id: number;
  currency?: string | null;
}

export default function ProductsList() {
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
    products,
    setProducts,
  ] =
    useState<Product[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    currency,
    setCurrency,
  ] =
    useState("");

  const [
    newModalOpen,
    setNewModalOpen,
  ] =
    useState(false);

  const [
    editingProduct,
    setEditingProduct,
  ] =
    useState<Product | null>(
      null
    );

  function currentMessages() {
    return ADMIN_PRODUCTS_MESSAGES[
      useAdminLanguageStore
        .getState()
        .language
    ];
  }

  useEffect(() => {
    void fetchProducts();
  }, [
    language,
  ]);

  async function fetchProducts() {
    setLoading(true);

    try {
      const [
        categoriesRes,
        productsRes,
        establishmentsRes,
      ] =
        await Promise.all([
          adminFetch(
            "/api/categories"
          ),

          adminFetch(
            "/api/products"
          ),

          adminFetch(
            "/api/establishments"
          ),
        ]);

      const [
        categoriesJson,
        productsJson,
        establishmentsJson,
      ] =
        await Promise.all([
          categoriesRes.json(),
          productsRes.json(),
          establishmentsRes.json(),
        ]);

      if (
        !categoriesRes.ok ||
        !categoriesJson.success
      ) {
        toast.error(
          currentMessages()
            .loadCategoriesError
        );

        return;
      }

      if (
        !productsRes.ok ||
        !productsJson.success
      ) {
        toast.error(
          currentMessages()
            .loadProductsError
        );

        return;
      }

      const categories:
        ApiCategory[] =
          categoriesJson.data;

      const apiProducts:
        ApiProduct[] =
          productsJson.data;

      if (
        establishmentsRes.ok &&
        establishmentsJson.success
      ) {
        const establishments:
          ApiEstablishment[] =
            Array.isArray(
              establishmentsJson.data
            )
              ? establishmentsJson.data
              : [];

        const current =
          establishments[0];

        setCurrency(
          current?.currency?.trim()
            .toUpperCase() ??
            ""
        );
      }

      const formatted:
        Product[] =
          apiProducts.map(
            (
              product
            ) => {
              const category =
                categories.find(
                  (
                    item
                  ) =>
                    item.id ===
                    product.categoryId
                );

              const nameTranslations =
                toAdminProductTranslations(
                  product.name,
                  language
                );

              const descriptionTranslations =
                toAdminProductTranslations(
                  product.description,
                  language
                );

              return {
                id:
                  product.id,

                name:
                  getAdminProductText(
                    product.name,
                    language,
                    messages
                      .unnamedProduct
                  ),

                description:
                  getAdminProductText(
                    product.description,
                    language,
                    ""
                  ),

                nameTranslations,

                descriptionTranslations,

                categoryId:
                  product.categoryId,

                category:
                  category
                    ? getAdminProductText(
                        category.name,
                        language,
                        messages
                          .unnamedCategory
                      )
                    : messages
                        .unnamedCategory,

                price:
                  Number(
                    product.price
                  ),

                image:
                  product.image,

                available:
                  product.available,

                featured:
                  product.featured,

                dailySpecial:
                  product.dailySpecial,

                active:
                  product.active,
              };
            }
          );

      setProducts(
        formatted
      );
    } catch (
      error
    ) {
      console.error(
        "Error loading products:",
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

  async function deleteProduct(
    product: Product
  ) {
    const activeMessages =
      currentMessages();

    if (
      !window.confirm(
        `${activeMessages.deleteConfirmPrefix} "${product.name}"?`
      )
    ) {
      return;
    }

    try {
      const res =
        await adminFetch(
          `/api/products/${product.id}`,
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
            activeMessages
              .deleteError
        );

        return;
      }

      toast.success(
        activeMessages
          .deleteSuccess
      );

      await fetchProducts();
    } catch (
      error
    ) {
      console.error(
        "Error deleting product:",
        error
      );

      toast.error(
        activeMessages
          .deleteError
      );
    }
  }

  async function toggleProduct(
    product: Product
  ) {
    const activeMessages =
      currentMessages();

    try {
      const res =
        await adminFetch(
          `/api/products/${product.id}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                available:
                  !product.available,
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
            activeMessages
              .updateError
        );

        return;
      }

      toast.success(
        product.available
          ? activeMessages
              .unavailableSuccess
          : activeMessages
              .availableSuccess
      );

      await fetchProducts();
    } catch (
      error
    ) {
      console.error(
        "Error updating product:",
        error
      );

      toast.error(
        activeMessages
          .updateError
      );
    }
  }

  const stats =
    useMemo(
      () => ({
        total:
          products.length,

        available:
          products.filter(
            (
              product
            ) =>
              product.available
          ).length,

        unavailable:
          products.filter(
            (
              product
            ) =>
              !product.available
          ).length,

        featured:
          products.filter(
            (
              product
            ) =>
              product.featured
          ).length,
      }),
      [
        products,
      ]
    );

  if (
    loading
  ) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
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
              setNewModalOpen(
                true
              )
            }
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700"
          >
            <Plus
              size={
                20
              }
            />

            {
              messages.newProduct
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
          unavailable={
            stats.unavailable
          }
          featured={
            stats.featured
          }
        />

        <ProductsGrid
          products={
            products
          }
          currency={
            currency
          }
          onEdit={
            setEditingProduct
          }
          onDelete={
            deleteProduct
          }
          onToggle={
            toggleProduct
          }
        />
      </div>

      <NewProductModal
        open={
          newModalOpen
        }
        currency={
          currency
        }
        onClose={() =>
          setNewModalOpen(
            false
          )
        }
        onCreated={
          fetchProducts
        }
      />

      <EditProductModal
        open={
          editingProduct !==
          null
        }
        product={
          editingProduct
        }
        currency={
          currency
        }
        onClose={() =>
          setEditingProduct(
            null
          )
        }
        onUpdated={
          fetchProducts
        }
      />
    </>
  );
}