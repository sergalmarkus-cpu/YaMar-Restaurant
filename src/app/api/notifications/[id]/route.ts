import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  NotificationUpdateSchema,
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

function parseNotificationId(
  value: string
): number | null {
  const id =
    Number(
      value
    );

  if (
    !Number.isInteger(
      id
    ) ||
    id <= 0
  ) {
    return null;
  }

  return id;
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
    error instanceof Error &&
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
  request: NextRequest,
  {
    params,
  }: RouteParams
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

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseNotificationId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de notificación no válido.",
        400
      );
    }

    const notification =
      await NotificationService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !notification
    ) {
      return ApiResponse.error(
        "Notificación no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      notification,
      "Notificación obtenida correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo notificación.",
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
      "Error obteniendo notificación.",
      500
    );
  }
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: RouteParams
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
        "No tienes permisos para actualizar notificaciones.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseNotificationId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de notificación no válido.",
        400
      );
    }

    const body =
      NotificationUpdateSchema.parse(
        await request.json()
      );

    const notification =
      await NotificationService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
        );

    if (
      !notification
    ) {
      return ApiResponse.error(
        "Notificación no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      notification,
      "Notificación actualizada correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando notificación.",
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
      "Error actualizando notificación.",
      500
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: RouteParams
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
        "No tienes permisos para eliminar notificaciones.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseNotificationId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de notificación no válido.",
        400
      );
    }

    const deleted =
      await NotificationService
        .deleteForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !deleted
    ) {
      return ApiResponse.error(
        "Notificación no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Notificación eliminada correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error eliminando notificación.",
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
      "Error eliminando notificación.",
      500
    );
  }
}