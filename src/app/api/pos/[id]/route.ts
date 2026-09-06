import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  PosUpdateSchema,
} from "@/validations/pos.validation";

import {
  PosService,
} from "@/services/pos.service";

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
        "ID de punto de venta no válido.",
        400
      );
    }

    const result =
      await PosService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !result
    ) {
      return ApiResponse.error(
        "Punto de venta no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      result,
      "Punto de venta obtenido correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo punto de venta.",
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
      "Error obteniendo punto de venta.",
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
        "No tienes permisos para actualizar puntos de venta.",
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
        "ID de punto de venta no válido.",
        400
      );
    }

    const body =
      PosUpdateSchema.parse(
        await request.json()
      );

    const result =
      await PosService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
        );

    if (
      !result
    ) {
      return ApiResponse.error(
        "Punto de venta no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      result,
      "Punto de venta actualizado correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando punto de venta.",
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
        "POS_MENU_NOT_FOUND"
    ) {
      return ApiResponse.error(
        "Uno o más menús no existen o no pertenecen al establecimiento.",
        404
      );
    }

    return ApiResponse.error(
      "Error actualizando punto de venta.",
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
        "No tienes permisos para eliminar puntos de venta.",
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
        "ID de punto de venta no válido.",
        400
      );
    }

    const result =
      await PosService
        .deleteForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !result
    ) {
      return ApiResponse.error(
        "Punto de venta no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Punto de venta eliminado correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error eliminando punto de venta.",
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
      "Error eliminando punto de venta.",
      500
    );
  }
}