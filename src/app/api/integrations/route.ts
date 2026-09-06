import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  IntegrationService,
} from "@/services/integration.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

const INTEGRATION_READ_ROLES = [
  "admin",
  "manager",
] as const;

function hasIntegrationReadRole(
  role: string
): role is (
  typeof INTEGRATION_READ_ROLES
)[number] {
  return (
    INTEGRATION_READ_ROLES.includes(
      role as (
        typeof INTEGRATION_READ_ROLES
      )[number]
    )
  );
}

function handleAuthError(
  error: unknown
) {
  if (
    !(
      error instanceof
      ApiAuthError
    )
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
 * ============================================================
 * GET /api/integrations
 * ============================================================
 *
 * Devuelve exclusivamente el estado de las integraciones
 * del establecimiento autenticado.
 *
 * IMPORTANTE:
 * nunca devuelve secretos, tokens, API keys ni credenciales.
 */
export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    if (
      !hasIntegrationReadRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permiso para consultar las integraciones.",
        403
      );
    }

    const integrations =
      await IntegrationService
        .getStatusForEstablishment(
          authUser.establishmentId
        );

    if (
      !integrations
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      integrations,
      "Integraciones obtenidas correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo integraciones.",
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
      "Error obteniendo integraciones.",
      500
    );
  }
}