import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  ApplyMenuScheduleSchema,
} from "@/validations/menu-schedule.validation";

import {
  MenuScheduleService,
} from "@/services/menu-schedule.service";

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
        "No tienes permisos para aplicar horarios.",
        403
      );
    }

    const body =
      ApplyMenuScheduleSchema.parse(
        await request.json()
      );

    const uniqueDays = [
      ...new Set(
        body.daysOfWeek
      ),
    ];

    const schedules =
      await MenuScheduleService.applyToDays(
        body.menuId,
        uniqueDays,
        body.openTime,
        body.closeTime,
        body.active,
        authUser.establishmentId
      );

    return ApiResponse.success(
      schedules,
      "Horario aplicado correctamente."
    );
  } catch (error: any) {
    Logger.error(
      "Error aplicando horario a varios días.",
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
      switch (error.message) {
        case "MENU_NOT_FOUND":
          return ApiResponse.error(
            "Menú no encontrado.",
            404
          );

        case "INVALID_TIME_RANGE":
          return ApiResponse.error(
            "La hora de apertura y cierre no pueden ser iguales.",
            400
          );

        default:
          break;
      }
    }

    return ApiResponse.error(
      "Error aplicando horario a varios días.",
      500
    );
  }
}