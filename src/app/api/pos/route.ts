import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  PosCreateSchema,
} from "@/validations/pos.validation";

import {
  PosService,
} from "@/services/pos.service";

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

  return ApiResponse.error(
    error.message,
    401
  );
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
      await PosService
        .listForEstablishment(
          authUser.establishmentId
        );

    return ApiResponse.success(
      result,
      "Puntos de venta obtenidos correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo puntos de venta.",
      error
    );

    const auth =
      handleAuthError(
        error
      );

    if (
      auth
    ) {
      return auth;
    }

    return ApiResponse.error(
      "Error obteniendo puntos de venta.",
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
        "No tienes permisos para crear puntos de venta.",
        403
      );
    }

    const body =
      PosCreateSchema.parse(
        await request.json()
      );

    const result =
      await PosService
        .createForEstablishment(
          authUser.establishmentId,
          body
        );

    return ApiResponse.success(
      result,
      "Punto de venta creado correctamente.",
      201
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error creando punto de venta.",
      error
    );

    const auth =
      handleAuthError(
        error
      );

    if (
      auth
    ) {
      return auth;
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
      error instanceof Error &&
      error.message ===
        "POS_MENU_NOT_FOUND"
    ) {
      return ApiResponse.error(
        "Uno o más menús no existen o no pertenecen al establecimiento.",
        404
      );
    }

    return ApiResponse.error(
      "Error creando punto de venta.",
      500
    );
  }
}