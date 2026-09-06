import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  AnalyticsService,
} from "@/services/analytics.service";

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

function parseAnalyticsId(
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
    id <=
      0
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
      !isManagementRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar analíticas.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseAnalyticsId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de evento analítico no válido.",
        400
      );
    }

    const event =
      await AnalyticsService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !event
    ) {
      return ApiResponse.error(
        "Evento analítico no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      event,
      "Evento analítico obtenido correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo evento analítico.",
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
      "Error obteniendo evento analítico.",
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

    /*
     * Solo admin puede borrar históricos.
     */
    if (
      authUser.role !==
      "admin"
    ) {
      return ApiResponse.error(
        "No tienes permisos para eliminar eventos analíticos.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseAnalyticsId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de evento analítico no válido.",
        400
      );
    }

    const deleted =
      await AnalyticsService
        .deleteForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !deleted
    ) {
      return ApiResponse.error(
        "Evento analítico no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Evento analítico eliminado correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error eliminando evento analítico.",
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
      "Error eliminando evento analítico.",
      500
    );
  }
}