import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  MenuScheduleUpdateSchema,
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

function parseScheduleId(
  id: string
): number | null {
  const scheduleId =
    Number(id);

  if (
    !Number.isInteger(
      scheduleId
    ) ||
    scheduleId <= 0
  ) {
    return null;
  }

  return scheduleId;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    const { id } =
      await params;

    const scheduleId =
      parseScheduleId(id);

    if (
      scheduleId === null
    ) {
      return ApiResponse.error(
        "El ID del horario no es válido.",
        400
      );
    }

    const schedule =
      await MenuScheduleService.getById(
        scheduleId,
        authUser.establishmentId
      );

    if (!schedule) {
      return ApiResponse.error(
        "Horario no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      schedule,
      "Horario obtenido correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo horario de menú.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error obteniendo horario de menú.",
      500
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
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
        "No tienes permisos para actualizar horarios.",
        403
      );
    }

    const { id } =
      await params;

    const scheduleId =
      parseScheduleId(id);

    if (
      scheduleId === null
    ) {
      return ApiResponse.error(
        "El ID del horario no es válido.",
        400
      );
    }

    const body =
      MenuScheduleUpdateSchema.parse(
        await request.json()
      );

    const schedule =
      await MenuScheduleService.update(
        scheduleId,
        body,
        authUser.establishmentId
      );

    if (!schedule) {
      return ApiResponse.error(
        "Horario no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      schedule,
      "Horario actualizado correctamente."
    );
  } catch (error: any) {
    Logger.error(
      "Error actualizando horario de menú.",
      error
    );

    const authResponse =
      handleAuthError(error);

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
      error instanceof Error
    ) {
      if (
        error.message ===
        "MENU_NOT_FOUND"
      ) {
        return ApiResponse.error(
          "Menú no encontrado.",
          404
        );
      }

      if (
        error.message ===
        "INVALID_TIME_RANGE"
      ) {
        return ApiResponse.error(
          "La hora de apertura y cierre no pueden ser iguales.",
          400
        );
      }
    }

    return ApiResponse.error(
      "Error actualizando horario de menú.",
      500
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
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

    const { id } =
      await params;

    const scheduleId =
      parseScheduleId(id);

    if (
      scheduleId === null
    ) {
      return ApiResponse.error(
        "El ID del horario no es válido.",
        400
      );
    }

    const deleted =
      await MenuScheduleService.delete(
        scheduleId,
        authUser.establishmentId
      );

    if (!deleted) {
      return ApiResponse.error(
        "Horario no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Horario eliminado correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error eliminando horario de menú.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error eliminando horario de menú.",
      500
    );
  }
}