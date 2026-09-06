import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import { MenuUpdateSchema } from "@/validations/menu.validation";

import { MenuService } from "@/services/menu.service";
import { Logger } from "@/services/logger.service";

import { ApiResponse } from "@/lib/api/ApiResponse";

import { RouteParams } from "@/types/api";

const MANAGEMENT_ROLES = ["admin", "manager"] as const;

function isManagementRole(
  role: string
): role is (typeof MANAGEMENT_ROLES)[number] {
  return MANAGEMENT_ROLES.includes(
    role as (typeof MANAGEMENT_ROLES)[number]
  );
}

function parseId(
  id: string
): number | null {
  const parsed = Number(id);

  if (
    !Number.isInteger(parsed) ||
    parsed <= 0
  ) {
    return null;
  }

  return parsed;
}

function handleAuthError(error: unknown) {
  if (!(error instanceof ApiAuthError)) {
    return null;
  }

  switch (error.message) {
    case "AUTH_HEADER_MISSING":
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );

    case "AUTH_HEADER_INVALID":
      return NextResponse.json(
        {
          success: false,
          error: "Invalid authorization header",
        },
        { status: 401 }
      );

    case "TOKEN_EXPIRED":
      return NextResponse.json(
        {
          success: false,
          error: "Authentication token expired",
        },
        { status: 401 }
      );

    case "TOKEN_INVALID":
      return NextResponse.json(
        {
          success: false,
          error: "Invalid authentication token",
        },
        { status: 401 }
      );

    default:
      return NextResponse.json(
        {
          success: false,
          error: "Authentication failed",
        },
        { status: 401 }
      );
  }
}

// GET - Obtener un menú
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const authUser =
      await authenticateRequest(request);

    const { id } = await params;

    const menuId =
      parseId(id);

    if (menuId === null) {
      return ApiResponse.error(
        "ID de menú no válido.",
        400
      );
    }

    const menu =
      await MenuService.getById(
        menuId,
        authUser.establishmentId
      );

    if (!menu) {
      return ApiResponse.error(
        "Menú no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      menu,
      "Menú obtenido correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo menú.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error obteniendo menú.",
      500
    );
  }
}

// PUT - Actualizar menú
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const authUser =
      await authenticateRequest(request);

    if (!isManagementRole(authUser.role)) {
      return ApiResponse.error(
        "No tienes permisos para actualizar menús.",
        403
      );
    }

    const { id } = await params;

    const menuId =
      parseId(id);

    if (menuId === null) {
      return ApiResponse.error(
        "ID de menú no válido.",
        400
      );
    }

    const existing =
      await MenuService.getById(
        menuId,
        authUser.establishmentId
      );

    if (!existing) {
      return ApiResponse.error(
        "Menú no encontrado.",
        404
      );
    }

    const body =
      MenuUpdateSchema.parse(
        await request.json()
      );

    const menu =
      await MenuService.update(
        menuId,
        authUser.establishmentId,
        {
          ...body,
          establishmentId:
            authUser.establishmentId,
        }
      );

    if (!menu) {
      return ApiResponse.error(
        "Menú no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      menu,
      "Menú actualizado correctamente."
    );
  } catch (error: any) {
    Logger.error(
      "Error actualizando menú.",
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

    return ApiResponse.error(
      "Error actualizando menú.",
      500
    );
  }
}

// DELETE - Eliminar menú
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const authUser =
      await authenticateRequest(request);

    if (!isManagementRole(authUser.role)) {
      return ApiResponse.error(
        "No tienes permisos para eliminar menús.",
        403
      );
    }

    const { id } = await params;

    const menuId =
      parseId(id);

    if (menuId === null) {
      return ApiResponse.error(
        "ID de menú no válido.",
        400
      );
    }

    const menu =
      await MenuService.getById(
        menuId,
        authUser.establishmentId
      );

    if (!menu) {
      return ApiResponse.error(
        "Menú no encontrado.",
        404
      );
    }

    const hasCategories =
      await MenuService.hasCategories(
        menuId,
        authUser.establishmentId
      );

    if (hasCategories) {
      return ApiResponse.error(
        "No se puede eliminar este menú porque tiene categorías asociadas. Elimina o reasigna primero sus categorías.",
        409
      );
    }

    const deleted =
      await MenuService.delete(
        menuId,
        authUser.establishmentId
      );

    if (!deleted) {
      return ApiResponse.error(
        "Menú no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Menú eliminado correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error eliminando menú.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error eliminando menú.",
      500
    );
  }
}