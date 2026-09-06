import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  Logger,
} from "@/services/logger.service";

import {
  PaymentMethodService,
} from "@/services/payment-method.service";

const PAYMENT_METHOD_ROLES = [
  "admin",
  "manager",
] as const;

function hasPaymentMethodRole(
  role: string
): role is (typeof PAYMENT_METHOD_ROLES)[number] {
  return PAYMENT_METHOD_ROLES.includes(
    role as
      (typeof PAYMENT_METHOD_ROLES)[number]
  );
}

function handleAuthError(
  error: unknown
) {
  if (
    !(error instanceof
      ApiAuthError)
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

export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    if (
      !hasPaymentMethodRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar los métodos de pago.",
        403
      );
    }

    const methods =
      await PaymentMethodService
        .listForEstablishment(
          authUser.establishmentId
        );

    if (
      methods ===
      null
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      methods,
      "Métodos de pago obtenidos correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo métodos de pago.",
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
      "Error obteniendo métodos de pago.",
      500
    );
  }
}