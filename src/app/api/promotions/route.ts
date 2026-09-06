import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  PromotionCreateSchema,
} from "@/validations/promotion.validation";

import {
  PromotionService,
} from "@/services/promotion.service";

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

function handleBusinessError(
  error: unknown
) {
  if (
    !(error instanceof Error)
  ) {
    return null;
  }

  switch (
    error.message
  ) {
    case "PROMOTION_CODE_EXISTS":
      return ApiResponse.error(
        "Ya existe una promoción con ese código.",
        409
      );

    case "PROMOTION_PRODUCT_NOT_FOUND":
      return ApiResponse.error(
        "Uno o varios productos de la promoción no existen o no pertenecen al establecimiento.",
        404
      );

    case "PROMOTION_MENU_NOT_FOUND":
      return ApiResponse.error(
        "Uno o varios menús de la promoción no existen o no pertenecen al establecimiento.",
        404
      );

    case "PROMOTION_CATEGORY_NOT_FOUND":
      return ApiResponse.error(
        "Una o varias categorías de la promoción no existen o no pertenecen al establecimiento.",
        404
      );

    default:
      return null;
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
        "No tienes permisos para consultar promociones.",
        403
      );
    }

    const promotions =
      await PromotionService
        .listForEstablishment(
          authUser.establishmentId
        );

    return ApiResponse.success(
      promotions,
      "Promociones obtenidas correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo promociones.",
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
      "Error obteniendo promociones.",
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
        "No tienes permisos para crear promociones.",
        403
      );
    }

    const body =
      PromotionCreateSchema.parse(
        await request.json()
      );

    const promotion =
      await PromotionService
        .createForEstablishment(
          authUser.establishmentId,
          body
        );

    return ApiResponse.success(
      promotion,
      "Promoción creada correctamente.",
      201
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error creando promoción.",
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
      "Error creando promoción.",
      500
    );
  }
}