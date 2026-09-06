import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  ClientAnalyticsService,
  type ClientAnalyticsPeriod,
} from "@/services/client-analytics.service";

import {
  Logger,
} from "@/services/logger.service";

const MANAGEMENT_ROLES = [
  "admin",
  "manager",
] as const;

const VALID_PERIODS:
  ClientAnalyticsPeriod[] =
  [
    7,
    30,
    90,
  ];

function isManagementRole(
  role: string
): role is (typeof MANAGEMENT_ROLES)[number] {
  return MANAGEMENT_ROLES.includes(
    role as (typeof MANAGEMENT_ROLES)[number]
  );
}

function parsePeriod(
  value: string | null
): ClientAnalyticsPeriod | null {
  if (
    value ===
    null
  ) {
    return 30;
  }

  const parsed =
    Number(
      value
    );

  if (
    !Number.isInteger(
      parsed
    ) ||
    !VALID_PERIODS.includes(
      parsed as ClientAnalyticsPeriod
    )
  ) {
    return null;
  }

  return parsed as ClientAnalyticsPeriod;
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
        "No tienes permiso para consultar las analíticas de clientes.",
        403
      );
    }

    const period =
      parsePeriod(
        request.nextUrl.searchParams.get(
          "days"
        )
      );

    if (
      period ===
      null
    ) {
      return ApiResponse.error(
        "Periodo no válido. Los valores permitidos son 7, 30 o 90 días.",
        400
      );
    }

    const analytics =
      await ClientAnalyticsService.getForEstablishment(
        authUser.establishmentId,
        period
      );

    return ApiResponse.success(
      analytics,
      "Analíticas de clientes obtenidas correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo analíticas de clientes.",
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
      error instanceof Error &&
      error.message ===
        "ESTABLISHMENT_NOT_FOUND"
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    return ApiResponse.error(
      "Error obteniendo analíticas de clientes.",
      500
    );
  }
}
