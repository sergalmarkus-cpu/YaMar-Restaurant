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
  ReceiptPdfService,
} from "@/services/receipt-pdf.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  RouteParams,
} from "@/types/api";

const RECEIPT_PDF_ROLES = [
  "admin",
  "manager",
  "cashier",
] as const;

function hasReceiptPdfRole(
  role: string
): role is (
  typeof RECEIPT_PDF_ROLES
)[number] {
  return RECEIPT_PDF_ROLES.includes(
    role as (
      typeof RECEIPT_PDF_ROLES
    )[number]
  );
}

function parseReceiptId(
  value: string
): number | null {
  const id =
    Number(
      value
    );

  if (
    !Number.isInteger(
      id
    ) ||
    id <= 0
  ) {
    return null;
  }

  return id;
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
      !hasReceiptPdfRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar el PDF del recibo.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseReceiptId(
        rawId
      );

    if (
      id ===
      null
    ) {
      return ApiResponse.error(
        "ID de recibo no válido.",
        400
      );
    }

    /*
     * El establecimiento procede exclusivamente
     * del JWT. No aceptamos establishmentId
     * desde query ni body.
     */
    const receipt =
      await ReceiptService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (
      !receipt
    ) {
      return ApiResponse.error(
        "Recibo no encontrado.",
        404
      );
    }

    const {
      bytes,
      filename,
    } =
      await ReceiptPdfService
        .generate(
          receipt
        );

    /*
     * Guardamos únicamente la URL lógica.
     *
     * El PDF se genera bajo demanda y no
     * necesita almacenamiento externo.
     */
    const pdfUrl =
      `/api/receipts/${receipt.id}/pdf`;

    if (
      receipt.pdfUrl !==
      pdfUrl
    ) {
      await ReceiptService
        .updateForEstablishment(
          receipt.id,
          authUser.establishmentId,
          {
            pdfUrl,
          }
        );
    }

    return new Response(
      bytes,
      {
        status:
          200,

        headers:
          {
            "Content-Type":
              "application/pdf",

            "Content-Disposition":
              `inline; filename="${filename}"`,

            "Content-Length":
              String(
                bytes.byteLength
              ),

            "Cache-Control":
              "private, no-store",
          },
      }
    );
  } catch (
    error: unknown
  ) {
    Logger.error(
      "Error generando PDF del recibo.",
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
      "Error generando PDF del recibo.",
      500
    );
  }
}