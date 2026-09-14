import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  createStaffShiftSchema,
} from "@/validations/staff-shift.validation";

import {
  StaffShiftService,
} from "@/services/staff-shift.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  Logger,
} from "@/services/logger.service";

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

function handleShiftError(
  error: unknown
) {
  if (
    !(error instanceof Error)
  ) {
    return null;
  }

  switch (error.message) {
    case "USER_NOT_FOUND":
      return ApiResponse.error(
        "Usuario autenticado no encontrado.",
        403
      );

    case "USER_INACTIVE":
      return ApiResponse.error(
        "El usuario autenticado está inactivo.",
        403
      );

    case "ESTABLISHMENT_ACCESS_DENIED":
      return ApiResponse.error(
        "No tienes acceso a este establecimiento.",
        403
      );

    case "ROLE_MISMATCH":
      return ApiResponse.error(
        "El rol de autenticación no coincide con el usuario.",
        403
      );

    case "SHIFT_USER_NOT_FOUND":
      return ApiResponse.error(
        "Empleado no encontrado.",
        404
      );

    case "SHIFT_USER_INACTIVE":
      return ApiResponse.error(
        "No se puede asignar un turno a un empleado inactivo.",
        409
      );

    case "ROLE_NOT_ALLOWED":
      return ApiResponse.error(
        "No tienes permiso para gestionar turnos de ese rol.",
        403
      );

    case "SHIFT_INVALID_DATE_RANGE":
      return ApiResponse.error(
        "La fecha de fin debe ser posterior a la fecha de inicio.",
        400
      );

    case "SHIFT_OVERLAP":
      return ApiResponse.error(
        "El empleado ya tiene otro turno que se solapa con este horario.",
        409
      );

    case "SHIFT_CREATE_FAILED":
      return ApiResponse.error(
        "No se pudo crear el turno.",
        500
      );

    default:
      return null;
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
      !isManagementRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permiso para consultar los turnos.",
        403
      );
    }

    const shifts =
      await StaffShiftService.list(
        authUser.establishmentId,
        authUser.userId,
        authUser.role
      );

    return ApiResponse.success(
      shifts,
      "Turnos obtenidos correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo turnos.",
      error
    );

    const authResponse =
      handleAuthError(
        error
      );

    if (authResponse) {
      return authResponse;
    }

    const shiftResponse =
      handleShiftError(
        error
      );

    if (shiftResponse) {
      return shiftResponse;
    }

    return ApiResponse.error(
      "Error obteniendo turnos.",
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
        "No tienes permiso para crear turnos.",
        403
      );
    }

    const body =
      createStaffShiftSchema.parse(
        await request.json()
      );

    const shift =
      await StaffShiftService.create(
        body,
        authUser.establishmentId,
        authUser.userId,
        authUser.role
      );

    return ApiResponse.success(
      shift,
      "Turno creado correctamente.",
      201
    );
  } catch (error: any) {
    Logger.error(
      "Error creando turno.",
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

    const shiftResponse =
      handleShiftError(
        error
      );

    if (shiftResponse) {
      return shiftResponse;
    }

    return ApiResponse.error(
      "Error creando turno.",
      500
    );
  }
}