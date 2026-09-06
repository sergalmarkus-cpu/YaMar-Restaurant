import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  updateUserSchema,
} from "@/validations/user.validation";

import {
  UserService,
} from "@/services/user.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  Logger,
} from "@/services/logger.service";

import type {
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

function parseUserId(
  value: string
) {
  const id =
    Number(value);

  if (
    !Number.isInteger(id) ||
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

function handleUserError(
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
        "Usuario no encontrado.",
        404
      );

    case "EMAIL_ALREADY_EXISTS":
      return ApiResponse.error(
        "Ya existe un usuario con ese email.",
        409
      );

    case "ROLE_NOT_ALLOWED":
      return ApiResponse.error(
        "No tienes permiso para gestionar ese usuario o rol.",
        403
      );

    case "CANNOT_DEACTIVATE_SELF":
      return ApiResponse.error(
        "No puedes desactivar tu propio usuario.",
        409
      );

    case "CANNOT_DELETE_SELF":
      return ApiResponse.error(
        "No puedes eliminar tu propio usuario.",
        409
      );

    default:
      return null;
  }
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
        "No tienes permiso para consultar el personal.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const userId =
      parseUserId(
        rawId
      );

    if (
      userId === null
    ) {
      return ApiResponse.error(
        "ID de usuario inválido.",
        400
      );
    }

    const user =
      await UserService.getById(
        userId,
        authUser.establishmentId
      );

    return ApiResponse.success(
      user,
      "Usuario obtenido correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo usuario.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    const userResponse =
      handleUserError(error);

    if (userResponse) {
      return userResponse;
    }

    return ApiResponse.error(
      "Error obteniendo usuario.",
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
        "No tienes permiso para actualizar personal.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const userId =
      parseUserId(
        rawId
      );

    if (
      userId === null
    ) {
      return ApiResponse.error(
        "ID de usuario inválido.",
        400
      );
    }

    const body =
      updateUserSchema.parse(
        await request.json()
      );

    const user =
      await UserService.update(
        userId,
        body,
        authUser.establishmentId,
        authUser.userId,
        authUser.role
      );

    return ApiResponse.success(
      user,
      "Usuario actualizado correctamente."
    );
  } catch (error: any) {
    Logger.error(
      "Error actualizando usuario.",
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

    const userResponse =
      handleUserError(error);

    if (userResponse) {
      return userResponse;
    }

    return ApiResponse.error(
      "Error actualizando usuario.",
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
        "No tienes permiso para eliminar personal.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const userId =
      parseUserId(
        rawId
      );

    if (
      userId === null
    ) {
      return ApiResponse.error(
        "ID de usuario inválido.",
        400
      );
    }

    await UserService.remove(
      userId,
      authUser.establishmentId,
      authUser.userId,
      authUser.role
    );

    return ApiResponse.success(
      null,
      "Usuario eliminado correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error eliminando usuario.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    const userResponse =
      handleUserError(error);

    if (userResponse) {
      return userResponse;
    }

    return ApiResponse.error(
      "Error eliminando usuario.",
      500
    );
  }
}