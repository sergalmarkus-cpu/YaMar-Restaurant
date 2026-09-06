import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  MenuScheduleCreateSchema,
} from "@/validations/menu-schedule.validation";

import {
  MenuScheduleService,
} from "@/services/menu-schedule.service";

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
  if (!(error instanceof ApiAuthError)) {
    return null;
  }

  switch (error.message) {
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

    const { searchParams } =
      new URL(request.url);

    const menuIdParam =
      searchParams.get(
        "menuId"
      );

    const menuId =
      menuIdParam !== null
        ? Number(
            menuIdParam
          )
        : undefined;

    if (
      menuId !== undefined &&
      (
        !Number.isInteger(
          menuId
        ) ||
        menuId <= 0
      )
    ) {
      return ApiResponse.error(
        "El menuId no es válido.",
        400
      );
    }

    const schedules =
      await MenuScheduleService.list(
        authUser.establishmentId,
        menuId
      );

    return ApiResponse.success(
      schedules,
      "Horarios obtenidos correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo horarios de menú.",
      error
    );

    const authResponse =
      handleAuthError(
        error
      );

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error obteniendo horarios de menú.",
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
        "No tienes permisos para crear horarios.",
        403
      );
    }

    const body =
      MenuScheduleCreateSchema.parse(
        await request.json()
      );

    const schedule =
      await MenuScheduleService.create(
        body,
        authUser.establishmentId
      );

    return ApiResponse.success(
      schedule,
      "Horario creado correctamente.",
      201
    );
  } catch (error: any) {
    Logger.error(
      "Error creando horario de menú.",
      error
    );

    const authResponse =
      handleAuthError(
        error
      );

    if (authResponse) {
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
      error instanceof Error &&
      error.message ===
        "MENU_NOT_FOUND"
    ) {
      return ApiResponse.error(
        "Menú no encontrado.",
        404
      );
    }

    return ApiResponse.error(
      "Error creando horario de menú.",
      500
    );
  }
}

export async function DELETE(
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
        "No tienes permisos para eliminar horarios.",
        403
      );
    }

    const { searchParams } =
      new URL(request.url);

    const menuIdParam =
      searchParams.get(
        "menuId"
      );

    if (
      menuIdParam === null
    ) {
      return ApiResponse.error(
        "El menuId es obligatorio.",
        400
      );
    }

    const menuId =
      Number(
        menuIdParam
      );

    if (
      !Number.isInteger(
        menuId
      ) ||
      menuId <= 0
    ) {
      return ApiResponse.error(
        "El menuId no es válido.",
        400
      );
    }

    const deleted =
      await MenuScheduleService.deleteAll(
        menuId,
        authUser.establishmentId
      );

    return ApiResponse.success(
      {
        deletedCount:
          deleted.length,
      },
      deleted.length === 0
        ? "No había horarios configurados para este menú."
        : `${deleted.length} horario${
            deleted.length === 1
              ? ""
              : "s"
          } eliminado${
            deleted.length === 1
              ? ""
              : "s"
          } correctamente.`
    );
  } catch (error) {
    Logger.error(
      "Error eliminando todos los horarios de menú.",
      error
    );

    const authResponse =
      handleAuthError(
        error
      );

    if (authResponse) {
      return authResponse;
    }

    if (
      error instanceof Error &&
      error.message ===
        "MENU_NOT_FOUND"
    ) {
      return ApiResponse.error(
        "Menú no encontrado.",
        404
      );
    }

    return ApiResponse.error(
      "Error eliminando todos los horarios de menú.",
      500
    );
  }
}