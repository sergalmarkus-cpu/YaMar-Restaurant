import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  BillSplitSchema,
} from "@/validations/bill-split.validation";

import {
  BillSplitService,
} from "@/services/bill-split.service";

import {
  Logger,
} from "@/services/logger.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

const BILL_SPLIT_READ_ROLES = [
  "admin",
  "manager",
  "cashier",
] as const;

function hasBillSplitReadRole(
  role: string
): role is (typeof BILL_SPLIT_READ_ROLES)[number] {
  return BILL_SPLIT_READ_ROLES.includes(
    role as (typeof BILL_SPLIT_READ_ROLES)[number]
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
 * GET
 *
 * Operación administrativa.
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

    if (
      !hasBillSplitReadRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar divisiones de cuenta.",
        403
      );
    }

    const sessionId =
      request.nextUrl.searchParams.get(
        "sessionId"
      ) ??
      undefined;

    if (
      sessionId
    ) {
      const parsed =
        BillSplitSchema
          .shape
          .sessionId
          .safeParse(
            sessionId
          );

      if (
        !parsed.success
      ) {
        return ApiResponse.error(
          "sessionId inválido.",
          400,
          parsed.error.issues
        );
      }
    }

    const result =
      await BillSplitService
        .listForEstablishment(
          authUser.establishmentId,
          sessionId
        );

    return ApiResponse.success(
      result,
      "Divisiones de cuenta obtenidas correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo divisiones de cuenta.",
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
      "Error obteniendo divisiones de cuenta.",
      500
    );
  }
}

/*
 * ==========================================================
 * POST
 *
 * Flujo cliente.
 * La propia sesión determina el contexto del reparto.
 * ==========================================================
 */

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      BillSplitSchema.parse(
        await request.json()
      );

    const billSplit =
      await BillSplitService.create(
        body
      );

    return ApiResponse.success(
      billSplit,
      "División de cuenta creada correctamente.",
      201
    );
  } catch (
    error: any
  ) {
    Logger.error(
      "Error creando división de cuenta.",
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

    if (
      error instanceof
      Error
    ) {
      const validationMessages = [
        "La sesión no existe.",
        "La sesión ya está cerrada.",
        "La sesión no tiene pedidos válidos para dividir.",
        "La sesión no tiene pedidos válidos.",
        "El reparto igualitario requiere al menos dos participantes.",
        "Los porcentajes del reparto deben sumar exactamente 100%.",
        "Los importes del reparto deben sumar exactamente",
        "Tipo de división no válido.",
      ];

      const isValidationError =
        validationMessages.some(
          (
            message
          ) =>
            error.message.startsWith(
              message
            )
        );

      if (
        isValidationError
      ) {
        return ApiResponse.error(
          error.message,
          400
        );
      }

      if (
        error.message.includes(
          "Porcentaje inválido"
        ) ||
        error.message.includes(
          "Importe inválido"
        ) ||
        error.message.includes(
          "no tiene artículos asignados"
        ) ||
        error.message.includes(
          "no pertenece a la sesión"
        ) ||
        error.message.includes(
          "Cantidad inválida"
        ) ||
        error.message.includes(
          "supera la cantidad pedida"
        ) ||
        error.message.includes(
          "Los artículos asignados suman"
        )
      ) {
        return ApiResponse.error(
          error.message,
          400
        );
      }
    }

    return ApiResponse.error(
      "No se pudo crear la división de cuenta.",
      500
    );
  }
}