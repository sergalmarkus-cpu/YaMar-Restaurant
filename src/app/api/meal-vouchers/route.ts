import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  MealVoucherCreateSchema,
} from "@/validations/meal-voucher.validation";

import {
  MealVoucherService,
} from "@/services/meal-voucher.service";

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

  return ApiResponse.error(
    error.message,
    401
  );
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
    case "MEAL_VOUCHER_MENU_NOT_FOUND":
      return ApiResponse.error(
        "Uno o más menús no existen o no pertenecen al establecimiento.",
        404
      );

    case "INVALID_VOUCHER_CREDITS":
      return ApiResponse.error(
        "Los créditos diarios deben ser mayores que cero.",
        400
      );

    case "INVALID_VOUCHER_DATE_RANGE":
      return ApiResponse.error(
        "La fecha final debe ser posterior a la fecha inicial.",
        400
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
        "No tienes permisos para consultar vales.",
        403
      );
    }

    const vouchers =
      await MealVoucherService
        .listForEstablishment(
          authUser.establishmentId
        );

    return ApiResponse.success(
      vouchers,
      "Vales obtenidos correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo vales.",
      error
    );

    const auth =
      handleAuthError(
        error
      );

    if (
      auth
    ) {
      return auth;
    }

    return ApiResponse.error(
      "Error obteniendo vales.",
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
        "No tienes permisos para crear vales.",
        403
      );
    }

    const body =
      MealVoucherCreateSchema.parse(
        await request.json()
      );

    const voucher =
      await MealVoucherService
        .createForEstablishment(
          authUser.establishmentId,
          body
        );

    return ApiResponse.success(
      voucher,
      "Vale creado correctamente.",
      201
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error creando vale.",
      error
    );

    const auth =
      handleAuthError(
        error
      );

    if (
      auth
    ) {
      return auth;
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

    const business =
      handleBusinessError(
        error
      );

    if (
      business
    ) {
      return business;
    }

    return ApiResponse.error(
      "Error creando vale.",
      500
    );
  }
}