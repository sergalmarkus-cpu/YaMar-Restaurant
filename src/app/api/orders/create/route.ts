import { NextRequest } from "next/server";

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
          "Modificador"
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