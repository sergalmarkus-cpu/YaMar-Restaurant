import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  AdminUpdateProductSchema,
} from "@/validations/product.validation";

import {
  ProductService,
} from "@/services/product.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  RouteParams,
} from "@/types/api";

const MANAGEMENT_ROLES = [
  "admin",
  "manager",
] as const;

function isManagementRole(
  role:
    string
): role is (typeof MANAGEMENT_ROLES)[number] {
  return MANAGEMENT_ROLES.includes(
    role as (typeof MANAGEMENT_ROLES)[number]
  );
}

function parseProductId(
  value:
    string
): number | null {
  const id =
    Number(
      value
    );

  if (
    !Number.isInteger(
      id
    ) ||
    id <=
      0
  ) {
    return null;
  }

  return id;
}

function handleAuthError(
  error:
    unknown
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
  request:
    NextRequest,
  {
    params,
  }:
    RouteParams
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    const {
      id:
        rawId,
    } =
      await params;

    const id =
      parseProductId(
        rawId
      );

    if (
      id ===
      null
    ) {
      return ApiResponse.error(
        "ID de producto no válido.",
        400
      );
    }

    const product =
      await ProductService.getByIdForEstablishment(
        id,
        authUser.establishmentId
      );

    if (
      !product
    ) {
      return ApiResponse.error(
        "Producto no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      product,
      "Producto obtenido correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo producto.",
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
      "Error obteniendo producto.",
      500
    );
  }
}

/*
 * ==========================================================
 * PUT
 * ==========================================================
 */

export async function PUT(
  request:
    NextRequest,
  {
    params,
  }:
    RouteParams
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    if (
      !isManagementRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para actualizar productos.",
        403
      );
    }

    const {
      id:
        rawId,
    } =
      await params;

    const id =
      parseProductId(
        rawId
      );

    if (
      id ===
      null
    ) {
      return ApiResponse.error(
        "ID de producto no válido.",
        400
      );
    }

    const body =
      AdminUpdateProductSchema.parse(
        await request.json()
      );

    const product =
      await ProductService.updateForEstablishment(
        id,
        authUser.establishmentId,
        body
      );

    if (
      !product
    ) {
      return ApiResponse.error(
        "Producto no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      product,
      "Producto actualizado correctamente."
    );
  } catch (
    error:
      any
  ) {
    Logger.error(
      "Error actualizando producto.",
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
      error.message ===
        "CATEGORY_NOT_FOUND"
    ) {
      return ApiResponse.error(
        "Categoría no encontrada.",
        404
      );
    }

    return ApiResponse.error(
      "Error actualizando producto.",
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
  request:
    NextRequest,
  {
    params,
  }:
    RouteParams
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    if (
      !isManagementRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para eliminar productos.",
        403
      );
    }

    const {
      id:
        rawId,
    } =
      await params;

    const id =
      parseProductId(
        rawId
      );

    if (
      id ===
      null
    ) {
      return ApiResponse.error(
        "ID de producto no válido.",
        400
      );
    }

    const deleted =
      await ProductService.deleteForEstablishment(
        id,
        authUser.establishmentId
      );

    if (
      !deleted
    ) {
      return ApiResponse.error(
        "Producto no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Producto eliminado correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error eliminando producto.",
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
      "Error eliminando producto.",
      500
    );
  }
}