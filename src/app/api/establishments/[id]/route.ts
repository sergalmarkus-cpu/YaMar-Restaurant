import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  EstablishmentUpdateSchema,
} from "@/validations/establishment.validation";

import {
  EstablishmentService,
} from "@/services/establishment.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  RouteParams,
} from "@/types/api";

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

function parseId(
  value: string
) {
  const id =
    Number(value);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return null;
  }

  return id;
}

function isAdmin(
  role: string
) {
  return (
    role ===
    "admin"
  );
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
        "ID de establecimiento inválido.",
        400
      );
    }

    if (
      id !==
      authUser.establishmentId
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    const establishment =
      await EstablishmentService
        .getForAuthenticatedEstablishment(
          authUser.establishmentId
        );

    if (
      !establishment
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      establishment,
      "Establecimiento obtenido correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo establecimiento.",
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
      "Error obteniendo establecimiento.",
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
      !isAdmin(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permiso para actualizar el establecimiento.",
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
        "ID de establecimiento inválido.",
        400
      );
    }

    /*
     * No revelamos si existe otro tenant.
     */
    if (
      id !==
      authUser.establishmentId
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    const body =
      EstablishmentUpdateSchema.parse(
        await request.json()
      );

    const establishment =
      await EstablishmentService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
        );

    if (
      !establishment
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      establishment,
      "Establecimiento actualizado correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error actualizando establecimiento.",
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
      error instanceof Error &&
      error.message ===
        "ESTABLISHMENT_SLUG_EXISTS"
    ) {
      return ApiResponse.error(
        "Ya existe un establecimiento con ese slug.",
        409
      );
    }

    return ApiResponse.error(
      "Error actualizando establecimiento.",
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
      !isAdmin(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permiso para desactivar el establecimiento.",
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
        "ID de establecimiento inválido.",
        400
      );
    }

    if (
      id !==
      authUser.establishmentId
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    const establishment =
      await EstablishmentService
        .deactivateForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !establishment
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      establishment,
      "Establecimiento desactivado correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error desactivando establecimiento.",
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
      "Error desactivando establecimiento.",
      500
    );
  }
}