import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import { ApiResponse } from "@/lib/api/ApiResponse";

import { RatingService } from "@/services/rating.service";
import { Logger } from "@/services/logger.service";

import {
  RatingModerationSchema,
  RatingResponseSchema,
} from "@/validations/rating.validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseRatingId(
  id: string
): number | null {
  const ratingId =
    Number(id);

  if (
    !Number.isInteger(ratingId) ||
    ratingId <= 0
  ) {
    return null;
  }

  return ratingId;
}

function handleAuthError(error: unknown) {
  if (!(error instanceof ApiAuthError)) {
    return null;
  }

  switch (error.message) {
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
  if (!(error instanceof Error)) {
    return null;
  }

  switch (error.message) {
    case "FORBIDDEN":
      return ApiResponse.error(
        "No tienes permisos para gestionar valoraciones.",
        403
      );

    case "USER_NOT_FOUND":
      return ApiResponse.error(
        "Usuario no encontrado.",
        401
      );

    case "USER_INACTIVE":
      return ApiResponse.error(
        "Usuario inactivo.",
        403
      );

    case "ESTABLISHMENT_ACCESS_DENIED":
      return ApiResponse.error(
        "Acceso al establecimiento denegado.",
        403
      );

    case "ROLE_MISMATCH":
      return ApiResponse.error(
        "El rol de autenticación no coincide.",
        403
      );

    case "RATING_NOT_FOUND":
      return ApiResponse.error(
        "Valoración no encontrada.",
        404
      );

    case "RATING_NOT_APPROVED":
      return ApiResponse.error(
        "No se puede responder una valoración no aprobada.",
        409
      );

    default:
      return null;
  }
}

/*
 * ==========================================================
 * GET
 * Consultar una valoración concreta
 * ==========================================================
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const authUser =
      await authenticateRequest(request);

    const { id } =
      await context.params;

    const ratingId =
      parseRatingId(id);

    if (ratingId === null) {
      return ApiResponse.error(
        "ID de valoración inválido.",
        400
      );
    }

    const rating =
      await RatingService.getById(
        ratingId,
        authUser.establishmentId
      );

    return ApiResponse.success(
      rating,
      "Valoración obtenida correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo valoración.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    const businessResponse =
      handleBusinessError(error);

    if (businessResponse) {
      return businessResponse;
    }

    return ApiResponse.error(
      "Error obteniendo valoración.",
      500
    );
  }
}

/*
 * ==========================================================
 * PATCH
 * Moderar o responder una valoración
 * ==========================================================
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const authUser =
      await authenticateRequest(request);

    const { id } =
      await context.params;

    const ratingId =
      parseRatingId(id);

    if (ratingId === null) {
      return ApiResponse.error(
        "ID de valoración inválido.",
        400
      );
    }

    const body =
      await request.json();

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "approved"
      )
    ) {
      const validation =
        RatingModerationSchema.safeParse(
          body
        );

      if (!validation.success) {
        return ApiResponse.error(
          "Datos de moderación inválidos.",
          400,
          validation.error.issues
        );
      }

      const rating =
        await RatingService.moderate(
          ratingId,
          validation.data,
          authUser.userId,
          authUser.establishmentId,
          authUser.role
        );

      return ApiResponse.success(
        rating,
        "Valoración moderada correctamente."
      );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "response"
      )
    ) {
      const validation =
        RatingResponseSchema.safeParse(
          body
        );

      if (!validation.success) {
        return ApiResponse.error(
          "Datos de respuesta inválidos.",
          400,
          validation.error.issues
        );
      }

      const rating =
        await RatingService.respond(
          ratingId,
          validation.data,
          authUser.userId,
          authUser.establishmentId,
          authUser.role
        );

      return ApiResponse.success(
        rating,
        "Respuesta registrada correctamente."
      );
    }

    return ApiResponse.error(
      "Debes indicar approved o response.",
      400
    );
  } catch (error) {
    Logger.error(
      "Error gestionando valoración.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    const businessResponse =
      handleBusinessError(error);

    if (businessResponse) {
      return businessResponse;
    }

    return ApiResponse.error(
      "Error gestionando valoración.",
      500
    );
  }
}