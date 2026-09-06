import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  PromotionUpdateSchema,
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

function parsePromotionId(
  value: string
): number | null {
  const id =
    Number(
      value
    );

  if (
    !Number.isInteger(
      id
    ) ||
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

    case "PROMOTION_INVALID_DATE_RANGE":
      return ApiResponse.error(
        "La fecha de fin debe ser posterior a la fecha de inicio.",
        400
      );

    case "PROMOTION_INVALID_PERCENTAGE":
      return ApiResponse.error(
        "El descuento porcentual debe ser mayor que 0 y no superar el 100%.",
        400
      );

    case "PROMOTION_INVALID_FIXED_VALUE":
      return ApiResponse.error(
        "El descuento fijo debe ser mayor que cero.",
        400
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
        "No tienes permisos para consultar promociones.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parsePromotionId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de promoción no válido.",
        400
      );
    }

    const promotion =
      await PromotionService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !promotion
    ) {
      return ApiResponse.error(
        "Promoción no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      promotion,
      "Promoción obtenida correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo promoción.",
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
      "Error obteniendo promoción.",
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
        "No tienes permisos para actualizar promociones.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parsePromotionId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de promoción no válido.",
        400
      );
    }

    const body =
      PromotionUpdateSchema.parse(
        await request.json()
      );

    const promotion =
      await PromotionService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
        );

    if (
      !promotion
    ) {
      return ApiResponse.error(
        "Promoción no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      promotion,
      "Promoción actualizada correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando promoción.",
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
      "Error actualizando promoción.",
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
        "No tienes permisos para eliminar promociones.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parsePromotionId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de promoción no válido.",
        400
      );
    }

    const promotion =
      await PromotionService
        .deleteForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !promotion
    ) {
      return ApiResponse.error(
        "Promoción no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Promoción eliminada correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error eliminando promoción.",
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
      "Error eliminando promoción.",
      500
    );
  }
}