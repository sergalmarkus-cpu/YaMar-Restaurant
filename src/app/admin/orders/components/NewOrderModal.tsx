"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_ORDERS_MESSAGES,
} from "@/config/admin-orders-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

interface Table {
  id: number;
  number: string;
}

interface Product {
  id: number;

  name:
    | string
    | Partial<
        Record<
          "es" |
          "en" |
          "de" |
          "fr" |
          "it" |
          "pt",
          string
        >
      >;

  price: number;
}

interface ApiEstablishment {
  id: number;
  currency?: string | null;
}

export default function NewOrderModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_ORDERS_MESSAGES[
      language
    ];

  const locale =
    ADMIN_LANGUAGE_LOCALES[
      language
    ];

  const [
    tables,
    setTables,
  ] =
    useState<Table[]>([]);

  const [
    products,
    setProducts,
  ] =
    useState<Product[]>([]);

  const [
    currency,
    setCurrency,
  ] =
    useState("");

  const [
    tableId,
    setTableId,
  ] =
    useState("");

  const [
    productId,
    setProductId,
  ] =
    useState("");

  const [
    quantity,
    setQuantity,
  ] =
    useState(1);

  const [
    notes,
    setNotes,
  ] =
    useState("");

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    async function loadData() {
      try {
        const [
          tablesRes,
          productsRes,
          establishmentsRes,
        ] =
          await Promise.all([
            adminFetch(
              "/api/tables"
            ),
            adminFetch(
              "/api/products"
            ),
            adminFetch(
              "/api/establishments"
            ),
          ]);

        const [
          tablesJson,
          productsJson,
          establishmentsJson,
        ] =
          await Promise.all([
            tablesRes.json(),
            productsRes.json(),
            establishmentsRes.json(),
          ]);

        if (
          tablesRes.ok &&
          tablesJson.success
        ) {
          setTables(
            Array.isArray(
              tablesJson.data
            )
              ? tablesJson.data
              : []
          );
        }

        if (
          productsRes.ok &&
          productsJson.success
        ) {
          setProducts(
            Array.isArray(
              productsJson.data
            )
              ? productsJson.data
              : []
          );
        }

        if (
          establishmentsRes.ok &&
          establishmentsJson.success &&
          Array.isArray(
            establishmentsJson.data
          )
        ) {
          const establishments:
            ApiEstablishment[] =
              establishmentsJson.data;

          const current =
            establishments[0];

          setCurrency(
            current?.currency
              ?.trim()
              .toUpperCase() ??
              ""
          );
        }
      } catch (error) {
        console.error(
          error
        );
      }
    }

    void loadData();
  }, [open]);

  if (!open) {
    return null;
  }

  const selectedProduct =
    products.find(
      (product) =>
        product.id ===
        Number(
          productId
        )
    );

  const unitPrice =
    selectedProduct
      ? Number(
          selectedProduct.price
        )
      : 0;

  const subtotal =
    unitPrice *
    quantity;

  function productName(
    product: Product
  ) {
    if (
      typeof product.name ===
      "string"
    ) {
      return product.name;
    }

    return (
      product.name[
        language
      ] ??
      product.name.es ??
      product.name.en ??
      product.name.de ??
      product.name.fr ??
      product.name.it ??
      product.name.pt ??
      ""
    );
  }

  function formatMoney(
    value: number
  ) {
    if (
      !Number.isFinite(
        value
      )
    ) {
      return "—";
    }

    if (!currency) {
      return value.toFixed(
        2
      );
    }

    try {
      return new Intl.NumberFormat(
        locale,
        {
          style:
            "currency",
          currency,
        }
      ).format(
        value
      );
    } catch {
      return `${value.toFixed(
        2
      )} ${currency}`;
    }
  }

  async function createOrder() {
    setSaving(
      true
    );

    try {
      const response =
        await adminFetch(
          "/api/orders",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                tableId:
                  Number(
                    tableId
                  ),

                notes,

                items: [
                  {
                    productId:
                      Number(
                        productId
                      ),

                    quantity,
                  },
                ],
              }),
          }
        );

      const json =
        await response.json();

      if (
        response.ok &&
        json.success
      ) {
        onCreated();
      } else {
        alert(
          json.error ??
            json.message ??
            messages.create
              .createError
        );
      }
    } catch (error) {
      console.error(
        error
      );

      alert(
        messages.create
          .createError
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-xl bg-white p-6">
        <h2 className="mb-6 text-xl font-bold">
          {
            messages.create
              .title
          }
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">
              {
                messages.create
                  .table
              }
            </label>

            <select
              className="w-full rounded-lg border p-2"
              value={
                tableId
              }
              onChange={(
                event
              ) =>
                setTableId(
                  event.target
                    .value
                )
              }
            >
              <option value="">
                {
                  messages.create
                    .selectTable
                }
              </option>

              {tables.map(
                (
                  table
                ) => (
                  <option
                    key={
                      table.id
                    }
                    value={
                      table.id
                    }
                  >
                    {
                      messages
                        .create
                        .tablePrefix
                    }{" "}
                    {
                      table.number
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              {
                messages.create
                  .product
              }
            </label>

            <select
              className="w-full rounded-lg border p-2"
              value={
                productId
              }
              onChange={(
                event
              ) =>
                setProductId(
                  event.target
                    .value
                )
              }
            >
              <option value="">
                {
                  messages.create
                    .selectProduct
                }
              </option>

              {products.map(
                (
                  product
                ) => (
                  <option
                    key={
                      product.id
                    }
                    value={
                      product.id
                    }
                  >
                    {productName(
                      product
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              {
                messages.create
                  .quantity
              }
            </label>

            <input
              type="number"
              min={
                1
              }
              className="w-full rounded-lg border p-2"
              value={
                quantity
              }
              onChange={(
                event
              ) =>
                setQuantity(
                  Number(
                    event.target
                      .value
                  )
                )
              }
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              {
                messages.create
                  .notes
              }
            </label>

            <textarea
              rows={
                3
              }
              className="w-full rounded-lg border p-2"
              value={
                notes
              }
              onChange={(
                event
              ) =>
                setNotes(
                  event.target
                    .value
                )
              }
            />
          </div>

          <div className="rounded-lg bg-gray-100 p-4">
            <div className="flex justify-between">
              <span>
                {
                  messages.create
                    .total
                }
              </span>

              <span className="font-bold">
                {formatMoney(
                  subtotal
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className="rounded-lg border px-4 py-2 disabled:opacity-60"
          >
            {
              messages.create
                .cancel
            }
          </button>

          <button
            type="button"
            onClick={() => {
              void createOrder();
            }}
            disabled={
              saving
            }
            className="rounded-lg bg-indigo-600 px-5 py-2 text-white disabled:opacity-60"
          >
            {saving
              ? messages.create
                  .creating
              : messages.create
                  .create}
          </button>
        </div>
      </div>
    </div>
  );
}