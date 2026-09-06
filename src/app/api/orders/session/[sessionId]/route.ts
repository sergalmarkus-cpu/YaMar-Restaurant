import {
  NextRequest,
} from "next/server";

import {
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  orders,
} from "@/db/schema";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  Logger,
} from "@/services/logger.service";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      sessionId: string;
    }>;
  }
) {
  try {
    const {
      sessionId,
    } = await params;

    const result =
      await db.query.orders.findMany(
        {
          where: eq(
            orders.sessionId,
            sessionId
          ),

          with: {
            items: {
              with: {
                product: true,
              },
            },
          },

          orderBy: (
            orders,
            { asc }
          ) => [
            asc(
              orders.createdAt
            ),
          ],
        }
      );

    return ApiResponse.success(
      result,
      "Pedidos de la sesión obtenidos correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error obteniendo pedidos de la sesión.",
      error
    );

    return ApiResponse.error(
      "Error obteniendo pedidos de la sesión.",
      500
    );
  }
}