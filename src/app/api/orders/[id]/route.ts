import { NextRequest } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import {
  OrderUpdateSchema,
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

import {
  RouteParams,
} from "@/types/api";

const ORDER_READ_ROLES = [
  "admin",
  "manager",
  "waiter",
  "kitchen",
  "bar",
  "cashier",
] as const;

const ORDER_UPDATE_ROLES = [
  "admin",
  "manager",
  "waiter",
  "kitchen",
  "bar",
  "cashier",
] as const;

const ORDER_DELETE_ROLES = [
  "admin",
  "manager",
] as const;

function hasRole<
  T extends readonly string[]
>(
  role: string,
  roles: T
): role is T[number] {
  return roles.includes(
    role as T[number]
  );
}

function parseOrderId(
  value: string
): number | null {
  const id =
    Number(value);

  if (
    !Number.isInteger(id) ||
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
 * ==========================================================
 */

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
      !hasRole(
        authUser.role,
        ORDER_READ_ROLES
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para consultar pedidos.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseOrderId(
        rawId
      );

    if (id === null) {
      return ApiResponse.error(
        "ID de pedido no válido.",
        400
      );
    }

    const order =
      await OrderService
        .getByIdForEstablishment(
          id,
          authUser.establishmentId
        );

    if (!order) {
      return ApiResponse.error(
        "Pedido no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      order,
      "Pedido obtenido correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo pedido.",
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
      "Error obteniendo pedido.",
      500
    );
  }
}

/*
 * ==========================================================
 * ACTUALIZAR
 * ==========================================================
 */

async function updateOrder(
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
      !hasRole(
        authUser.role,
        ORDER_UPDATE_ROLES
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para actualizar pedidos.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseOrderId(
        rawId
      );

    if (id === null) {
      return ApiResponse.error(
        "ID de pedido no válido.",
        400
      );
    }

    const body =
      OrderUpdateSchema.parse(
        await request.json()
      );

    const order =
      await OrderService
        .updateForEstablishment(
          id,
          authUser.establishmentId,
          body
        );

    if (!order) {
      return ApiResponse.error(
        "Pedido no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      order,
      "Pedido actualizado correctamente."
    );
  } catch (error: any) {
    Logger.error(
      "Error actualizando pedido.",
      error
    );

    const authResponse =
      handleAuthError(
        error
      );

    if (authResponse) {
      return authResponse;
    }

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

    return ApiResponse.error(
      "Error actualizando pedido.",
      500
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  return updateOrder(
    request,
    context
  );
}

export async function PATCH(
  request: NextRequest,
  context: RouteParams
) {
  return updateOrder(
    request,
    context
  );
}

/*
 * ==========================================================
 * DELETE
 * ==========================================================
 */

export async function DELETE(
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
      !hasRole(
        authUser.role,
        ORDER_DELETE_ROLES
      )
    ) {
      return ApiResponse.error(
        "No tienes permisos para eliminar pedidos.",
        403
      );
    }

    const {
      id: rawId,
    } =
      await params;

    const id =
      parseOrderId(
        rawId
      );

    if (id === null) {
      return ApiResponse.error(
        "ID de pedido no válido.",
        400
      );
    }

    const deleted =
      await OrderService
        .deleteForEstablishment(
          id,
          authUser.establishmentId
        );

    if (!deleted) {
      return ApiResponse.error(
        "Pedido no encontrado.",
        404
      );
    }

    return ApiResponse.success(
      null,
      "Pedido eliminado correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error eliminando pedido.",
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
      "Error eliminando pedido.",
      500
    );
  }
}