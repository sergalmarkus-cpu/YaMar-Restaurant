import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  ReceiptUpdateSchema,
} from "@/validations/receipt.validation";

import {
  ReceiptService,
} from "@/services/receipt.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  RouteParams,
} from "@/types/api";

const RECEIPT_READ_ROLES = [
  "admin",
  "manager",
  "cashier",
] as const;

const RECEIPT_UPDATE_ROLES = [
  "admin",
  "manager",
  "cashier",
] as const;

const RECEIPT_DELETE_ROLES = [
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

function parseReceiptId(
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
        RECEIPT_READ_ROLES
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar recibos.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseReceiptId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de recibo no válido.",
        400
      );
    }

    const receipt =
      await ReceiptService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !receipt
    ) {
      return ApiResponse.error(
        "Recibo no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      receipt,
      "Recibo obtenido correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo recibo.",
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
      "Error obteniendo recibo.",
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
        RECEIPT_UPDATE_ROLES
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para actualizar recibos.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseReceiptId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de recibo no válido.",
        400
      );
    }

    const body =
      ReceiptUpdateSchema.parse(
        await request.json()
      );

    const receipt =
      await ReceiptService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
        );

    if (
      !receipt
    ) {
      return ApiResponse.error(
        "Recibo no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      receipt,
      "Recibo actualizado correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando recibo.",
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
      "Error actualizando recibo.",
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
        RECEIPT_DELETE_ROLES
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para eliminar recibos.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseReceiptId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de recibo no válido.",
        400
      );
    }

    const receipt =
      await ReceiptService
        .deleteForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !receipt
    ) {
      return ApiResponse.error(
        "Recibo no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Recibo eliminado correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error eliminando recibo.",
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
      "Error eliminando recibo.",
      500
    );
  }
}