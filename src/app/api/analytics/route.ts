import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  AnalyticsEventCreateSchema,
} from "@/validations/analytics.validation";

import {
  AnalyticsService,
} from "@/services/analytics.service";

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
    case "ANALYTICS_SESSION_NOT_FOUND":
      return ApiResponse.error(
        "La sesión no existe o no pertenece al establecimiento.",
        404
      );

    case "ANALYTICS_USER_NOT_FOUND":
      return ApiResponse.error(
        "El usuario no existe o no pertenece al establecimiento.",
        404
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
        "No tienes permisos para consultar analíticas.",
        403
      );
    }

    const eventType =
      request.nextUrl.searchParams.get(
        "eventType"
      ) ??
      undefined;

    const sessionId =
      request.nextUrl.searchParams.get(
        "sessionId"
      ) ??
      undefined;

    const userIdParam =
      request.nextUrl.searchParams.get(
        "userId"
      );

    let userId:
      number |
      undefined;

    if (
      sessionId !==
      undefined
    ) {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      if (
        !uuidPattern.test(
          sessionId
        )
      ) {
        return ApiResponse.error(
          "sessionId inválido.",
          400
        );
      }
    }

    if (
      userIdParam !==
      null
    ) {
      const parsed =
        Number(
          userIdParam
        );

      if (
        !Number.isInteger(
          parsed
        ) ||
        parsed <=
          0
      ) {
        return ApiResponse.error(
          "userId inválido.",
          400
        );
      }

      userId =
        parsed;
    }

    const events =
      await AnalyticsService
        .listForEstablishment(
          authUser.establishmentId,
          {
            eventType,
            sessionId,
            userId,
          }
        );

    return ApiResponse.success(
      events,
      "Eventos analíticos obtenidos correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo eventos analíticos.",
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
      "Error obteniendo eventos analíticos.",
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
        "No tienes permisos para registrar eventos analíticos.",
        403
      );
    }

    const body =
      AnalyticsEventCreateSchema.parse(
        await request.json()
      );

    const event =
      await AnalyticsService
        .createForEstablishment(
          authUser.establishmentId,
          body
        );

    return ApiResponse.success(
      event,
      "Evento analítico registrado correctamente.",
      201
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error registrando evento analítico.",
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
      "Error registrando evento analítico.",
      500
    );
  }
}