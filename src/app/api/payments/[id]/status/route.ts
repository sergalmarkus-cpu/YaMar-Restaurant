import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  PaymentStatusSchema,
} from "@/validations/payment.validation";

import {
  PaymentService,
} from "@/services/payment.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  RouteParams,
} from "@/types/api";

const PAYMENT_STATUS_ROLES = [
  "admin",
  "manager",
  "cashier",
] as const;

function hasPaymentStatusRole(
  role: string
): role is (typeof PAYMENT_STATUS_ROLES)[number] {
  return PAYMENT_STATUS_ROLES.includes(
    role as (typeof PAYMENT_STATUS_ROLES)[number]
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
      !hasPaymentStatusRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para cambiar el estado de pagos.",
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

    const body =
      await request.json();

    const status =
      PaymentStatusSchema.parse(
        body.status
      );

    const payment =
      await PaymentService
        .updateStatusForEstablishment(
          id,
          authUser.establishmentId,
          status
        );

    if (
      !payment
    ) {
      return ApiResponse.error(
        "Pago no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      payment,
      "Estado del pago actualizado correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando estado del pago.",
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
        "Estado de pago inválido.",
        400,
        error.issues
      );
    }

    if (
      error instanceof
        Error &&
      (
        error.message.startsWith(
          "No se puede cambiar el estado"
        ) ||
        error.message.startsWith(
          "El pago supera el total"
        )
      )
    ) {
      return ApiResponse.error(
        error.message,
        400
      );
    }

    return ApiResponse.error(
      "Error actualizando estado del pago.",
      500
    );
  }
}