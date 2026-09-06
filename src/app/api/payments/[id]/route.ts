import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  PaymentUpdateSchema,
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

const PAYMENT_READ_ROLES = [
  "admin",
  "manager",
  "cashier",
] as const;

const PAYMENT_UPDATE_ROLES = [
  "admin",
  "manager",
  "cashier",
] as const;

const PAYMENT_DELETE_ROLES = [
  "admin",
  "manager",
] as const;

function hasRole<
  T extends readonly string[]
>(
  role: string,
  roles: T
): role is T[number] {
  return roles.includes(
    role as T[number]
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

export async function GET(
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
      !hasRole(
        authUser.role,
        PAYMENT_READ_ROLES
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar pagos.",
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

    return ApiResponse.success(
      payment,
      "Pago obtenido correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo pago.",
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
      "Error obteniendo pago.",
      500
    );
  }
}

export async function PUT(
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
      !hasRole(
        authUser.role,
        PAYMENT_UPDATE_ROLES
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para actualizar pagos.",
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
      PaymentUpdateSchema.parse(
        await request.json()
      );

    const payment =
      await PaymentService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
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
      "Pago actualizado correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando pago.",
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
      "Error actualizando pago.",
      500
    );
  }
}

export async function DELETE(
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
      !hasRole(
        authUser.role,
        PAYMENT_DELETE_ROLES
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para eliminar pagos.",
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
        .deleteForEstablishment(
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

    return ApiResponse.success(
      null,
      "Pago eliminado correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error eliminando pago.",
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
      "Error eliminando pago.",
      500
    );
  }
}