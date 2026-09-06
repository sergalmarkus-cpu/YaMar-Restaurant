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
import ProductsGrid from "./ProductsGrid";
import NewProductModal from "./NewProductModal";
import EditProductModal from "./EditProductModal";

import type {
  Product,
} from "@/types/product";

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

  price:
    string;

  image:
    string | null;

  available:
    boolean;

  featured:
    boolean;

  dailySpecial:
    boolean;

  active:
    boolean;
}

function getLocalizedText(
  value:
    | string
    | Record<
        string,
        string
      >
    | null
    | undefined
) {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (!value) {
    return "";
  }

  return (
    value.es ||
    value.en ||
    Object.values(
      value
    )[0] ||
    ""
  );
}

export default function ProductsList() {
  const [
    products,
    setProducts,
  ] =
    useState<
      Product[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    newModalOpen,
    setNewModalOpen,
  ] =
    useState(
      false
    );

  const [
    editingProduct,
    setEditingProduct,
  ] =
    useState<
      Product | null
    >(null);

  useEffect(() => {
    void fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(
      true
    );

    try {
      /*
       * Categories y Products están protegidos.
       *
       * adminFetch gestiona automáticamente:
       * - Authorization
       * - access token caducado
       * - refresh token
       * - repetición de la petición
       */
      const [
        categoriesRes,
        productsRes,
      ] =
        await Promise.all([
          adminFetch(
            "/api/categories"
          ),

          adminFetch(
            "/api/products"
          ),
        ]);

      const [
        categoriesJson,
        productsJson,
      ] =
        await Promise.all([
          categoriesRes.json(),
          productsRes.json(),
        ]);

      if (
        !categoriesRes.ok ||
        !categoriesJson.success
      ) {
        toast.error(
          categoriesJson.error ||
            categoriesJson.message ||
            "No se pudieron cargar las categorías."
        );

        return;
      }

      if (
        !productsRes.ok ||
        !productsJson.success
      ) {
        toast.error(
          productsJson.error ||
            productsJson.message ||
            "No se pudieron cargar los productos."
        );

        return;
      }

      const categories:
        ApiCategory[] =
          categoriesJson.data;

      const apiProducts:
        ApiProduct[] =
          productsJson.data;

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

              return {
                id:
                  product.id,

                name:
                  getLocalizedText(
                    product.name
                  ),

                description:
                  getLocalizedText(
                    product.description
                  ),

                categoryId:
                  product.categoryId,

                category:
                  category
                    ? getLocalizedText(
                        category.name
                      )
                    : "Sin categoría",

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
        "Error cargando productos."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  async function deleteProduct(
    product:
      Product
  ) {
    if (
      !window.confirm(
        `¿Eliminar "${product.name}"?`
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
            "No se pudo eliminar el producto."
        );

        return;
      }

      toast.success(
        "Producto eliminado."
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
        "No se pudo eliminar el producto."
      );
    }
  }

  async function toggleProduct(
    product:
      Product
  ) {
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
            "No se pudo actualizar el producto."
        );

        return;
      }

      toast.success(
        product.available
          ? "Producto marcado como no disponible."
          : "Producto marcado como disponible."
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
        "No se pudo actualizar el producto."
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
              Productos
            </h1>

            <p className="mt-1 text-gray-500">
              Gestiona todos los productos del restaurante.
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

            Nuevo producto
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