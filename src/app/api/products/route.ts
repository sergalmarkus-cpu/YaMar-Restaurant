import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  AdminCreateProductSchema,
} from "@/validations/product.validation";

import {
  ProductService,
} from "@/services/product.service";

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
  role:
    string
): role is (typeof MANAGEMENT_ROLES)[number] {
  return MANAGEMENT_ROLES.includes(
    role as (typeof MANAGEMENT_ROLES)[number]
  );
}

function handleAuthError(
  error:
    unknown
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

export async function GET(
  request:
    NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    const {
      searchParams,
    } =
      new URL(
        request.url
      );

    const categoryIdParam =
      searchParams.get(
        "categoryId"
      );

    const menuIdParam =
      searchParams.get(
        "menuId"
      );

    let categoryId:
      number | undefined;

    let menuId:
      number | undefined;

    if (
      categoryIdParam !==
      null
    ) {
      const parsed =
        Number(
          categoryIdParam
        );

      if (
        !Number.isInteger(
          parsed
        ) ||
        parsed <=
          0
      ) {
        return ApiResponse.error(
          "El categoryId no es válido.",
          400
        );
      }

      categoryId =
        parsed;
    }

    if (
      menuIdParam !==
      null
    ) {
      const parsed =
        Number(
          menuIdParam
        );

      if (
        !Number.isInteger(
          parsed
        ) ||
        parsed <=
          0
      ) {
        return ApiResponse.error(
          "El menuId no es válido.",
          400
        );
      }

      menuId =
        parsed;
    }

    const productList =
      await ProductService.listForEstablishment(
        authUser.establishmentId,
        categoryId,
        menuId
      );

    return ApiResponse.success(
      productList,
      "Productos obtenidos correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo productos.",
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
      "Error obteniendo productos.",
      500
    );
  }
}

export async function POST(
  request:
    NextRequest
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
        "No tienes permisos para crear productos.",
        403
      );
    }

    const body =
      AdminCreateProductSchema.parse(
        await request.json()
      );

    const product =
      await ProductService.createForEstablishment(
        authUser.establishmentId,
        body
      );

    return ApiResponse.success(
      product,
      "Producto creado correctamente.",
      201
    );
  } catch (
    error:
      any
  ) {
    Logger.error(
      "Error creando producto.",
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
        Error
    ) {
      if (
        error.message ===
        "CATEGORY_NOT_FOUND"
      ) {
        return ApiResponse.error(
          "Categoría no encontrada.",
          404
        );
      }
    }

    return ApiResponse.error(
      "No se pudo crear el producto.",
      500
    );
  }
}