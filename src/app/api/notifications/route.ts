import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  NotificationCreateSchema,
} from "@/validations/notification.validation";

import {
  NotificationService,
} from "@/services/notification.service";

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

function handleBusinessError(
  error: unknown
) {
  if (
    !(error instanceof Error)
  ) {
    return null;
  }

  if (
    error.message ===
    "NOTIFICATION_USER_NOT_FOUND"
  ) {
    return ApiResponse.error(
      "El usuario no existe o no pertenece al establecimiento.",
      404
    );
  }

  return null;
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
        "No tienes permisos para consultar notificaciones.",
        403
      );
    }

    const userIdParam =
      request.nextUrl.searchParams.get(
        "userId"
      );

    const readParam =
      request.nextUrl.searchParams.get(
        "read"
      );

    let userId:
      number |
      undefined;

    let read:
      boolean |
      undefined;

    if (
      userIdParam !==
      null
    ) {
      const parsed =
        Number(
          userIdParam
        );

      if (
        !Number.isInteger(
          parsed
        ) ||
        parsed <=
          0
      ) {
        return ApiResponse.error(
          "userId inválido.",
          400
        );
      }

      userId =
        parsed;
    }

    if (
      readParam !==
      null
    ) {
      if (
        readParam !==
          "true" &&
        readParam !==
          "false"
      ) {
        return ApiResponse.error(
          "El filtro read debe ser true o false.",
          400
        );
      }

      read =
        readParam ===
        "true";
    }

    const result =
      await NotificationService
        .listForEstablishment(
          authUser.establishmentId,
          {
            userId,
            read,
          }
        );

    return ApiResponse.success(
      result,
      "Notificaciones obtenidas correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo notificaciones.",
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

    const businessResponse =
      handleBusinessError(
        error
      );

    if (
      businessResponse
    ) {
      return businessResponse;
    }

    return ApiResponse.error(
      "Error obteniendo notificaciones.",
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
        "No tienes permisos para crear notificaciones.",
        403
      );
    }

    const body =
      NotificationCreateSchema.parse(
        await request.json()
      );

    const notification =
      await NotificationService
        .createForEstablishment(
          authUser.establishmentId,
          body
        );

    return ApiResponse.success(
      notification,
      "Notificación creada correctamente.",
      201
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error creando notificación.",
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

    const businessResponse =
      handleBusinessError(
        error
      );

    if (
      businessResponse
    ) {
      return businessResponse;
    }

    return ApiResponse.error(
      "Error creando notificación.",
      500
    );
  }
}