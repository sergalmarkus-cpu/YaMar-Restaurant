import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  AreaCreateSchema,
} from "@/validations/area.validation";

import {
  AreaService,
} from "@/services/area.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

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

    const result =
      await AreaService
        .listForEstablishment(
          authUser.establishmentId
        );

    return ApiResponse.success(
      result,
      "Áreas obtenidas correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo áreas.",
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
      "Error obteniendo áreas.",
      500
    );
  }
}

export async function POST(
  request: NextRequest
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
        "No tienes permiso para crear áreas.",
        403
      );
    }

    const body =
      AreaCreateSchema.parse(
        await request.json()
      );

    const area =
      await AreaService
        .createForEstablishment(
          authUser.establishmentId,
          body
        );

    return ApiResponse.success(
      area,
      "Área creada correctamente.",
      201
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error creando área.",
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
      "Error creando área.",
      500
    );
  }
}