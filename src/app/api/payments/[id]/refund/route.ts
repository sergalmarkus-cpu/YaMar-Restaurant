import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  PaymentService,
} from "@/services/payment.service";

import {
  StripeService,
} from "@/services/stripe.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  RouteParams,
} from "@/types/api";

const PAYMENT_REFUND_ROLES = [
  "admin",
  "manager",
  "cashier",
] as const;

function hasRefundRole(
  role: string
): role is (
  typeof PAYMENT_REFUND_ROLES
)[number] {
  return PAYMENT_REFUND_ROLES.includes(
    role as (
      typeof PAYMENT_REFUND_ROLES
    )[number]
  );
}

function parsePaymentId(
  value: string
): number | null {
  const id =
    Number(
      value
    );

  if (
    !Number.isInteger(
      id
    ) ||
    id <= 0
  ) {
    return null;
  }

  return id;
}

function handleAuthError(
  error: unknown
) {
  if (
    !(error instanceof ApiAuthError)
  ) {
    return null;
  }

  switch (
    error.message
  ) {
    case "AUTH_HEADER_MISSING":
      return ApiResponse.error(
        "Authentication required",
        401
      );

    case "AUTH_HEADER_INVALID":
      return ApiResponse.error(
        "Invalid authorization header",
        401
      );

    case "TOKEN_EXPIRED":
      return ApiResponse.error(
        "Authentication token expired",
        401
      );

    case "TOKEN_INVALID":
      return ApiResponse.error(
        "Invalid authentication token",
        401
      );

    default:
      return ApiResponse.error(
        "Authentication failed",
        401
      );
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: RouteParams
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    if (
      !hasRefundRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para reembolsar pagos.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parsePaymentId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de pago no válido.",
        400
      );
    }

    const payment =
      await PaymentService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !payment
    ) {
      return ApiResponse.error(
        "Pago no encontrado.",
        404
      );
    }

    if (
      payment.status ===
        "refunded"
    ) {
      return ApiResponse.success(
        {
          payment,
          alreadyRefunded:
            true,
        },
        "El pago ya está reembolsado."
      );
    }

    if (
      payment.status !==
        "paid"
    ) {
      return ApiResponse.error(
        "Solo se pueden reembolsar pagos confirmados.",
        400
      );
    }

    if (
      payment.method !==
        "card"
    ) {
      return ApiResponse.error(
        "Esta ruta solo permite reembolsar pagos Stripe con tarjeta.",
        400
      );
    }

    const paymentIntentId =
      payment
        .stripePaymentIntentId
        ?.trim();

    if (
      !paymentIntentId
    ) {
      return ApiResponse.error(
        "El pago no tiene un PaymentIntent de Stripe asociado.",
        400
      );
    }

    /*
     * Stripe es la autoridad del movimiento financiero.
     *
     * Esta llamada es idempotente mediante:
     * yamar-refund-{paymentId}
     */
    const stripeRefund =
      await StripeService
        .createFullRefund({
          paymentId:
            payment.id,

          sessionId:
            payment.sessionId,

          establishmentId:
            payment.establishmentId,

          paymentIntentId,
        });

    /*
     * Algunos métodos de pago pueden dejar un refund
     * temporalmente en estado pending.
     *
     * Mientras Stripe no diga succeeded, YaMar conserva
     * el pago como paid para no afirmar que el dinero
     * ya fue devuelto.
     */
    if (
      stripeRefund.status !==
        "succeeded"
    ) {
      Logger.info(
        "Reembolso Stripe pendiente de confirmación.",
        {
          paymentId:
            payment.id,

          stripeRefundId:
            stripeRefund.id,

          stripeRefundStatus:
            stripeRefund.status,
        }
      );

      return ApiResponse.success(
        {
          payment,
          refund: {
            id:
              stripeRefund.id,

            status:
              stripeRefund.status,
          },

          pendingConfirmation:
            true,
        },
        "Stripe ha recibido el reembolso y está pendiente de confirmación."
      );
    }

    /*
     * Solo llegamos aquí cuando Stripe confirma
     * que el reembolso ha sido realizado.
     *
     * El flag interno permite exclusivamente esta
     * transición autorizada por el proveedor.
     */
    const updated =
      await PaymentService
        .updateStatusForEstablishment(
          payment.id,
          payment.establishmentId,
          "refunded",
          {
            stripeRefundConfirmed:
              true,
          }
        );

    if (
      !updated
    ) {
      throw new Error(
        "PAYMENT_NOT_FOUND_AFTER_STRIPE_REFUND"
      );
    }

    Logger.info(
      "Pago Stripe reembolsado correctamente.",
      {
        paymentId:
          payment.id,

        stripePaymentIntentId:
          paymentIntentId,

        stripeRefundId:
          stripeRefund.id,

        stripeRefundStatus:
          stripeRefund.status,
      }
    );

    return ApiResponse.success(
      {
        payment:
          updated,

        refund: {
          id:
            stripeRefund.id,

          status:
            stripeRefund.status,

          amount:
            stripeRefund.amount,

          currency:
            stripeRefund.currency,
        },
      },
      "Pago reembolsado correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error reembolsando pago Stripe.",
      error
    );

    const authResponse =
      handleAuthError(
        error
      );

    if (
      authResponse
    ) {
      return authResponse;
    }

    if (
      error instanceof
        Error
    ) {
      if (
        error.message ===
        "STRIPE_REFUND_REQUIRED"
      ) {
        return ApiResponse.error(
          "Los pagos Stripe deben reembolsarse mediante la operación de reembolso de Stripe.",
          400
        );
      }

      if (
        error.message ===
        "STRIPE_NOT_CONFIGURED"
      ) {
        return ApiResponse.error(
          "Stripe no está configurado.",
          503
        );
      }
    }

    return ApiResponse.error(
      "No se pudo completar el reembolso.",
      500
    );
  }
}