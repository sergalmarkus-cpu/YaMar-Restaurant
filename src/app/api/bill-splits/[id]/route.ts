import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  BillSplitService,
} from "@/services/bill-split.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  RouteParams,
} from "@/types/api";

const BILL_SPLIT_READ_ROLES = [
  "admin",
  "manager",
  "cashier",
] as const;

const BILL_SPLIT_DELETE_ROLES = [
  "admin",
  "manager",
  "cashier",
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

function parseBillSplitId(
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

/*
 * ==========================================================
 * GET
 * ==========================================================
 */

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
        BILL_SPLIT_READ_ROLES
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar divisiones de cuenta.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseBillSplitId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de división de cuenta no válido.",
        400
      );
    }

    const billSplit =
      await BillSplitService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !billSplit
    ) {
      return ApiResponse.error(
        "División de cuenta no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      billSplit,
      "División de cuenta obtenida correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo división de cuenta.",
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
      "Error obteniendo división de cuenta.",
      500
    );
  }
}

/*
 * ==========================================================
 * DELETE
 * ==========================================================
 */

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
        BILL_SPLIT_DELETE_ROLES
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para eliminar divisiones de cuenta.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseBillSplitId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de división de cuenta no válido.",
        400
      );
    }

    const deleted =
      await BillSplitService
        .deleteForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !deleted
    ) {
      return ApiResponse.error(
        "División de cuenta no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "División de cuenta eliminada correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error eliminando división de cuenta.",
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
      "Error eliminando división de cuenta.",
      500
    );
  }
}