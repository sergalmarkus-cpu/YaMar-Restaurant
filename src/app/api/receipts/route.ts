import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  ReceiptService,
} from "@/services/receipt.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

const RECEIPT_ROLES = [
  "admin",
  "manager",
  "cashier",
] as const;

function hasReceiptRole(
  role: string
): role is (typeof RECEIPT_ROLES)[number] {
  return RECEIPT_ROLES.includes(
    role as (typeof RECEIPT_ROLES)[number]
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

/*
 * ==========================================================
 * GET - LISTAR RECIBOS DEL ESTABLECIMIENTO
 * ==========================================================
 *
 * Ruta administrativa.
 *
 * El tenant procede siempre del JWT.
 * Nunca aceptamos establishmentId desde query/body.
 */
export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    if (
      !hasReceiptRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar recibos.",
        403
      );
    }

    const sessionId =
      request.nextUrl.searchParams.get(
        "sessionId"
      ) ??
      undefined;

    const receipts =
      await ReceiptService
        .listForEstablishment(
          authUser.establishmentId,
          sessionId
        );

    return ApiResponse.success(
      receipts,
      "Recibos obtenidos correctamente."
    );
  } catch (
    error: unknown
  ) {
    Logger.error(
      "Error obteniendo recibos.",
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
      "Error obteniendo recibos.",
      500
    );
  }
}

/*
 * IMPORTANTE
 * ==========================================================
 *
 * Ya NO existe POST público /api/receipts.
 *
 * Un cliente no puede decidir:
 * - receiptNumber
 * - total
 * - items
 * - pdfUrl
 * - establishmentId
 *
 * Los recibos se generan exclusivamente en servidor
 * mediante ReceiptService.createForClosedPaidSession().
 */