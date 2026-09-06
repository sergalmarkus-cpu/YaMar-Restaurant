import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  AreaUpdateSchema,
} from "@/validations/area.validation";

import {
  AreaService,
} from "@/services/area.service";

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

function parseAreaId(
  value: string
) {
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
      parseAreaId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de área inválido.",
        400
      );
    }

    const area =
      await AreaService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !area
    ) {
      return ApiResponse.error(
        "Área no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      area,
      "Área obtenida correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo área.",
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
      "Error obteniendo área.",
      500
    );
  }
}

export async function PATCH(
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
        "No tienes permiso para actualizar áreas.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseAreaId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de área inválido.",
        400
      );
    }

    const body =
      AreaUpdateSchema.parse(
        await request.json()
      );

    const area =
      await AreaService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
        );

    if (
      !area
    ) {
      return ApiResponse.error(
        "Área no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      area,
      "Área actualizada correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando área.",
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

    return ApiResponse.error(
      "Error actualizando área.",
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
        "No tienes permiso para desactivar áreas.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseAreaId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de área inválido.",
        400
      );
    }

    const area =
      await AreaService
        .deactivateForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !area
    ) {
      return ApiResponse.error(
        "Área no encontrada.",
        404
      );
    }

    return ApiResponse.success(
      area,
      "Área desactivada correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error desactivando área.",
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
      "Error desactivando área.",
      500
    );
  }
}