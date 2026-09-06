"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Clock,
  Plus,
  X,
} from "lucide-react";

import {
  useStore,
} from "@/store/useStore";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  formatCurrency,
} from "@/lib/utils";

import type {
  Menu,
  Modifier,
  Product,
  TranslatedText,
} from "@/types";

interface GuestMenu
  extends Omit<
    Menu,
    "nextOpeningTime"
  > {
  currentSchedule?: {
    id: number;
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  } | null;

  nextOpening?: {
    dayOfWeek: number;
    openTime: string;
  } | null;
}

interface GuestMenuResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: GuestMenu[];
}

export function MenuList() {
  const {
    session,
    establishment,
    language,
    addToCart,
  } =
    useStore();

  const [
    menus,
    setMenus,
  ] =
    useState<
      GuestMenu[]
    >(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const [
    selectedProduct,
    setSelectedProduct,
  ] =
    useState<
      Product |
      null
    >(
      null
    );

  const [
    selectedModifierIds,
    setSelectedModifierIds,
  ] =
    useState<
      number[]
    >(
      []
    );

  const [
    productNotes,
    setProductNotes,
  ] =
    useState(
      ""
    );

  /*
   * ==========================================================
   * CARGA PÚBLICA CANÓNICA
   * ==========================================================
   */

  useEffect(
    () => {
      if (
        !session?.id
      ) {
        setMenus(
          []
        );

        setLoading(
          false
        );

        return;
      }

      let cancelled =
        false;

      async function fetchMenus() {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const response =
            await fetch(
              `/api/guest/menu?sessionId=${encodeURIComponent(
                session!.id
              )}`,
              {
                method:
                  "GET",

                cache:
                  "no-store",
              }
            );

          const json =
            await response.json() as
              GuestMenuResponse;

          /*
           * Una sesión pagada y cerrada deja de ser válida
           * para consultar la carta.
           *
           * Ese 404 es un estado esperado del ciclo de vida
           * de la sesión, no un error de aplicación.
           */
          if (
            response.status === 404
          ) {
            if (
              cancelled
            ) {
              return;
            }

            setMenus(
              []
            );

            setError(
              "La cuenta está cerrada. Escanea de nuevo el QR para iniciar una nueva sesión."
            );

            return;
          }

          if (
            !response.ok ||
            !json.success
          ) {
            throw new Error(
              json.error ||
                "No se pudo cargar la carta."
            );
          }

          if (
            cancelled
          ) {
            return;
          }

          setMenus(
            Array.isArray(
              json.data
            )
              ? json.data
              : []
          );
        } catch (
          fetchError
        ) {
          console.error(
            "Error fetching guest menu:",
            fetchError
          );

          if (
            cancelled
          ) {
            return;
          }

          setMenus(
            []
          );

          setError(
            fetchError instanceof
              Error
              ? fetchError.message
              : "No se pudo cargar la carta."
          );
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false
            );
          }
        }
      }

      void fetchMenus();

      return () => {
        cancelled =
          true;
      };
    },
    [
      session?.id,
    ]
  );

  /*
   * ==========================================================
   * TRADUCCIONES
   * ==========================================================
   */

  function getTranslation(
    text:
      TranslatedText |
      undefined
  ): string {
    if (
      !text
    ) {
      return "";
    }

    return (
      text[language] ||
      text.es ||
      Object.values(
        text
      )[0] ||
      ""
    );
  }

  /*
   * ==========================================================
   * MODIFICADORES DEL PRODUCTO SELECCIONADO
   * ==========================================================
   */

  const selectedModifiers =
    useMemo(
      () => {
        if (
          !selectedProduct?.modifiers
        ) {
          return [];
        }

        return selectedProduct.modifiers.filter(
          (
            modifier
          ) =>
            selectedModifierIds.includes(
              modifier.id
            )
        );
      },
      [
        selectedModifierIds,
        selectedProduct,
      ]
    );

  const selectedProductTotal =
    useMemo(
      () => {
        if (
          !selectedProduct
        ) {
          return 0;
        }

        const productPrice =
          Number(
            selectedProduct.price
          );

        const modifiersPrice =
          selectedModifiers.reduce(
            (
              total,
              modifier
            ) =>
              total +
              Number(
                modifier.price
              ),
            0
          );

        return (
          productPrice +
          modifiersPrice
        );
      },
      [
        selectedModifiers,
        selectedProduct,
      ]
    );

  /*
   * ==========================================================
   * CARRITO
   * ==========================================================
   */

  function addProductDirectly(
    product: Product
  ) {
    addToCart({
      product,

      quantity:
        1,

      selectedModifiers:
        [],

      notes:
        "",

      subtotal:
        Number(
          product.price
        ),
    });
  }

  function handleProductSelection(
    product: Product
  ) {
    const activeModifiers =
      product.modifiers?.filter(
        (
          modifier
        ) =>
          modifier.active
      ) ??
      [];

    /*
     * Sin modificadores no necesitamos abrir modal.
     */
    if (
      activeModifiers.length ===
      0
    ) {
      addProductDirectly(
        product
      );

      return;
    }

    setSelectedProduct(
      product
    );

    setSelectedModifierIds(
      []
    );

    setProductNotes(
      ""
    );
  }

  function toggleModifier(
    modifier: Modifier
  ) {
    setSelectedModifierIds(
      (
        current
      ) =>
        current.includes(
          modifier.id
        )
          ? current.filter(
              (
                id
              ) =>
                id !==
                modifier.id
            )
          : [
              ...current,
              modifier.id,
            ]
    );
  }

  function confirmSelectedProduct() {
    if (
      !selectedProduct
    ) {
      return;
    }

    addToCart({
      product:
        selectedProduct,

      quantity:
        1,

      selectedModifiers,

      notes:
        productNotes.trim(),

      subtotal:
        selectedProductTotal,
    });

    closeProductModal();
  }

  function closeProductModal() {
    setSelectedProduct(
      null
    );

    setSelectedModifierIds(
      []
    );

    setProductNotes(
      ""
    );
  }

  /*
   * ==========================================================
   * PRÓXIMA APERTURA
   * ==========================================================
   */

  function formatNextOpening(
    nextOpening:
      GuestMenu["nextOpening"]
  ) {
    if (
      !nextOpening
    ) {
      return null;
    }

    /*
     * 2026-08-23 fue domingo.
     *
     * Lo utilizamos únicamente para que Intl obtenga
     * el nombre localizado del día de la semana.
     */
    const referenceSunday =
      new Date(
        Date.UTC(
          2026,
          7,
          23 +
            nextOpening.dayOfWeek
        )
      );

    const localeMap:
      Record<
        string,
        string
      > = {
        es:
          "es-ES",

        en:
          "en-GB",

        de:
          "de-DE",

        fr:
          "fr-FR",

        it:
          "it-IT",

        pt:
          "pt-PT",
      };

    const day =
      new Intl.DateTimeFormat(
        localeMap[language] ??
          "es-ES",
        {
          weekday:
            "long",

          timeZone:
            "UTC",
        }
      ).format(
        referenceSunday
      );

    return `${day} ${nextOpening.openTime}`;
  }

  /*
   * ==========================================================
   * ESTADOS
   * ==========================================================
   */

  if (
    loading
  ) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-black" />

        <p className="text-gray-600">
          Cargando carta...
        </p>
      </div>
    );
  }

  if (
    error
  ) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
        <h2 className="font-semibold text-red-700">
          No se pudo cargar la carta
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (
    menus.length ===
    0
  ) {
    return (
      <div className="py-12 text-center">
        <h3 className="mb-2 text-xl font-semibold">
          No hay menús disponibles
        </h3>

        <p className="text-gray-600">
          En este momento no hay ninguna carta activa.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="mb-2 text-2xl font-bold">
            Carta
          </h2>

          <p className="text-gray-600">
            Elige tus productos y añádelos al pedido.
          </p>
        </div>

        {menus.map(
          (
            menu
          ) => {
            const nextOpeningLabel =
              formatNextOpening(
                menu.nextOpening
              );

            return (
              <section
                key={
                  menu.id
                }
                className="space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {getTranslation(
                        menu.name
                      )}
                    </h3>

                    {menu.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {getTranslation(
                          menu.description
                        )}
                      </p>
                    )}
                  </div>

                  {menu.isOpen ? (
                    <Badge variant="success">
                      Abierto
                    </Badge>
                  ) : (
                    <Badge variant="warning">
                      Cerrado
                    </Badge>
                  )}
                </div>

                {!menu.isOpen &&
                  nextOpeningLabel && (
                    <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-3 text-sm">
                      <Clock
                        size={
                          16
                        }
                        className="shrink-0 text-yellow-600"
                      />

                      <span className="text-yellow-800">
                        Próxima apertura:{" "}
                        {
                          nextOpeningLabel
                        }
                      </span>
                    </div>
                  )}

                {menu.categories.length ===
                0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-sm text-gray-500">
                    Este menú todavía no tiene productos publicados.
                  </div>
                ) : (
                  <div className="space-y-8">
                    {menu.categories.map(
                      (
                        category
                      ) => (
                        <div
                          key={
                            category.id
                          }
                        >
                          <h4 className="mb-3 font-semibold">
                            {getTranslation(
                              category.name
                            )}
                          </h4>

                          {category.description && (
                            <p className="mb-4 text-sm text-gray-600">
                              {getTranslation(
                                category.description
                              )}
                            </p>
                          )}

                          {category.products.length ===
                          0 ? (
                            <p className="text-sm text-gray-500">
                              No hay productos disponibles en esta categoría.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {category.products.map(
                                (
                                  product
                                ) => {
                                  const outOfStock =
                                    product.stock !==
                                      undefined &&
                                    product.stock !==
                                      null &&
                                    product.stock <=
                                      0;

                                  const canOrder =
                                    Boolean(
                                      menu.isOpen
                                    ) &&
                                    product.available &&
                                    !outOfStock;

                                  return (
                                    <Card
                                      key={
                                        product.id
                                      }
                                      className="overflow-hidden"
                                    >
                                      {product.image && (
                                        <img
                                          src={
                                            product.image
                                          }
                                          alt={
                                            getTranslation(
                                              product.name
                                            )
                                          }
                                          className="h-48 w-full object-cover"
                                        />
                                      )}

                                      <CardHeader>
                                        <CardTitle className="text-lg">
                                          {getTranslation(
                                            product.name
                                          )}
                                        </CardTitle>

                                        {product.description && (
                                          <CardDescription>
                                            {getTranslation(
                                              product.description
                                            )}
                                          </CardDescription>
                                        )}

                                        <div className="mt-2 flex flex-wrap gap-1">
                                          {product.featured && (
                                            <Badge variant="default">
                                              Destacado
                                            </Badge>
                                          )}

                                          {product.dailySpecial && (
                                            <Badge variant="secondary">
                                              Especial
                                            </Badge>
                                          )}

                                          {product.dietary.map(
                                            (
                                              diet
                                            ) => (
                                              <Badge
                                                key={
                                                  diet
                                                }
                                                variant="outline"
                                              >
                                                {
                                                  diet
                                                }
                                              </Badge>
                                            )
                                          )}
                                        </div>
                                      </CardHeader>

                                      <CardContent>
                                        <div className="flex items-center justify-between gap-3">
                                          <span className="text-xl font-bold">
                                            {formatCurrency(
                                              product.price,
                                              establishment?.currency
                                            )}
                                          </span>

                                          {!menu.isOpen ? (
                                            <Badge variant="warning">
                                              Carta cerrada
                                            </Badge>
                                          ) : !product.available ||
                                            outOfStock ? (
                                            <Badge variant="destructive">
                                              Agotado
                                            </Badge>
                                          ) : (
                                            <Button
                                              size="sm"
                                              disabled={
                                                !canOrder
                                              }
                                              onClick={() =>
                                                handleProductSelection(
                                                  product
                                                )
                                              }
                                            >
                                              <Plus
                                                size={
                                                  16
                                                }
                                                className="mr-1"
                                              />

                                              Añadir
                                            </Button>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>
            );
          }
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">
              <div>
                <h2 className="text-xl font-bold">
                  {getTranslation(
                    selectedProduct.name
                  )}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Personaliza tu producto
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={
                  closeProductModal
                }
              >
                <X
                  size={
                    20
                  }
                />
              </Button>
            </div>

            <div className="space-y-6 p-5">
              {selectedProduct.modifiers &&
                selectedProduct.modifiers.length >
                  0 && (
                  <div>
                    <h3 className="mb-3 font-semibold">
                      Opciones
                    </h3>

                    <div className="space-y-2">
                      {selectedProduct.modifiers
                        .filter(
                          (
                            modifier
                          ) =>
                            modifier.active
                        )
                        .map(
                          (
                            modifier
                          ) => {
                            const selected =
                              selectedModifierIds.includes(
                                modifier.id
                              );

                            return (
                              <label
                                key={
                                  modifier.id
                                }
                                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4"
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={
                                      selected
                                    }
                                    onChange={() =>
                                      toggleModifier(
                                        modifier
                                      )
                                    }
                                    className="h-4 w-4"
                                  />

                                  <span className="font-medium">
                                    {getTranslation(
                                      modifier.name
                                    )}
                                  </span>
                                </div>

                                <span className="shrink-0 text-sm text-gray-600">
                                  {Number(
                                    modifier.price
                                  ) >
                                  0
                                    ? `+${formatCurrency(
                                        modifier.price,
                                        establishment?.currency
                                      )}`
                                    : "Sin coste"}
                                </span>
                              </label>
                            );
                          }
                        )}
                    </div>
                  </div>
                )}

              <div>
                <label
                  htmlFor="product-notes"
                  className="mb-2 block font-medium"
                >
                  Observaciones
                </label>

                <textarea
                  id="product-notes"
                  value={
                    productNotes
                  }
                  onChange={(
                    event
                  ) =>
                    setProductNotes(
                      event.target.value
                    )
                  }
                  rows={
                    3
                  }
                  placeholder="Sin cebolla, alergias, punto de cocción..."
                  className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-black"
                />
              </div>

              <Button
                className="w-full"
                onClick={
                  confirmSelectedProduct
                }
              >
                Añadir ·{" "}
                {formatCurrency(
                  selectedProductTotal,
                  establishment?.currency
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}