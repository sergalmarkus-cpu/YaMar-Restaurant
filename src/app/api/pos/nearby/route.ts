import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  PosNearbyQuerySchema,
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
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    const query =
      PosNearbyQuerySchema.parse({
        latitude:
          request.nextUrl.searchParams.get(
            "latitude"
          ),

        longitude:
          request.nextUrl.searchParams.get(
            "longitude"
          ),
      });

    const result =
      await PosService
        .nearbyForEstablishment(
          authUser.establishmentId,
          query.latitude,
          query.longitude
        );

    return ApiResponse.success(
      result,
      "Puntos de venta cercanos obtenidos correctamente."
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error obteniendo puntos de venta cercanos.",
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
        "Coordenadas no válidas.",
        400,
        error.issues
      );
    }

    return ApiResponse.error(
      "Error obteniendo puntos de venta cercanos.",
      500
    );
  }
}