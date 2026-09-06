import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  OrderSchema,
} from "@/validations/order.validation";

import {
  OrderService,
} from "@/services/order.service";

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
    !(error instanceof ApiAuthError)
  ) {
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
 * GET
 * Panel administrativo.
 * Requiere JWT y devuelve únicamente pedidos del tenant.
 * ==========================================================
 */

export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    const result =
      await OrderService
        .getAllForEstablishment(
          authUser.establishmentId
        );

    return ApiResponse.success(
      result,
      "Pedidos obtenidos correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo pedidos.",
      error
    );

    const authResponse =
      handleAuthError(
        error
      );

    if (authResponse) {
      return authResponse;
    }

    return ApiResponse.error(
      "Error obteniendo pedidos.",
      500
    );
  }
}

/*
 * ==========================================================
 * POST
 * Flujo público QR.
 *
 * NO requiere JWT administrativo.
 * La autoridad del tenant se valida mediante la sesión QR
 * dentro de OrderService.create().
 * ==========================================================
 */

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      OrderSchema.parse(
        await request.json()
      );

    const order =
      await OrderService.create(
        body
      );

    return ApiResponse.success(
      order,
      "Pedido creado correctamente.",
      201
    );
  } catch (error: any) {
    Logger.error(
      "Error creando pedido.",
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

    const clientErrors = [
      "La sesión no existe.",
      "La sesión no está activa.",
      "La mesa no corresponde a la sesión.",
      "El establecimiento no corresponde a la sesión.",
    ];

    if (
      error instanceof Error &&
      clientErrors.includes(
        error.message
      )
    ) {
      return ApiResponse.error(
        error.message,
        400
      );
    }

    if (
      error instanceof Error &&
      (
        error.message.includes(
          "Producto"
        ) ||
        error.message.includes(
          "producto"
        ) ||
        error.message.includes(
          "Modificador"
        ) ||
        error.message.includes(
          "modificador"
        ) ||
        error.message.includes(
          "Stock insuficiente"
        )
      )
    ) {
      return ApiResponse.error(
        error.message,
        400
      );
    }

    return ApiResponse.error(
      "No se pudo crear el pedido.",
      500
    );
  }
}