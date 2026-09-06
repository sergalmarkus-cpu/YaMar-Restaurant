import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  CustomerVoucherCreateSchema,
} from "@/validations/customer-voucher.validation";

import {
  CustomerVoucherService,
} from "@/services/customer-voucher.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

function handleAuthError(
  error: unknown
) {
  if (
    error instanceof ApiAuthError
  ) {
    return ApiResponse.error(
      error.message,
      401
    );
  }

  return null;
}

export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    const result =
      await CustomerVoucherService
        .listForEstablishment(
          authUser.establishmentId
        );

    return ApiResponse.success(
      result,
      "Asignaciones obtenidas correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo asignaciones de vales.",
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
      "Error obteniendo asignaciones de vales.",
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
      authUser.role !==
        "admin" &&
      authUser.role !==
        "manager"
    ) {
      return ApiResponse.error(
        "No tienes permisos para asignar vales.",
        403
      );
    }

    const body =
      CustomerVoucherCreateSchema.parse(
        await request.json()
      );

    const result =
      await CustomerVoucherService
        .createForEstablishment(
          authUser.establishmentId,
          body
        );

    return ApiResponse.success(
      result,
      "Vale asignado correctamente.",
      201
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error asignando vale.",
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

    if (
      error instanceof Error &&
      error.message ===
        "CUSTOMER_VOUCHER_PARENT_NOT_FOUND"
    ) {
      return ApiResponse.error(
        "El vale no existe o no pertenece al establecimiento.",
        404
      );
    }

    return ApiResponse.error(
      "Error asignando vale.",
      500
    );
  }
}