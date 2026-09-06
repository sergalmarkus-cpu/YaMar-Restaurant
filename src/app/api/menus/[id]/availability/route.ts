import {
  NextRequest,
} from "next/server";

import {
  MenuAvailabilityService,
} from "@/services/menu-availability.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

import {
  Logger,
} from "@/services/logger.service";

import {
  RouteParams,
} from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: rawId } =
      await params;

    const menuId =
      Number(rawId);

    if (
      !Number.isInteger(
        menuId
      ) ||
      menuId <= 0
    ) {
      return ApiResponse.error(
        "ID de menú no válido.",
        400
      );
    }

    const { searchParams } =
      new URL(
        request.url
      );

    const dateParam =
      searchParams.get(
        "date"
      );

    let date =
      new Date();

    if (dateParam) {
      date =
        new Date(
          dateParam
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return ApiResponse.error(
          "La fecha proporcionada no es válida.",
          400
        );
      }
    }

    const availability =
      await MenuAvailabilityService.check(
        menuId,
        date
      );

    return ApiResponse.success(
      availability,
      "Disponibilidad del menú obtenida correctamente."
    );
  } catch (error) {
    Logger.error(
      "Error comprobando disponibilidad del menú.",
      error
    );

    if (
      error instanceof Error
    ) {
      switch (
        error.message
      ) {
        case "MENU_NOT_FOUND":
          return ApiResponse.error(
            "Menú no encontrado.",
            404
          );

        case "MENU_INACTIVE":
          return ApiResponse.error(
            "El menú no está activo.",
            409
          );

        case "ESTABLISHMENT_INACTIVE":
          return ApiResponse.error(
            "El establecimiento no está activo.",
            409
          );

        default:
          break;
      }
    }

    return ApiResponse.error(
      "Error comprobando disponibilidad del menú.",
      500
    );
  }
}