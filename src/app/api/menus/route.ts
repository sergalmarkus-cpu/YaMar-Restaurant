import { NextRequest, NextResponse } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import { MenuCreateSchema } from "@/validations/menu.validation";

import { MenuService } from "@/services/menu.service";
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

export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(request);

    const menus =
      await MenuService.list(
        authUser.establishmentId
      );

    return ApiResponse.success(
      menus,
      "Menús obtenidos correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo menús.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error obteniendo menús.",
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

    if (!isManagementRole(authUser.role)) {
      return ApiResponse.error(
        "No tienes permisos para crear menús.",
        403
      );
    }

    const body =
      MenuCreateSchema.parse(
        await request.json()
      );

    const menu =
      await MenuService.create(
        {
          ...body,
          establishmentId:
            authUser.establishmentId,
        }
      );

    return ApiResponse.success(
      menu,
      "Menú creado correctamente.",
      201
    );
  } catch (error: any) {
    Logger.error(
      "Error creando menú.",
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
      "Error creando menú.",
      500
    );
  }
}