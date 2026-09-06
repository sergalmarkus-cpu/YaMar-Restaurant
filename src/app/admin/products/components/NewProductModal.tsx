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
  id: number;
  name: string;
}

interface Props {
  open:
    boolean;

  onClose:
    () => void;

  onCreated:
    () => void;
}

export default function NewProductModal({
  open,
  onClose,
  onCreated,
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
    description,
    setDescription,
  ] =
    useState(
      ""
    );

  const [
    saving,
    setSaving,
  ] =
    useState(
      false
    );

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

  async function saveProduct() {
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

    if (
      !normalizedPrice
    ) {
      toast.error(
        "Introduce un precio."
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
      /*
       * IMPORTANTE:
       *
       * No enviamos establishmentId.
       *
       * El backend lo obtiene exclusivamente
       * del JWT del usuario autenticado.
       */
      const payload = {
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
            "No se pudo crear el producto."
        );

        return;
      }

      setName(
        ""
      );

      setDescription(
        ""
      );

      setPrice(
        ""
      );

      setCategoryId(
        ""
      );

      toast.success(
        "Producto creado correctamente."
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
        "Se produjo un error al crear el producto."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  if (
    !open
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            Nuevo producto
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
              <option value="">
                Seleccionar...
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
            Cancelar
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
              ? "Guardando..."
              : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}