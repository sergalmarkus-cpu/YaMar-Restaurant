import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  UpdateTableSchema,
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

function parseTableId(
  id: string
) {
  const numericId =
    Number(id);

  if (
    !Number.isInteger(
      numericId
    ) ||
    numericId <= 0
  ) {
    return null;
  }

  return numericId;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const authUser =
      await authenticateRequest(request);

    const { id } =
      await params;

    const tableId =
      parseTableId(id);

    if (tableId === null) {
      return ApiResponse.error(
        "ID de mesa inválido.",
        400
      );
    }

    const table =
      await TableService.getById(
        tableId,
        authUser.establishmentId
      );

    if (!table) {
      return ApiResponse.error(
        "Mesa no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      table,
      "Mesa obtenida correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo mesa.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error obteniendo mesa.",
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
      await authenticateRequest(request);

    if (
      !isManagementRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permiso para actualizar mesas.",
        403
      );
    }

    const { id } =
      await params;

    const tableId =
      parseTableId(id);

    if (tableId === null) {
      return ApiResponse.error(
        "ID de mesa inválido.",
        400
      );
    }

    const body =
      UpdateTableSchema.parse(
        await request.json()
      );

    const table =
      await TableService.update(
        tableId,
        authUser.establishmentId,
        body
      );

    if (!table) {
      return ApiResponse.error(
        "Mesa no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      table,
      "Mesa actualizada correctamente."
    );
  } catch (error: any) {
    Logger.error(
      "Error actualizando mesa.",
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
      "Error actualizando mesa.",
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
      await authenticateRequest(request);

    if (
      !isManagementRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permiso para eliminar mesas.",
        403
      );
    }

    const { id } =
      await params;

    const tableId =
      parseTableId(id);

    if (tableId === null) {
      return ApiResponse.error(
        "ID de mesa inválido.",
        400
      );
    }

    const table =
      await TableService.delete(
        tableId,
        authUser.establishmentId
      );

    if (!table) {
      return ApiResponse.error(
        "Mesa no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Mesa eliminada correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error eliminando mesa.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    if (
      error instanceof Error &&
      error.message ===
        "No se puede eliminar una mesa que tiene una sesión activa."
    ) {
      return ApiResponse.error(
        error.message,
        409
      );
    }

    return ApiResponse.error(
      "Error eliminando mesa.",
      500
    );
  }
}