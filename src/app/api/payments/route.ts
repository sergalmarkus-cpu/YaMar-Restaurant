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
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

const PAYMENT_READ_ROLES = [
  "admin",
  "manager",
  "cashier",
] as const;

function hasPaymentReadRole(
  role: string
): role is (typeof PAYMENT_READ_ROLES)[number] {
  return PAYMENT_READ_ROLES.includes(
    role as (typeof PAYMENT_READ_ROLES)[number]
  );
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

/*
 * ==========================================================
 * GET - LISTAR PAGOS
 * ==========================================================
 *
 * Ruta exclusivamente administrativa.
 *
 * El establecimiento procede siempre del JWT.
 * Nunca se acepta establishmentId desde el cliente.
 *
 * Roles autorizados:
 * - admin
 * - manager
 * - cashier
 * ==========================================================
 */

export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    if (
      !hasPaymentReadRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar pagos.",
        403
      );
    }

    const sessionId =
      request.nextUrl.searchParams.get(
        "sessionId"
      ) ??
      undefined;

    const payments =
      await PaymentService
        .listForEstablishment(
          authUser.establishmentId,
          sessionId
        );

    return ApiResponse.success(
      payments,
      "Pagos obtenidos correctamente."
    );
  } catch (
    error: unknown
  ) {
    Logger.error(
      "Error obteniendo pagos.",
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

    return ApiResponse.error(
      "Error obteniendo pagos.",
      500
    );
  }
}

/*
 * ==========================================================
 * CREACIÓN DE PAGOS
 * ==========================================================
 *
 * Deliberadamente NO existe POST /api/payments.
 *
 * Un cliente nunca debe poder crear directamente un pago
 * indicando sessionId, amount, method, establishmentId,
 * billSplitId u otros datos financieros.
 *
 * Flujo público permitido:
 *
 *   /api/guest/checkout
 *
 * Ese endpoint obtiene el establecimiento desde la sesión,
 * calcula el importe pendiente en servidor y valida el
 * método de pago habilitado.
 *
 * Las confirmaciones posteriores se realizan mediante
 * endpoints protegidos o, en el caso de proveedores
 * externos, mediante webhooks verificados.
 * ==========================================================
 */