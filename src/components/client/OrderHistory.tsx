"use client";

import {
  useCallback,
  useEffect,
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
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  XCircle,
} from "lucide-react";

import {
  formatCurrency,
} from "@/lib/utils";

import {
  StripePaymentElementForm,
} from "@/components/client/StripePaymentElement";

import type {
  Order,
} from "@/types";

interface OrdersBySessionResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: Order[];
}

interface CheckoutPaymentMethod {
  id?: number;
  method: string;
  displayName?: string | null;
  enabled?: boolean;
}

interface CheckoutSummary {
  total: string;
  paid: string;
  pending: string;
  fullyPaid: boolean;
  paymentMethods: CheckoutPaymentMethod[];
}

interface CheckoutSummaryResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: CheckoutSummary;
}

interface StripeCheckoutData {
  paymentId: number;
  sessionId: string;
  method: string;
  displayName?: string;
  amount: string;
  status: string;
  currency: string;
  requiresConfirmation: boolean;
  stripe: {
    clientSecret: string;
    publishableKey: string;
    paymentIntentId: string;
  };
}

interface StripeCheckoutResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: StripeCheckoutData;
}

export function OrderHistory() {
  const {
    session,
    establishment,
  } =
    useStore();

  const [
    orders,
    setOrders,
  ] =
    useState<Order[]>(
      []
    );

  const [
    checkout,
    setCheckout,
  ] =
    useState<CheckoutSummary | null>(
      null
    );

  const [
    stripeCheckout,
    setStripeCheckout,
  ] =
    useState<StripeCheckoutData | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    checkoutLoading,
    setCheckoutLoading,
  ] =
    useState(
      false
    );

  const [
    paymentStarting,
    setPaymentStarting,
  ] =
    useState(
      false
    );

  const [
    paymentSettling,
    setPaymentSettling,
  ] =
    useState(
      false
    );

  const [
    paymentSuccess,
    setPaymentSuccess,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const [
    paymentError,
    setPaymentError,
  ] =
    useState(
      ""
    );

  const fetchOrders =
    useCallback(
      async (
        silent = false
      ) => {
        if (
          !session
        ) {
          setOrders(
            []
          );

          if (
            !silent
          ) {
            setLoading(
              false
            );
          }

          return;
        }

        try {
          const response =
            await fetch(
              `/api/orders/session/${encodeURIComponent(
                session.id
              )}`,
              {
                cache:
                  "no-store",
              }
            );

          const json =
            await response.json() as
              OrdersBySessionResponse;

          if (
            !response.ok ||
            !json.success
          ) {
            throw new Error(
              json.error ||
                json.message ||
                "No se pudieron cargar los pedidos."
            );
          }

          setOrders(
            Array.isArray(
              json.data
            )
              ? json.data
              : []
          );

          setError(
            ""
          );
        } catch (
          fetchError
        ) {
          console.error(
            "Error fetching orders:",
            fetchError
          );

          if (
            !silent
          ) {
            setOrders(
              []
            );

            setError(
              fetchError instanceof
                Error
                ? fetchError.message
                : "No se pudieron cargar los pedidos."
            );
          }
        } finally {
          if (
            !silent
          ) {
            setLoading(
              false
            );
          }
        }
      },
      [
        session,
      ]
    );

  const fetchCheckout =
    useCallback(
      async (
        silent = false
      ) => {
        if (
          !session
        ) {
          setCheckout(
            null
          );

          return null;
        }

        try {
          if (
            !silent
          ) {
            setCheckoutLoading(
              true
            );
          }

          const response =
            await fetch(
              `/api/guest/checkout?sessionId=${encodeURIComponent(
                session.id
              )}`,
              {
                cache:
                  "no-store",
              }
            );

          const json =
            await response.json() as
              CheckoutSummaryResponse;

          if (
            !response.ok ||
            !json.success ||
            !json.data
          ) {
            throw new Error(
              json.error ||
                json.message ||
                "No se pudo consultar la cuenta."
            );
          }

          setCheckout(
            json.data
          );

          return json.data;
        } catch (
          checkoutError
        ) {
          console.error(
            "Error fetching checkout:",
            checkoutError
          );

          if (
            !silent
          ) {
            setPaymentError(
              checkoutError instanceof
                Error
                ? checkoutError.message
                : "No se pudo consultar la cuenta."
            );
          }

          return null;
        } finally {
          if (
            !silent
          ) {
            setCheckoutLoading(
              false
            );
          }
        }
      },
      [
        session,
      ]
    );

  useEffect(
    () => {
      if (
        !session
      ) {
        setOrders(
          []
        );

        setCheckout(
          null
        );

        setStripeCheckout(
          null
        );

        setLoading(
          false
        );

        return;
      }

      void fetchOrders();
      void fetchCheckout(
        true
      );

      const interval =
        window.setInterval(
          () => {
            void fetchOrders(
              true
            );

            void fetchCheckout(
              true
            );
          },
          30000
        );

      return () => {
        window.clearInterval(
          interval
        );
      };
    },
    [
      session,
      fetchOrders,
      fetchCheckout,
    ]
  );

  function getStatusIcon(
    status: string
  ) {
    switch (
      status
    ) {
      case "pending":
        return (
          <Clock className="text-yellow-600" />
        );

      case "accepted":
      case "preparing":
        return (
          <Package className="text-blue-600" />
        );

      case "ready":
      case "delivering":
      case "delivered":
        return (
          <CheckCircle className="text-green-600" />
        );

      case "cancelled":
        return (
          <XCircle className="text-red-600" />
        );

      default:
        return (
          <Clock className="text-gray-600" />
        );
    }
  }

  function getStatusBadge(
    status: string
  ) {
    const variants: Record<
      string,
      | "default"
      | "warning"
      | "success"
      | "destructive"
    > = {
      pending:
        "warning",

      accepted:
        "default",

      preparing:
        "default",

      ready:
        "success",

      delivering:
        "success",

      delivered:
        "success",

      cancelled:
        "destructive",
    };

    return (
      <Badge
        variant={
          variants[
            status
          ] ||
          "default"
        }
      >
        {status.toUpperCase()}
      </Badge>
    );
  }

  function getOrdersTotal() {
    return orders.reduce(
      (
        sum,
        order
      ) =>
        sum +
        Number(
          order.total
        ),
      0
    );
  }

  function hasCardPaymentMethod() {
    return (
      checkout?.paymentMethods?.some(
        (
          paymentMethod
        ) =>
          paymentMethod.method ===
            "card" &&
          paymentMethod.enabled !==
            false
      ) ??
      false
    );
  }

  async function handleRequestBill() {
    setPaymentError(
      ""
    );

    setPaymentSuccess(
      false
    );

    await fetchCheckout();
  }

  async function handleStartCardPayment() {
    if (
      !session ||
      paymentStarting
    ) {
      return;
    }

    try {
      setPaymentStarting(
        true
      );

      setPaymentError(
        ""
      );

      setPaymentSuccess(
        false
      );

      const response =
        await fetch(
          "/api/guest/checkout",
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

                method:
                  "card",
              }),
          }
        );

      const json =
        await response.json() as
          StripeCheckoutResponse;

      if (
        !response.ok ||
        !json.success ||
        !json.data
      ) {
        throw new Error(
          json.error ||
            json.message ||
            "No se pudo iniciar el pago."
        );
      }

      if (
        !json.data.stripe?.clientSecret ||
        !json.data.stripe?.publishableKey ||
        !json.data.stripe?.paymentIntentId
      ) {
        throw new Error(
          "Stripe no devolvió los datos necesarios para iniciar el pago."
        );
      }

      setStripeCheckout(
        json.data
      );
    } catch (
      startError
    ) {
      console.error(
        "Error starting Stripe payment:",
        startError
      );

      setPaymentError(
        startError instanceof
          Error
          ? startError.message
          : "No se pudo iniciar el pago."
      );
    } finally {
      setPaymentStarting(
        false
      );
    }
  }

  async function waitForSettlement() {
    setPaymentSettling(
      true
    );

    setPaymentError(
      ""
    );

    try {
      for (
        let attempt = 0;
        attempt < 30;
        attempt += 1
      ) {
        const summary =
          await fetchCheckout(
            true
          );

        if (
          summary?.fullyPaid ||
          Number(
            summary?.pending ??
              0
          ) <= 0
        ) {
          setPaymentSuccess(
            true
          );

          setStripeCheckout(
            null
          );

          await fetchOrders(
            true
          );

          return;
        }

        await new Promise<void>(
          (
            resolve
          ) => {
            window.setTimeout(
              resolve,
              500
            );
          }
        );
      }

      throw new Error(
        "Stripe ha recibido el pago, pero YaMar todavía está esperando la confirmación final. La cuenta se actualizará automáticamente."
      );
    } catch (
      settlementError
    ) {
      console.error(
        "Error waiting for payment settlement:",
        settlementError
      );

      setPaymentError(
        settlementError instanceof
          Error
          ? settlementError.message
          : "No se pudo confirmar el estado final del pago."
      );

      await fetchCheckout(
        true
      );
    } finally {
      setPaymentSettling(
        false
      );
    }
  }

  if (
    loading
  ) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-black" />

        <p className="text-gray-600">
          Cargando pedidos...
        </p>
      </div>
    );
  }

  if (
    error
  ) {
    return (
      <div className="py-12 text-center">
        <Package
          size={
            48
          }
          className="mx-auto mb-4 text-red-400"
        />

        <h3 className="mb-2 text-xl font-semibold">
          No se pudieron cargar los pedidos
        </h3>

        <p className="text-gray-600">
          {
            error
          }
        </p>
      </div>
    );
  }

  if (
    orders.length ===
    0
  ) {
    return (
      <div className="py-12 text-center">
        <Package
          size={
            48
          }
          className="mx-auto mb-4 text-gray-400"
        />

        <h3 className="mb-2 text-xl font-semibold">
          Todavía no hay pedidos
        </h3>

        <p className="text-gray-600">
          Tus pedidos aparecerán aquí.
        </p>
      </div>
    );
  }

  const displayedTotal =
    checkout
      ? Number(
          checkout.total
        )
      : getOrdersTotal();

  const displayedPaid =
    Number(
      checkout?.paid ??
        0
    );

  const displayedPending =
    Number(
      checkout?.pending ??
        displayedTotal
    );

  const currency =
    establishment?.currency;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">
          Historial de pedidos
        </h2>

        <p className="text-gray-600">
          Total de la cuenta:{" "}
          {formatCurrency(
            displayedTotal,
            currency
          )}
        </p>
      </div>

      <div className="space-y-4">
        {orders.map(
          (
            order
          ) => (
            <Card
              key={
                order.id
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(
                        order.status
                      )}

                      Pedido #
                      {
                        order.orderNumber
                      }
                    </CardTitle>

                    <CardDescription>
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </CardDescription>
                  </div>

                  {getStatusBadge(
                    order.status
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  {Array.isArray(
                    order.items
                  ) &&
                    order.items.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            item.id ??
                            index
                          }
                          className="flex justify-between gap-4 text-sm"
                        >
                          <span>
                            {
                              item.quantity
                            }
                            x{" "}
                            {typeof item.product?.name ===
                            "string"
                              ? item.product.name
                              : item.product?.name?.[
                                  "es"
                                ] ||
                                "Producto"}
                          </span>

                          <span>
                            {formatCurrency(
                              item.subtotal,
                              currency
                            )}
                          </span>
                        </div>
                      )
                    )}

                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>
                      Total
                    </span>

                    <span>
                      {formatCurrency(
                        order.total,
                        currency
                      )}
                    </span>
                  </div>

                  {order.estimatedTime &&
                    order.status !==
                      "delivered" && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Clock
                          size={
                            16
                          }
                        />

                        <span>
                          Tiempo estimado:{" "}
                          {
                            order.estimatedTime
                          }{" "}
                          minutos
                        </span>
                      </div>
                    )}

                  {order.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">
                        Observaciones:
                      </span>{" "}
                      {
                        order.notes
                      }
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Cuenta
          </CardTitle>

          <CardDescription>
            Consulta el importe pendiente y realiza el pago.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {
            checkoutLoading && (
              <p className="text-sm text-gray-500">
                Consultando cuenta...
              </p>
            )
          }

          {
            checkout && (
              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex justify-between text-sm">
                  <span>
                    Total
                  </span>

                  <span className="font-medium">
                    {formatCurrency(
                      displayedTotal,
                      currency
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>
                    Pagado
                  </span>

                  <span className="font-medium">
                    {formatCurrency(
                      displayedPaid,
                      currency
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>
                    Pendiente
                  </span>

                  <span>
                    {formatCurrency(
                      displayedPending,
                      currency
                    )}
                  </span>
                </div>
              </div>
            )
          }

          {
            paymentSuccess && (
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                <CheckCircle
                  className="mt-0.5 shrink-0"
                  size={
                    20
                  }
                />

                <div>
                  <p className="font-semibold">
                    Pago confirmado
                  </p>

                  <p className="text-sm">
                    Tu cuenta ha sido pagada correctamente.
                  </p>
                </div>
              </div>
            )
          }

          {
            paymentError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {
                  paymentError
                }
              </div>
            )
          }

          {
            paymentSettling && (
              <div className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-600">
                Pago recibido por Stripe. Confirmando el cierre de la cuenta...
              </div>
            )
          }

          {
            stripeCheckout ? (
              <StripePaymentElementForm
                clientSecret={
                  stripeCheckout.stripe.clientSecret
                }
                publishableKey={
                  stripeCheckout.stripe.publishableKey
                }
                amountLabel={
                  formatCurrency(
                    stripeCheckout.amount,
                    stripeCheckout.currency
                  )
                }
                onSuccess={
                  waitForSettlement
                }
                onCancel={
                  () => {
                    setStripeCheckout(
                      null
                    );

                    setPaymentError(
                      ""
                    );
                  }
                }
              />
            ) : (
              <>
                {
                  checkout?.fullyPaid ? (
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 p-4 font-medium text-green-700">
                      <CheckCircle
                        size={
                          20
                        }
                      />

                      Cuenta pagada
                    </div>
                  ) : (
                    <>
                      {
                        checkout &&
                        displayedPending >
                          0 &&
                        hasCardPaymentMethod() && (
                          <Button
                            type="button"
                            className="w-full"
                            disabled={
                              paymentStarting ||
                              paymentSettling
                            }
                            onClick={
                              () => {
                                void handleStartCardPayment();
                              }
                            }
                          >
                            <CreditCard
                              size={
                                18
                              }
                              className="mr-2"
                            />

                            {
                              paymentStarting
                                ? "Preparando pago..."
                                : `Pagar ${formatCurrency(
                                    displayedPending,
                                    currency
                                  )} con tarjeta`
                            }
                          </Button>
                        )
                      }

                      {
                        checkout &&
                        displayedPending >
                          0 &&
                        !hasCardPaymentMethod() && (
                          <p className="text-center text-sm text-gray-600">
                            El pago con tarjeta no está disponible para este establecimiento.
                          </p>
                        )
                      }

                      <Button
                        type="button"
                        className="w-full"
                        variant="outline"
                        disabled={
                          checkoutLoading ||
                          paymentStarting ||
                          paymentSettling
                        }
                        onClick={
                          () => {
                            void handleRequestBill();
                          }
                        }
                      >
                        {
                          checkout
                            ? "Actualizar cuenta"
                            : "Pedir la cuenta"
                        }
                      </Button>
                    </>
                  )
                }
              </>
            )
          }
        </CardContent>
      </Card>
    </div>
  );
}