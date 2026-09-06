import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import { ApiResponse } from "@/lib/api/ApiResponse";

import { RatingService } from "@/services/rating.service";
import { Logger } from "@/services/logger.service";

import { CreateRatingSchema } from "@/validations/rating.validation";

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

/*
 * ==========================================================
 * POST PÚBLICO
 * Crear valoración desde una sesión de cliente
 * ==========================================================
 */
export async function POST(
  request: NextRequest
) {
  try {
    const body =
      CreateRatingSchema.parse(
        await request.json()
      );

    const rating =
      await RatingService.create(
        body
      );

    return ApiResponse.success(
      rating,
      "Valoración creada correctamente.",
      201
    );
  } catch (error: any) {
    Logger.error(
      "Error creando valoración.",
      error
    );

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

    if (error instanceof Error) {
      switch (error.message) {
        case "SESSION_NOT_FOUND":
          return ApiResponse.error(
            "Sesión no encontrada.",
            404
          );

        case "ESTABLISHMENT_INACTIVE":
          return ApiResponse.error(
            "El establecimiento no está activo.",
            400
          );

        case "NO_DELIVERED_ORDER":
          return ApiResponse.error(
            "No se puede valorar sin un pedido entregado.",
            409
          );

        case "SESSION_ALREADY_RATED":
          return ApiResponse.error(
            "La sesión ya tiene una valoración.",
            409
          );

        default:
          break;
      }
    }

    return ApiResponse.error(
      "Error creando valoración.",
      500
    );
  }
}

/*
 * ==========================================================
 * GET ADMINISTRATIVO
 * Listar valoraciones del establecimiento autenticado
 * ==========================================================
 */
export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(request);

    const approvedParam =
      request.nextUrl.searchParams.get(
        "approved"
      );

    let approved:
      | boolean
      | undefined;

    if (
      approvedParam !== null
    ) {
      if (
        approvedParam !== "true" &&
        approvedParam !== "false"
      ) {
        return ApiResponse.error(
          "approved debe ser true o false.",
          400
        );
      }

      approved =
        approvedParam === "true";
    }

    const ratings =
      await RatingService.getByEstablishment(
        authUser.establishmentId,
        approved
      );

    return ApiResponse.success(
      ratings,
      "Valoraciones obtenidas correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo valoraciones.",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error obteniendo valoraciones.",
      500
    );
  }
}