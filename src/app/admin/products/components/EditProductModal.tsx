"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  toast,
} from "sonner";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

interface Category {
  id:
    number;

  name:
    string;
}

interface Product {
  id:
    number;

  name:
    string;

  description:
    string;

  categoryId:
    number;

  price:
    number;

  available:
    boolean;

  featured:
    boolean;

  dailySpecial:
    boolean;
}

interface Props {
  open:
    boolean;

  product:
    Product | null;

  onClose:
    () => void;

  onUpdated:
    () => void;
}

export default function EditProductModal({
  open,
  product,
  onClose,
  onUpdated,
}: Props) {
  const [
    categories,
    setCategories,
  ] =
    useState<
      Category[]
    >([]);

  const [
    name,
    setName,
  ] =
    useState(
      ""
    );

  const [
    description,
    setDescription,
  ] =
    useState(
      ""
    );

  const [
    categoryId,
    setCategoryId,
  ] =
    useState(
      ""
    );

  const [
    price,
    setPrice,
  ] =
    useState(
      ""
    );

  const [
    available,
    setAvailable,
  ] =
    useState(
      true
    );

  const [
    featured,
    setFeatured,
  ] =
    useState(
      false
    );

  const [
    dailySpecial,
    setDailySpecial,
  ] =
    useState(
      false
    );

  const [
    saving,
    setSaving,
  ] =
    useState(
      false
    );

  useEffect(() => {
    if (
      !open ||
      !product
    ) {
      return;
    }

    setName(
      product.name
    );

    setDescription(
      product.description
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
          json.error ||
            json.message ||
            "No se pudieron cargar las categorías."
        );

        return;
      }

      setCategories(
        json.data.map(
          (
            category:
              any
          ) => ({
            id:
              category.id,

            name:
              typeof category.name ===
              "string"
                ? category.name
                : category.name?.es ??
                  category.name?.en ??
                  Object.values(
                    category.name ??
                      {}
                  )[0] ??
                  "",
          })
        )
      );
    } catch (
      error
    ) {
      console.error(
        "Error loading categories:",
        error
      );

      toast.error(
        "No se pudieron cargar las categorías."
      );
    }
  }

  async function updateProduct() {
    if (
      !product
    ) {
      return;
    }

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
        "Introduce un nombre."
      );

      return;
    }

    if (
      !categoryId
    ) {
      toast.error(
        "Selecciona una categoría."
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
        "Introduce un precio válido."
      );

      return;
    }

    setSaving(
      true
    );

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
                categoryId:
                  Number(
                    categoryId
                  ),

                name: {
                  es:
                    normalizedName,
                },

                description:
                  normalizedDescription
                    ? {
                        es:
                          normalizedDescription,
                      }
                    : {},

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
            "No se pudo actualizar el producto."
        );

        return;
      }

      toast.success(
        "Producto actualizado correctamente."
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
        "Se produjo un error al actualizar el producto."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  if (
    !open ||
    !product
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            Editar producto
          </h2>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Nombre
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
              Categoría
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
                    {
                      category.name
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Precio (€)
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
              Descripción
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

              Disponible
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

              Destacado
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

              Especial del día
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
            Cancelar
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
              ? "Guardando..."
              : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  );
}