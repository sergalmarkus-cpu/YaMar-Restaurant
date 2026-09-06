import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  CreateTableSchema,
} from "@/validations/table.validation";

import {
  TableService,
} from "@/services/table.service";

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

function handleAuthError(error: unknown) {
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
      await authenticateRequest(request);

    const {
      searchParams,
    } = new URL(request.url);

    const areaId =
      searchParams.get("areaId");

    const parsedAreaId =
      areaId !== null
        ? Number(areaId)
        : undefined;

    if (
      parsedAreaId !== undefined &&
      (
        !Number.isInteger(
          parsedAreaId
        ) ||
        parsedAreaId <= 0
      )
    ) {
      return ApiResponse.error(
        "areaId inválido.",
        400
      );
    }

    const tables =
      await TableService.list(
        authUser.establishmentId,
        parsedAreaId
      );

    return ApiResponse.success(
      tables,
      "Mesas obtenidas correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo mesas.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error obteniendo mesas.",
      500
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(request);

    if (
      !isManagementRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permiso para crear mesas.",
        403
      );
    }

    const body =
      CreateTableSchema.parse(
        await request.json()
      );

    const table =
      await TableService.create(
        authUser.establishmentId,
        body
      );

    return ApiResponse.success(
      table,
      "Mesa creada correctamente.",
      201
    );
  } catch (error: any) {
    Logger.error(
      "Error creando mesa.",
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
      const businessErrors = [
        "El establecimiento no existe.",
        "El establecimiento no está activo.",
        "La zona no existe.",
        "La zona no pertenece al establecimiento indicado.",
        "La zona no está activa.",
      ];

      if (
        businessErrors.includes(
          error.message
        )
      ) {
        return ApiResponse.error(
          error.message,
          400
        );
      }

      if (
        error.message ===
        "Ya existe una mesa con ese código en este establecimiento."
      ) {
        return ApiResponse.error(
          error.message,
          409
        );
      }
    }

    return ApiResponse.error(
      "Error creando mesa.",
      500
    );
  }
}