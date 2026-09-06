import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  createUserSchema,
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
        "No tienes permiso para consultar el personal.",
        403
      );
    }

    const users =
      await UserService.list(
        authUser.establishmentId
      );

    return ApiResponse.success(
      users,
      "Personal obtenido correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo personal.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error obteniendo personal.",
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
        "No tienes permiso para crear personal.",
        403
      );
    }

    const body =
      createUserSchema.parse(
        await request.json()
      );

    const user =
      await UserService.create(
        body,
        authUser.establishmentId,
        authUser.role
      );

    return ApiResponse.success(
      user,
      "Usuario creado correctamente.",
      201
    );
  } catch (error: any) {
    Logger.error(
      "Error creando usuario.",
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
        case "EMAIL_ALREADY_EXISTS":
          return ApiResponse.error(
            "Ya existe un usuario con ese email.",
            409
          );

        case "ROLE_NOT_ALLOWED":
          return ApiResponse.error(
            "No tienes permiso para asignar ese rol.",
            403
          );
      }
    }

    return ApiResponse.error(
      "Error creando usuario.",
      500
    );
  }
}