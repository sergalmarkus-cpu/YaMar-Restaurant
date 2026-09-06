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
  Logger,
} from "@/services/logger.service";

import {
  SalesAnalyticsService,
  type SalesAnalyticsPeriod,
} from "@/services/sales-analytics.service";

const MANAGEMENT_ROLES = [
  "admin",
  "manager",
] as const;

const VALID_PERIODS:
  SalesAnalyticsPeriod[] =
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
): SalesAnalyticsPeriod | null {
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
      parsed as SalesAnalyticsPeriod
    )
  ) {
    return null;
  }

  return parsed as
    SalesAnalyticsPeriod;
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
        "No tienes permisos para consultar las analíticas de ventas.",
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
      await SalesAnalyticsService
        .getForEstablishment(
          authUser.establishmentId,
          period
        );

    if (
      !analytics
    ) {
      return ApiResponse.error(
        "Establecimiento no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      analytics,
      "Analíticas de ventas obtenidas correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo analíticas de ventas.",
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
      "Error obteniendo analíticas de ventas.",
      500
    );
  }
}