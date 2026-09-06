import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import { CategoryCreateSchema } from "@/validations/category.validation";

import { CategoryService } from "@/services/category.service";
import { Logger } from "@/services/logger.service";

import { ApiResponse } from "@/lib/api/ApiResponse";

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

// GET - Obtener categorías del establecimiento autenticado
export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(request);

    const menuIdParam =
      request.nextUrl.searchParams.get(
        "menuId"
      );

    let menuId: number | undefined;

    if (menuIdParam !== null) {
      menuId =
        Number(menuIdParam);

      if (
        !Number.isInteger(menuId) ||
        menuId <= 0
      ) {
        return ApiResponse.error(
          "menuId no válido.",
          400
        );
      }
    }

    const categories =
      await CategoryService.list(
        authUser.establishmentId,
        menuId
      );

    return ApiResponse.success(
      categories,
      "Categorías obtenidas correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo categorías.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error obteniendo categorías.",
      500
    );
  }
}

// POST - Crear una categoría
export async function POST(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(request);

    if (!isManagementRole(authUser.role)) {
      return ApiResponse.error(
        "You are not allowed to create categories",
        403
      );
    }

    const body =
      CategoryCreateSchema.parse(
        await request.json()
      );

    const category =
      await CategoryService.create(
        body,
        authUser.establishmentId
      );

    return ApiResponse.success(
      category,
      "Categoría creada correctamente.",
      201
    );
  } catch (error: any) {
    Logger.error(
      "Error creando categoría.",
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
      "Error creando categoría.",
      500
    );
  }
}