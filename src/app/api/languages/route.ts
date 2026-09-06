import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  LanguageSettingsSchema,
} from "@/validations/language.validation";

import {
  LanguageService,
} from "@/services/language.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  SUPPORTED_LANGUAGES,
} from "@/config/languages";

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

function isAdmin(
  role: string
) {
  return (
    role ===
    "admin"
  );
}

/*
 * ============================================================
 * GET
 *
 * Devuelve la configuración lingüística exclusivamente
 * del establecimiento autenticado.
 * ============================================================
 */

export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    const settings =
      await LanguageService
        .getForEstablishment(
          authUser.establishmentId
        );

    if (
      !settings
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      {
        ...settings,

        supportedLanguages:
          SUPPORTED_LANGUAGES,
      },
      "Configuración de idiomas obtenida correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo configuración de idiomas.",
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
      "Error obteniendo configuración de idiomas.",
      500
    );
  }
}

/*
 * ============================================================
 * PUT
 *
 * Solo un administrador puede modificar los idiomas
 * habilitados del establecimiento.
 * ============================================================
 */

export async function PUT(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    if (
      !isAdmin(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permiso para modificar los idiomas del establecimiento.",
        403
      );
    }

    const body =
      LanguageSettingsSchema.parse(
        await request.json()
      );

    const settings =
      await LanguageService
        .updateForEstablishment(
          authUser.establishmentId,
          body
        );

    if (
      !settings
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      {
        ...settings,

        supportedLanguages:
          SUPPORTED_LANGUAGES,
      },
      "Configuración de idiomas actualizada correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando configuración de idiomas.",
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
        "Configuración de idiomas inválida.",
        400,
        error.issues
      );
    }

    return ApiResponse.error(
      "Error actualizando configuración de idiomas.",
      500
    );
  }
}