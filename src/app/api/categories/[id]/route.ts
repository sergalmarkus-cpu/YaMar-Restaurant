import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import { CategoryUpdateSchema } from "@/validations/category.validation";

import { CategoryService } from "@/services/category.service";
import { Logger } from "@/services/logger.service";
import { ApiResponse } from "@/lib/api/ApiResponse";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const MANAGEMENT_ROLES = ["admin", "manager"] as const;

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

function parseId(
  id: string
): number | null {
  const parsed =
    Number(id);

  if (
    !Number.isInteger(parsed) ||
    parsed <= 0
  ) {
    return null;
  }

  return parsed;
}

// GET - Obtener una categoría
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const authUser =
      await authenticateRequest(request);

    const { id } =
      await params;

    const categoryId =
      parseId(id);

    if (categoryId === null) {
      return ApiResponse.error(
        "ID de categoría no válido.",
        400
      );
    }

    const category =
      await CategoryService.getById(
        categoryId,
        authUser.establishmentId
      );

    if (!category) {
      return ApiResponse.error(
        "Categoría no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      category,
      "Categoría obtenida correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo categoría.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error obteniendo categoría.",
      500
    );
  }
}

// PUT - Actualizar una categoría
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const authUser =
      await authenticateRequest(request);

    if (!isManagementRole(authUser.role)) {
      return ApiResponse.error(
        "You are not allowed to update categories",
        403
      );
    }

    const { id } =
      await params;

    const categoryId =
      parseId(id);

    if (categoryId === null) {
      return ApiResponse.error(
        "ID de categoría no válido.",
        400
      );
    }

    const existing =
      await CategoryService.getById(
        categoryId,
        authUser.establishmentId
      );

    if (!existing) {
      return ApiResponse.error(
        "Categoría no encontrada.",
        404
      );
    }

    const body =
      CategoryUpdateSchema.parse(
        await request.json()
      );

    const category =
      await CategoryService.update(
        categoryId,
        body,
        authUser.establishmentId
      );

    if (!category) {
      return ApiResponse.error(
        "Categoría no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      category,
      "Categoría actualizada correctamente."
    );
  } catch (error: any) {
    Logger.error(
      "Error actualizando categoría.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    if (error?.name === "ZodError") {
      return ApiResponse.error(
        "Datos inválidos.",
        400,
        error.issues
      );
    }

    if (error instanceof Error) {
      if (
        error.message ===
        "El menú no existe."
      ) {
        return ApiResponse.error(
          error.message,
          400
        );
      }

      if (
        error.message ===
        "El menú no pertenece al establecimiento autenticado."
      ) {
        return ApiResponse.error(
          error.message,
          403
        );
      }
    }

    return ApiResponse.error(
      "Error actualizando categoría.",
      500
    );
  }
}

// DELETE - Eliminar una categoría
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const authUser =
      await authenticateRequest(request);

    if (!isManagementRole(authUser.role)) {
      return ApiResponse.error(
        "You are not allowed to delete categories",
        403
      );
    }

    const { id } =
      await params;

    const categoryId =
      parseId(id);

    if (categoryId === null) {
      return ApiResponse.error(
        "ID de categoría no válido.",
        400
      );
    }

    const existing =
      await CategoryService.getById(
        categoryId,
        authUser.establishmentId
      );

    if (!existing) {
      return ApiResponse.error(
        "Categoría no encontrada.",
        404
      );
    }

    const hasProducts =
      await CategoryService.hasProducts(
        categoryId,
        authUser.establishmentId
      );

    if (hasProducts) {
      return ApiResponse.error(
        "No se puede eliminar la categoría porque tiene productos asociados.",
        409
      );
    }

    await CategoryService.delete(
      categoryId,
      authUser.establishmentId
    );

    return ApiResponse.success(
      null,
      "Categoría eliminada correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error eliminando categoría.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error eliminando categoría.",
      500
    );
  }
}