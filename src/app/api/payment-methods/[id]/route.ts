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

import {
  PaymentMethodUpdateSchema,
} from "@/validations/payment-method.validation";

import {
  RouteParams,
} from "@/types/api";

const PAYMENT_METHOD_UPDATE_ROLES = [
  "admin",
  "manager",
] as const;

function hasPaymentMethodUpdateRole(
  role: string
): role is (typeof PAYMENT_METHOD_UPDATE_ROLES)[number] {
  return PAYMENT_METHOD_UPDATE_ROLES.includes(
    role as
      (typeof PAYMENT_METHOD_UPDATE_ROLES)[number]
  );
}

function parsePaymentMethodId(
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

export async function PATCH(
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
      !hasPaymentMethodUpdateRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para modificar los métodos de pago.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parsePaymentMethodId(
        rawId
      );

    if (
      id ===
      null
    ) {
      return ApiResponse.error(
        "ID de método de pago no válido.",
        400
      );
    }

    const body =
      PaymentMethodUpdateSchema.parse(
        await request.json()
      );

    const method =
      await PaymentMethodService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
        );

    if (
      !method
    ) {
      return ApiResponse.error(
        "Método de pago no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      method,
      "Método de pago actualizado correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando método de pago.",
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
      error?.name ===
      "ZodError"
    ) {
      return ApiResponse.error(
        "Datos inválidos.",
        400,
        error.issues
      );
    }

    return ApiResponse.error(
      "Error actualizando método de pago.",
      500
    );
  }
}