import {
  NextRequest,
} from "next/server";

import {
  and,
  eq,
  ne,
} from "drizzle-orm";

import {
  z,
} from "zod";

import {
  db,
} from "@/db";

import {
  establishments,
  orders,
  paymentMethods,
  payments,
  sessions,
} from "@/db/schema";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  Logger,
} from "@/services/logger.service";

import {
  PaymentService,
} from "@/services/payment.service";

import {
  StripeService,
} from "@/services/stripe.service";

const GuestCheckoutSchema =
  z.object({
    sessionId:
      z.string().uuid(),

    method:
      z.enum([
        "card",
        "cash",
        "transfer",
        "paypal",
        "apple_pay",
        "google_pay",
      ]),
  });

function roundMoney(
  value: number
) {
  return (
    Math.round(
      (
        value +
        Number.EPSILON
      ) *
        100
    ) /
    100
  );
}

export async function GET(
  request: NextRequest
) {
  try {
    const {
      searchParams,
    } =
      new URL(
        request.url
      );

    const sessionId =
      searchParams.get(
        "sessionId"
      );

    const parsed =
      z
        .string()
        .uuid()
        .safeParse(
          sessionId
        );

    if (
      !parsed.success
    ) {
      return ApiResponse.error(
        "sessionId inválido.",
        400
      );
    }

    const session =
      await db.query.sessions.findFirst({
        where:
          eq(
            sessions.id,
            parsed.data
          ),
      });

    if (
      !session
    ) {
      return ApiResponse.error(
        "La sesión no existe.",
        404
      );
    }

    const establishment =
      await db.query.establishments.findFirst({
        where:
          and(
            eq(
              establishments.id,
              session.establishmentId
            ),
            eq(
              establishments.active,
              true
            )
          ),
      });

    if (
      !establishment
    ) {
      return ApiResponse.error(
        "El establecimiento no está disponible.",
        404
      );
    }

    const sessionOrders =
      await db
        .select({
          total:
            orders.total,
        })
        .from(
          orders
        )
        .where(
          and(
            eq(
              orders.sessionId,
              session.id
            ),
            eq(
              orders.establishmentId,
              session.establishmentId
            ),
            ne(
              orders.status,
              "cancelled"
            )
          )
        );

    const total =
      roundMoney(
        sessionOrders.reduce(
          (
            sum,
            order
          ) =>
            sum +
            Number(
              order.total
            ),
          0
        )
      );

    const paidPayments =
      await db
        .select({
          amount:
            payments.amount,
        })
        .from(
          payments
        )
        .where(
          and(
            eq(
              payments.sessionId,
              session.id
            ),
            eq(
              payments.establishmentId,
              session.establishmentId
            ),
            eq(
              payments.status,
              "paid"
            )
          )
        );

    const paid =
      roundMoney(
        paidPayments.reduce(
          (
            sum,
            payment
          ) =>
            sum +
            Number(
              payment.amount
            ),
          0
        )
      );

    const pending =
      Math.max(
        0,
        roundMoney(
          total -
            paid
        )
      );

    const enabledMethods =
      await db
        .select({
          id:
            paymentMethods.id,
          method:
            paymentMethods.method,
          displayName:
            paymentMethods.displayName,
          sortOrder:
            paymentMethods.sortOrder,
        })
        .from(
          paymentMethods
        )
        .where(
          and(
            eq(
              paymentMethods.establishmentId,
              session.establishmentId
            ),
            eq(
              paymentMethods.enabled,
              true
            )
          )
        )
        .orderBy(
          paymentMethods.sortOrder,
          paymentMethods.id
        );

    return ApiResponse.success(
      {
        sessionId:
          session.id,

        active:
          session.active,

        currency:
          establishment.currency,

        total:
          total.toFixed(
            2
          ),

        paid:
          paid.toFixed(
            2
          ),

        pending:
          pending.toFixed(
            2
          ),

        fullyPaid:
          total > 0 &&
          pending === 0,

        paymentMethods:
          enabledMethods,
      },
      "Checkout obtenido correctamente."
    );
  } catch (
    error: unknown
  ) {
    Logger.error(
      "Error obteniendo checkout público.",
      error
    );

    return ApiResponse.error(
      "Error obteniendo el checkout.",
      500
    );
  }
}
export async function POST(
  request: NextRequest
) {
  try {
    /*
     * ========================================================
     * 1. VALIDAR ENTRADA
     * ========================================================
     *
     * El cliente solamente puede indicar:
     *
     * - sessionId
     * - método de pago
     *
     * Nunca confiamos en:
     *
     * - establishmentId
     * - tableId
     * - amount
     * - total
     * - status
     * - transactionId
     * - Stripe IDs
     */
    const body =
      GuestCheckoutSchema.parse(
        await request.json()
      );

    /*
     * ========================================================
     * 2. SESIÓN
     * ========================================================
     */
    const session =
      await db.query.sessions.findFirst({
        where:
          eq(
            sessions.id,
            body.sessionId
          ),
      });

    if (
      !session
    ) {
      return ApiResponse.error(
        "La sesión no existe.",
        404
      );
    }

    if (
      !session.active
    ) {
      return ApiResponse.error(
        "La sesión ya está cerrada.",
        400
      );
    }

    /*
     * ========================================================
     * 3. ESTABLECIMIENTO
     * ========================================================
     *
     * El tenant se deriva exclusivamente de la sesión.
     */
    const establishment =
      await db.query.establishments.findFirst({
        where:
          and(
            eq(
              establishments.id,
              session.establishmentId
            ),
            eq(
              establishments.active,
              true
            )
          ),
      });

    if (
      !establishment
    ) {
      return ApiResponse.error(
        "El establecimiento no está disponible.",
        404
      );
    }

    /*
     * ========================================================
     * 4. MÉTODO DE PAGO
     * ========================================================
     *
     * No basta con que el método exista en el enum.
     * Debe estar habilitado específicamente para este tenant.
     */
    const paymentMethod =
      await db.query.paymentMethods.findFirst({
        where:
          and(
            eq(
              paymentMethods.establishmentId,
              session.establishmentId
            ),
            eq(
              paymentMethods.method,
              body.method
            ),
            eq(
              paymentMethods.enabled,
              true
            )
          ),
      });

    if (
      !paymentMethod
    ) {
      return ApiResponse.error(
        "El método de pago seleccionado no está disponible.",
        400
      );
    }

    /*
     * ========================================================
     * 5. TOTAL REAL DE LA SESIÓN
     * ========================================================
     *
     * Solo cuentan pedidos no cancelados.
     */
    const sessionOrders =
      await db
        .select({
          total:
            orders.total,
        })
        .from(
          orders
        )
        .where(
          and(
            eq(
              orders.sessionId,
              session.id
            ),
            eq(
              orders.establishmentId,
              session.establishmentId
            ),
            ne(
              orders.status,
              "cancelled"
            )
          )
        );

    const total =
      roundMoney(
        sessionOrders.reduce(
          (
            sum,
            order
          ) =>
            sum +
            Number(
              order.total
            ),
          0
        )
      );

    if (
      total <= 0
    ) {
      return ApiResponse.error(
        "La sesión no tiene ningún importe pendiente.",
        400
      );
    }

    /*
     * ========================================================
     * 6. TOTAL YA PAGADO
     * ========================================================
     *
     * Solo pagos confirmados como "paid".
     * Los pending no reducen la deuda.
     */
    const paidPayments =
      await db
        .select({
          amount:
            payments.amount,
        })
        .from(
          payments
        )
        .where(
          and(
            eq(
              payments.sessionId,
              session.id
            ),
            eq(
              payments.establishmentId,
              session.establishmentId
            ),
            eq(
              payments.status,
              "paid"
            )
          )
        );

    const paid =
      roundMoney(
        paidPayments.reduce(
          (
            sum,
            payment
          ) =>
            sum +
            Number(
              payment.amount
            ),
          0
        )
      );

    const pending =
      roundMoney(
        total -
          paid
      );

    if (
      pending <= 0
    ) {
      return ApiResponse.error(
        "La cuenta ya está completamente pagada.",
        400
      );
    }

    /*
     * ========================================================
     * 7. CREAR PAGO
     * ========================================================
     *
     * PaymentService vuelve a validar:
     *
     * - sesión
     * - importe
     * - saldo pendiente
     *
     * El pago nace SIEMPRE como "pending".
     */
              let payment =
      body.method ===
        "card"
        ? await PaymentService
            .getOrCreatePendingGuestCardPayment({
              sessionId:
                session.id,

              establishmentId:
                session.establishmentId,

              amount:
                pending.toFixed(
                  2
                ),
            })
        : await PaymentService.create({
            sessionId:
              session.id,

            amount:
              pending.toFixed(
                2
              ),

            method:
              body.method,

            metadata: {
              source:
                "guest_checkout",
            },
          });

    let stripe:
      {
        clientSecret: string;
        publishableKey: string;
        paymentIntentId: string;
      } | null =
        null;

    if (
      body.method ===
        "card"
    ) {
      let paymentIntent;

      if (
        payment
          .stripePaymentIntentId
      ) {
        paymentIntent =
          await StripeService
            .getClient()
            .paymentIntents
            .retrieve(
              payment
                .stripePaymentIntentId
            );
      } else {
        paymentIntent =
          await StripeService
            .createPaymentIntent({
              paymentId:
                payment.id,

              sessionId:
                session.id,

              establishmentId:
                session.establishmentId,

              amount:
                payment.amount,

              currency:
                establishment.currency ??
                "EUR",
            });

        const linkedPayment =
          await PaymentService
            .attachStripePaymentIntent(
              payment.id,
              session.establishmentId,
              paymentIntent.id
            );

        if (
          !linkedPayment
        ) {
          throw new Error(
            "STRIPE_PAYMENT_LINK_FAILED"
          );
        }

        payment =
          linkedPayment;
      }

      if (
        !paymentIntent
          .client_secret
      ) {
        throw new Error(
          "STRIPE_CLIENT_SECRET_MISSING"
        );
      }

      stripe = {
        clientSecret:
          paymentIntent
            .client_secret,

        publishableKey:
          StripeService
            .getPublishableKey(),

        paymentIntentId:
          paymentIntent.id,
      };
    }


    /*
     * ========================================================
     * 8. RESPUESTA SEGURA
     * ========================================================
     *
     * Importante:
     *
     * Esto NO significa que el pago esté confirmado.
     *
     * - cash:
     *   debe confirmarlo personal autorizado.
     *
     * - card / wallets:
     *   posteriormente Stripe confirmará mediante webhook.
     *
     * - otros:
     *   requerirán su integración correspondiente.
     */
    return ApiResponse.success(
      {
        paymentId:
          payment.id,

        sessionId:
          session.id,

        method:
          payment.method,

        displayName:
          paymentMethod.displayName,

        amount:
          payment.amount,

        status:
          payment.status,

        currency:
          establishment.currency,

        requiresConfirmation:
          true,

          stripe,
      },
      "Solicitud de pago creada correctamente.",
      201
    );
  } catch (
    error: unknown
  ) {
    Logger.error(
      "Error procesando checkout público.",
      error
    );

    if (
      error instanceof
        z.ZodError
    ) {
      return ApiResponse.error(
        "Datos de checkout inválidos.",
        400,
        error.issues
      );
    }

    if (
      error instanceof
      Error
    ) {
      const businessErrors = [
        "La sesión no existe.",
        "La sesión ya está cerrada.",
        "La división de cuenta no existe.",
        "La división de cuenta no pertenece a esta sesión.",
        "El importe del pago debe ser mayor que cero.",
        "La sesión no tiene ningún importe pendiente.",
      ];

      if (
        businessErrors.includes(
          error.message
        ) ||
        error.message.startsWith(
          "El importe del pago"
        )
      ) {
        return ApiResponse.error(
          error.message,
          400
        );
      }
    }

    return ApiResponse.error(
      "Error procesando el checkout.",
      500
    );
  }
}
