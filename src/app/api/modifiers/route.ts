import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  ModifierCreateSchema,
} from "@/validations/modifier.validation";

import {
  ModifierService,
} from "@/services/modifier.service";

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

/*
 * ==========================================================
 * GET
 * ==========================================================
 */

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
        "No tienes permisos para consultar modificadores.",
        403
      );
    }

    const {
      searchParams,
    } =
      new URL(
        request.url
      );

    const productIdParam =
      searchParams.get(
        "productId"
      );

    let productId:
      number |
      undefined;

    if (
      productIdParam !==
      null
    ) {
      const parsed =
        Number(
          productIdParam
        );

      if (
        !Number.isInteger(
          parsed
        ) ||
        parsed <=
          0
      ) {
        return ApiResponse.error(
          "El productId no es válido.",
          400
        );
      }

      productId =
        parsed;
    }

    const modifiers =
      await ModifierService
        .listForEstablishment(
          authUser.establishmentId,
          productId
        );

    return ApiResponse.success(
      modifiers,
      "Modificadores obtenidos correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo modificadores.",
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
      error instanceof
        Error &&
      error.message ===
        "PRODUCT_NOT_FOUND"
    ) {
      return ApiResponse.error(
        "Producto no encontrado.",
        404
      );
    }

    return ApiResponse.error(
      "Error obteniendo modificadores.",
      500
    );
  }
}

/*
 * ==========================================================
 * POST
 * ==========================================================
 */

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
        "No tienes permisos para crear modificadores.",
        403
      );
    }

    const body =
      ModifierCreateSchema.parse(
        await request.json()
      );

    const modifier =
      await ModifierService
        .createForEstablishment(
          authUser.establishmentId,
          body
        );

    return ApiResponse.success(
      modifier,
      "Modificador creado correctamente.",
      201
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error creando modificador.",
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

    if (
      error instanceof
        Error &&
      error.message ===
        "PRODUCT_NOT_FOUND"
    ) {
      return ApiResponse.error(
        "Producto no encontrado.",
        404
      );
    }

    return ApiResponse.error(
      "Error creando modificador.",
      500
    );
  }
}