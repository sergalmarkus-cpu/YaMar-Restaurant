import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  LoyaltyUpdateSchema,
} from "@/validations/loyalty.validation";

import {
  LoyaltyService,
} from "@/services/loyalty.service";

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

function parseLoyaltyId(
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
    case "LOYALTY_SESSION_NOT_FOUND":
      return ApiResponse.error(
        "La sesión no existe o no pertenece al establecimiento.",
        404
      );

    case "LOYALTY_EMAIL_MISMATCH":
      return ApiResponse.error(
        "El email indicado no corresponde al cliente de la sesión.",
        400
      );

    case "LOYALTY_ENTRY_EXISTS":
      return ApiResponse.error(
        "Ya existe un registro de fidelización para esta sesión.",
        409
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
        "No tienes permisos para consultar fidelización.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseLoyaltyId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de fidelización no válido.",
        400
      );
    }

    const loyalty =
      await LoyaltyService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !loyalty
    ) {
      return ApiResponse.error(
        "Registro de fidelización no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      loyalty,
      "Registro de fidelización obtenido correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo registro de fidelización.",
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
      "Error obteniendo registro de fidelización.",
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
        "No tienes permisos para actualizar fidelización.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseLoyaltyId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de fidelización no válido.",
        400
      );
    }

    const body =
      LoyaltyUpdateSchema.parse(
        await request.json()
      );

    const loyalty =
      await LoyaltyService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
        );

    if (
      !loyalty
    ) {
      return ApiResponse.error(
        "Registro de fidelización no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      loyalty,
      "Registro de fidelización actualizado correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando registro de fidelización.",
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
      "Error actualizando registro de fidelización.",
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
        "No tienes permisos para eliminar registros de fidelización.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseLoyaltyId(
        rawId
      );

    if (
      id === null
    ) {
      return ApiResponse.error(
        "ID de fidelización no válido.",
        400
      );
    }

    const deleted =
      await LoyaltyService
        .deleteForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !deleted
    ) {
      return ApiResponse.error(
        "Registro de fidelización no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Registro de fidelización eliminado correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error eliminando registro de fidelización.",
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
      "Error eliminando registro de fidelización.",
      500
    );
  }
}