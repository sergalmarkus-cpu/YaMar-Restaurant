import {
  NextRequest,
  NextResponse,
} from "next/server";

import QRCode from "qrcode";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import { env } from "@/config/env";

import {
  TableService,
} from "@/services/table.service";

const MANAGEMENT_ROLES = [
  "admin",
  "manager",
] as const;

function isManagementRole(
  role: string
): role is (typeof MANAGEMENT_ROLES)[number] {
  return MANAGEMENT_ROLES.includes(
    role as (typeof MANAGEMENT_ROLES)[number]
  );
}

function handleAuthError(
  error: unknown
) {
  if (!(error instanceof ApiAuthError)) {
    return null;
  }

  switch (error.message) {
    case "AUTH_HEADER_MISSING":
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        {
          status: 401,
        }
      );

    case "AUTH_HEADER_INVALID":
      return NextResponse.json(
        {
          success: false,
          error: "Invalid authorization header",
        },
        {
          status: 401,
        }
      );

    case "TOKEN_EXPIRED":
      return NextResponse.json(
        {
          success: false,
          error: "Authentication token expired",
        },
        {
          status: 401,
        }
      );

    case "TOKEN_INVALID":
      return NextResponse.json(
        {
          success: false,
          error: "Invalid authentication token",
        },
        {
          status: 401,
        }
      );

    default:
      return NextResponse.json(
        {
          success: false,
          error: "Authentication failed",
        },
        {
          status: 401,
        }
      );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const authUser =
      await authenticateRequest(
        request
      );

    if (
      !isManagementRole(
        authUser.role
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No tienes permiso para generar códigos QR.",
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();

    const tableId =
      Number(
        body.tableId
      );

    if (
      !Number.isInteger(
        tableId
      ) ||
      tableId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "El ID de la mesa no es válido.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * La mesa se obtiene utilizando el
     * establishmentId del JWT.
     *
     * Así nunca confiamos en un qrCode
     * enviado por el navegador.
     */
    const table =
      await TableService.getById(
        tableId,
        authUser.establishmentId
      );

    if (!table) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Mesa no encontrada.",
        },
        {
          status: 404,
        }
      );
    }

    if (!table.active) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No se puede generar el QR de una mesa inactiva.",
        },
        {
          status: 409,
        }
      );
    }

    if (!table.qrCode) {
      return NextResponse.json(
        {
          success: false,
          error:
            "La mesa no tiene un código QR válido.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Esta es la ruta real de la
     * experiencia del cliente.
     */
    const baseUrl =
      env.NEXT_PUBLIC_APP_URL.replace(
        /\/$/,
        ""
      );

    const url =
      `${baseUrl}/client/${encodeURIComponent(
        table.qrCode
      )}`;

    const qrImage =
      await QRCode.toDataURL(
        url,
        {
          width: 400,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        }
      );

    return NextResponse.json({
      success: true,

      data: {
        tableId:
          table.id,

        tableCode:
          table.code,

        qrCode:
          table.qrCode,

        qrImage,

        url,
      },
    });
  } catch (error) {
    console.error(
      "Error generating QR:",
      error
    );

    const authResponse =
      handleAuthError(
        error
      );

    if (authResponse) {
      return authResponse;
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Error al generar código QR",
      },
      {
        status: 500,
      }
    );
  }
}