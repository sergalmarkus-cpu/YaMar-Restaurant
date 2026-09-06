import {
  NextRequest,
} from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  db,
} from "@/db";

import {
  orders,
  tables,
} from "@/db/schema";

import {
  desc,
  eq,
} from "drizzle-orm";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  Logger,
} from "@/services/logger.service";

const KITCHEN_ROLES = [
  "admin",
  "manager",
  "kitchen",
] as const;

function isKitchenRole(
  role: string
): role is (typeof KITCHEN_ROLES)[number] {
  return KITCHEN_ROLES.includes(
    role as (typeof KITCHEN_ROLES)[number]
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

export async function GET(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    if (
      !isKitchenRole(
        authUser.role
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar cocina.",
        403
      );
    }

    /*
     * IMPORTANTE:
     *
     * Solo devolvemos pedidos pertenecientes
     * al establecimiento autenticado.
     */
    const result =
      await db
        .select({
          id:
            orders.id,

          orderNumber:
            orders.orderNumber,

          tableId:
            orders.tableId,

          tableName:
            tables.code,

          status:
            orders.status,

          total:
            orders.total,

          notes:
            orders.notes,

          createdAt:
            orders.createdAt,
        })
        .from(
          orders
        )
        .leftJoin(
          tables,
          eq(
            orders.tableId,
            tables.id
          )
        )
        .where(
          eq(
            orders.establishmentId,
            authUser.establishmentId
          )
        )
        .orderBy(
          desc(
            orders.createdAt
          )
        );

    return ApiResponse.success(
      result,
      "Pedidos de cocina obtenidos correctamente."
    );
  } catch (
    error
  ) {
    Logger.error(
      "Error obteniendo pedidos de cocina.",
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
      "Error obteniendo pedidos de cocina.",
      500
    );
  }
}