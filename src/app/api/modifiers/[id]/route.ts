import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  ModifierUpdateSchema,
} from "@/validations/modifier.validation";

import {
  ModifierService,
} from "@/services/modifier.service";

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
  role: string
): role is (typeof MANAGEMENT_ROLES)[number] {
  return MANAGEMENT_ROLES.includes(
    role as (typeof MANAGEMENT_ROLES)[number]
  );
}

function parseModifierId(
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
      !isManagementRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar modificadores.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseModifierId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de modificador no válido.",
        400
      );
    }

    const modifier =
      await ModifierService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !modifier
    ) {
      return ApiResponse.error(
        "Modificador no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      modifier,
      "Modificador obtenido correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo modificador.",
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
      "Error obteniendo modificador.",
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
      !isManagementRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para actualizar modificadores.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseModifierId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de modificador no válido.",
        400
      );
    }

    const body =
      ModifierUpdateSchema.parse(
        await request.json()
      );

    const modifier =
      await ModifierService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
        );

    if (
      !modifier
    ) {
      return ApiResponse.error(
        "Modificador no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      modifier,
      "Modificador actualizado correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando modificador.",
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
        "PRODUCT_NOT_FOUND"
    ) {
      return ApiResponse.error(
        "Producto no encontrado.",
        404
      );
    }

    return ApiResponse.error(
      "Error actualizando modificador.",
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
      !isManagementRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para eliminar modificadores.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseModifierId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de modificador no válido.",
        400
      );
    }

    const modifier =
      await ModifierService
        .deleteForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !modifier
    ) {
      return ApiResponse.error(
        "Modificador no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Modificador eliminado correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error eliminando modificador.",
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
      "Error eliminando modificador.",
      500
    );
  }
}