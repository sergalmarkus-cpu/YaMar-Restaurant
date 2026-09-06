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
  DashboardService,
} from "@/services/dashboard.service";

import {
  Logger,
} from "@/services/logger.service";

const DASHBOARD_ROLES = [
  "admin",
  "manager",
] as const;

function hasDashboardRole(
  role: string
): role is (typeof DASHBOARD_ROLES)[number] {
  return DASHBOARD_ROLES.includes(
    role as (typeof DASHBOARD_ROLES)[number]
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

export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    if (
      !hasDashboardRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar el dashboard.",
        403
      );
    }

    const dashboard =
      await DashboardService
        .getForEstablishment(
          authUser.establishmentId
        );

    if (
      !dashboard
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      dashboard,
      "Dashboard obtenido correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo dashboard.",
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
      "Error obteniendo dashboard.",
      500
    );
  }
}