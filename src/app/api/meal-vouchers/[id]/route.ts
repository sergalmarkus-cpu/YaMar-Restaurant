import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  MealVoucherUpdateSchema,
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

import {
  RouteParams,
} from "@/types/api";

function parseId(
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
    error instanceof ApiAuthError
  ) {
    return ApiResponse.error(
      error.message,
      401
    );
  }

  return null;
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

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de vale no válido.",
        400
      );
    }

    const voucher =
      await MealVoucherService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !voucher
    ) {
      return ApiResponse.error(
        "Vale no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      voucher,
      "Vale obtenido correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo vale.",
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
      "Error obteniendo vale.",
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
      authUser.role !==
        "admin" &&
      authUser.role !==
        "manager"
    ) {
      return ApiResponse.error(
        "No tienes permisos para actualizar vales.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de vale no válido.",
        400
      );
    }

    const body =
      MealVoucherUpdateSchema.parse(
        await request.json()
      );

    const voucher =
      await MealVoucherService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
        );

    if (
      !voucher
    ) {
      return ApiResponse.error(
        "Vale no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      voucher,
      "Vale actualizado correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando vale.",
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
      "Error actualizando vale.",
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
      authUser.role !==
      "admin"
    ) {
      return ApiResponse.error(
        "No tienes permisos para eliminar vales.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de vale no válido.",
        400
      );
    }

    const deleted =
      await MealVoucherService
        .deleteForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !deleted
    ) {
      return ApiResponse.error(
        "Vale no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Vale eliminado correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error eliminando vale.",
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
      "Error eliminando vale.",
      500
    );
  }
}