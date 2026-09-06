"use client";

import {
  useState,
} from "react";

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
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import {
  formatCurrency,
} from "@/lib/utils";

import type {
  Order,
  TranslatedText,
} from "@/types";

interface CreateOrderResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: Order;
}

export function Cart() {
  const {
    cart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    session,
    establishment,
    language,
    addOrder,
  } =
    useStore();

  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );

  const [
    notes,
    setNotes,
  ] =
    useState(
      ""
    );

  const getTranslation = (
    text:
      | TranslatedText
      | undefined
  ): string => {
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
  };

  /*
   * Este total es únicamente informativo.
   * El servidor vuelve a calcular precios,
   * modificadores, impuestos y total.
   */
  const estimatedTotal =
    cart.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.subtotal,
      0
    );

  async function handlePlaceOrder() {
    if (
      cart.length ===
      0
    ) {
      return;
    }

    if (
      !session ||
      !session.active
    ) {
      alert(
        "No existe una sesión activa."
      );

      return;
    }

    setLoading(
      true
    );

    try {
      /*
       * Contrato público seguro.
       *
       * El cliente NO envía:
       *
       * - tableId
       * - establishmentId
       * - precios
       * - subtotal
       * - impuestos
       * - total
       *
       * Todo ello se deriva o calcula
       * nuevamente en el servidor.
       */
      const items =
        cart.map(
          (item) => ({
            productId:
              item.product.id,

            quantity:
              item.quantity,

            modifiers:
              item.selectedModifiers.map(
                (
                  modifier
                ) => ({
                  id:
                    modifier.id,
                })
              ),

            notes:
              item.notes ||
              undefined,
          })
        );

      /*
       * IMPORTANTE:
       * una pulsación = un único POST = un pedido.
       */
      const response =
        await fetch(
          "/api/orders/create",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                sessionId:
                  session.id,

                items,

                notes:
                  notes.trim() ||
                  undefined,
              }),
          }
        );

      const json =
        await response.json() as
          CreateOrderResponse;

      if (
        !response.ok ||
        !json.success
      ) {
        throw new Error(
          json.error ||
            json.message ||
            "No se pudo crear el pedido."
        );
      }

      if (
        !json.data
      ) {
        throw new Error(
          "El servidor no devolvió el pedido creado."
        );
      }

      addOrder(
        json.data
      );

      clearCart();

      setNotes(
        ""
      );

      alert(
        `Pedido ${json.data.orderNumber} creado correctamente.`
      );
    } catch (
      error
    ) {
      console.error(
        "Error placing order:",
        error
      );

      alert(
        error instanceof
          Error
          ? error.message
          : "Se produjo un error al crear el pedido."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  if (
    cart.length ===
    0
  ) {
    return (
      <div className="py-12 text-center">
        <ShoppingBag
          size={
            48
          }
          className="mx-auto mb-4 text-gray-400"
        />

        <h3 className="mb-2 text-xl font-semibold">
          Tu carrito está vacío
        </h3>

        <p className="text-gray-600">
          Añade productos de la carta para empezar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Carrito
        </h2>

        <Button
          variant="ghost"
          onClick={
            clearCart
          }
          disabled={
            loading
          }
        >
          Vaciar carrito
        </Button>
      </div>

      <div className="space-y-4">
        {cart.map(
          (
            item,
            index
          ) => (
            <Card
              key={
                `${item.product.id}-${index}`
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {item.product.image && (
                    <img
                      src={
                        item.product.image
                      }
                      alt={
                        getTranslation(
                          item.product.name
                        )
                      }
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {getTranslation(
                        item.product.name
                      )}
                    </h4>

                    <p className="text-sm text-gray-600">
                      {formatCurrency(
                        item.product.price,
                        establishment?.currency
                      )}
                    </p>

                    {item.selectedModifiers.length >
                      0 && (
                      <div className="mt-1">
                        {item.selectedModifiers.map(
                          (
                            modifier,
                            modifierIndex
                          ) => (
                            <p
                              key={
                                `${modifier.id}-${modifierIndex}`
                              }
                              className="text-xs text-gray-500"
                            >
                              +{" "}
                              {getTranslation(
                                modifier.name
                              )}{" "}
                              (+
                              {formatCurrency(
                                modifier.price,
                                establishment?.currency
                              )}
                              )
                            </p>
                          )
                        )}
                      </div>
                    )}

                    {item.notes && (
                      <p className="mt-1 text-xs text-gray-500">
                        Nota:{" "}
                        {
                          item.notes
                        }
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={
                          loading
                        }
                        onClick={() =>
                          updateCartItemQuantity(
                            index,
                            item.quantity -
                              1
                          )
                        }
                      >
                        <Minus
                          size={
                            16
                          }
                        />
                      </Button>

                      <span className="w-12 text-center font-semibold">
                        {
                          item.quantity
                        }
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        disabled={
                          loading
                        }
                        onClick={() =>
                          updateCartItemQuantity(
                            index,
                            item.quantity +
                              1
                          )
                        }
                      >
                        <Plus
                          size={
                            16
                          }
                        />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto text-red-600"
                        disabled={
                          loading
                        }
                        onClick={() =>
                          removeFromCart(
                            index
                          )
                        }
                      >
                        <Trash2
                          size={
                            16
                          }
                        />
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      {formatCurrency(
                        item.subtotal,
                        establishment?.currency
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Observaciones
          </CardTitle>

          <CardDescription>
            Añade instrucciones especiales para tu pedido.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Input
            placeholder="Ej.: sin cebolla, salsa aparte..."
            value={
              notes
            }
            disabled={
              loading
            }
            onChange={(
              event
            ) =>
              setNotes(
                event.target.value
              )
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between text-lg font-bold">
            <span>
              Total estimado
            </span>

            <span>
              {formatCurrency(
                estimatedTotal,
                establishment?.currency
              )}
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            El importe definitivo será validado y calculado por el servidor.
          </p>

          <Button
            className="mt-4 w-full"
            onClick={
              handlePlaceOrder
            }
            disabled={
              loading ||
              !session ||
              !session.active
            }
          >
            {loading
              ? "Enviando pedido..."
              : "Realizar pedido"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}