import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  CustomerVoucherUpdateSchema,
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
        "ID no válido.",
        400
      );
    }

    const result =
      await CustomerVoucherService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !result
    ) {
      return ApiResponse.error(
        "Asignación no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      result,
      "Asignación obtenida correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo asignación.",
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
      "Error obteniendo asignación.",
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
        "No tienes permisos.",
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
        "ID no válido.",
        400
      );
    }

    const body =
      CustomerVoucherUpdateSchema.parse(
        await request.json()
      );

    const result =
      await CustomerVoucherService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
        );

    if (
      !result
    ) {
      return ApiResponse.error(
        "Asignación no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      result,
      "Asignación actualizada correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando asignación.",
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

    return ApiResponse.error(
      "Error actualizando asignación.",
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
        "No tienes permisos.",
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
        "ID no válido.",
        400
      );
    }

    const result =
      await CustomerVoucherService
        .deleteForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !result
    ) {
      return ApiResponse.error(
        "Asignación no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Asignación eliminada correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error eliminando asignación.",
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
      "Error eliminando asignación.",
      500
    );
  }
}