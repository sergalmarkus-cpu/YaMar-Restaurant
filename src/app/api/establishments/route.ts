import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  EstablishmentService,
} from "@/services/establishment.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

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
 * Devuelve únicamente el establecimiento
 * asociado al usuario autenticado.
 *
 * Conservamos formato array porque la pantalla
 * administrativa ya trabaja con una lista.
 */
export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    const establishment =
      await EstablishmentService
        .getForAuthenticatedEstablishment(
          authUser.establishmentId
        );

    return ApiResponse.success(
      establishment
        ? [
            establishment,
          ]
        : [],
      "Establecimiento obtenido correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo establecimiento.",
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
      "Error obteniendo establecimiento.",
      500
    );
  }
}

/*
 * La creación de tenants no pertenece a un
 * administrador de establecimiento.
 *
 * Cuando exista un futuro rol de plataforma /
 * superadmin, deberá implementarse en una
 * superficie administrativa específica.
 */
export async function POST(
  request: NextRequest
) {
  try {
    await authenticateRequest(
      request
    );

    return ApiResponse.error(
      "La creación de establecimientos no está disponible para administradores de establecimiento.",
      403
    );
  } catch (
    error
  ) {
    Logger.error(
      "Intento de creación de establecimiento.",
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
      "Error procesando la solicitud.",
      500
    );
  }
}