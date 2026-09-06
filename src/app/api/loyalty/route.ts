import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  LoyaltyCreateSchema,
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
        "No tienes permisos para consultar fidelización.",
        403
      );
    }

    const sessionId =
      request.nextUrl.searchParams.get(
        "sessionId"
      ) ??
      undefined;

    const customerEmail =
      request.nextUrl.searchParams.get(
        "customerEmail"
      ) ??
      undefined;

    if (
      sessionId
    ) {
      const parsed =
        zUuid.safeParse(
          sessionId
        );

      if (
        !parsed.success
      ) {
        return ApiResponse.error(
          "sessionId inválido.",
          400
        );
      }
    }

    const result =
      await LoyaltyService
        .listForEstablishment(
          authUser.establishmentId,
          {
            sessionId,
            customerEmail,
          }
        );

    return ApiResponse.success(
      result,
      "Registros de fidelización obtenidos correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo fidelización.",
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
      "Error obteniendo fidelización.",
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
        "No tienes permisos para crear registros de fidelización.",
        403
      );
    }

    const body =
      LoyaltyCreateSchema.parse(
        await request.json()
      );

    const loyalty =
      await LoyaltyService
        .createForEstablishment(
          authUser.establishmentId,
          body
        );

    return ApiResponse.success(
      loyalty,
      "Registro de fidelización creado correctamente.",
      201
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error creando registro de fidelización.",
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
      "Error creando registro de fidelización.",
      500
    );
  }
}

const zUuid = {
  safeParse(
    value: string
  ) {
    const valid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        .test(
          value
        );

    return {
      success:
        valid,
    };
  },
};