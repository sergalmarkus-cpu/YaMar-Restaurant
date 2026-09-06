import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  and,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  establishments,
  sessions,
  tables,
} from "@/db/schema";

import {
  isWithinGeofence,
} from "@/lib/utils";

import {
  isSupportedLanguage,
} from "@/config/languages";

import type {
  Language,
} from "@/types";

function resolveSessionLanguage(
  requestedLanguage: unknown,
  defaultLanguage: unknown,
  enabledLanguages: unknown
): Language {
  const enabled =
    Array.isArray(
      enabledLanguages
    )
      ? enabledLanguages.filter(
          (
            value
          ): value is Language =>
            isSupportedLanguage(
              value
            )
        )
      : [];

  /*
   * Protección final por si la configuración
   * lingüística del establecimiento estuviera
   * inesperadamente vacía o dañada.
   */
  const safeEnabled =
    enabled.length >
    0
      ? enabled
      : [
          "es" as Language,
        ];

  /*
   * Si el idioma solicitado está soportado
   * globalmente y habilitado para este tenant,
   * se respeta.
   */
  if (
    isSupportedLanguage(
      requestedLanguage
    ) &&
    safeEnabled.includes(
      requestedLanguage
    )
  ) {
    return requestedLanguage;
  }

  /*
   * Si el idioma solicitado no está permitido,
   * usamos el idioma predeterminado siempre que
   * también sea válido y esté habilitado.
   */
  if (
    isSupportedLanguage(
      defaultLanguage
    ) &&
    safeEnabled.includes(
      defaultLanguage
    )
  ) {
    return defaultLanguage;
  }

  /*
   * Último fallback seguro.
   */
  return safeEnabled[0];
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const {
      qrCode,
      customerName,
      customerEmail,
      customerPhone,
      roomNumber,
      latitude,
      longitude,
      deviceId,
      language,
    } =
      body;

    /*
     * ==========================================================
     * 1. VALIDAR QR
     * ==========================================================
     */

    if (
      typeof qrCode !==
        "string" ||
      !qrCode.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid QR code",
        },
        {
          status:
            400,
        }
      );
    }

    const [
      table,
    ] =
      await db
        .select()
        .from(
          tables
        )
        .where(
          and(
            eq(
              tables.qrCode,
              qrCode.trim()
            ),

            eq(
              tables.active,
              true
            )
          )
        )
        .limit(
          1
        );

    if (
      !table
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid QR code",
        },
        {
          status:
            400,
        }
      );
    }

    /*
     * ==========================================================
     * 2. ESTABLECIMIENTO
     * ==========================================================
     */

    const [
      establishment,
    ] =
      await db
        .select()
        .from(
          establishments
        )
        .where(
          eq(
            establishments.id,
            table.establishmentId
          )
        )
        .limit(
          1
        );

    if (
      !establishment ||
      !establishment.active
    ) {
      return NextResponse.json(
        {
          error:
            "Establishment not available",
        },
        {
          status:
            400,
        }
      );
    }

    /*
     * ==========================================================
     * 3. IDIOMA EFECTIVO DEL CLIENTE
     * ==========================================================
     *
     * La elección solicitada debe:
     *
     * 1. estar soportada globalmente por YaMar;
     * 2. estar habilitada en este establecimiento.
     *
     * Si no cumple las reglas usamos el idioma
     * predeterminado del establecimiento.
     */

    const resolvedLanguage =
      resolveSessionLanguage(
        language,
        establishment.defaultLanguage,
        establishment.enabledLanguages
      );

    /*
     * ==========================================================
     * 4. GEOFENCE
     * ==========================================================
     */

    if (
      establishment.geoFenceEnabled &&
      latitude &&
      longitude &&
      establishment.latitude &&
      establishment.longitude
    ) {
      const parsedLatitude =
        Number(
          latitude
        );

      const parsedLongitude =
        Number(
          longitude
        );

      if (
        !Number.isFinite(
          parsedLatitude
        ) ||
        !Number.isFinite(
          parsedLongitude
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid location coordinates",
          },
          {
            status:
              400,
          }
        );
      }

      const isWithinArea =
        isWithinGeofence(
          parsedLatitude,
          parsedLongitude,
          Number(
            establishment.latitude
          ),
          Number(
            establishment.longitude
          ),
          establishment.maxDeliveryDistance ??
            100
        );

      if (
        !isWithinArea
      ) {
        return NextResponse.json(
          {
            error:
              "You are too far from the establishment",
          },
          {
            status:
              400,
          }
        );
      }
    }

    /*
     * ==========================================================
     * 5. SESIÓN ACTIVA DE LA MESA
     * ==========================================================
     *
     * La restricción sessions_active_table_unique establece
     * que solamente puede existir una sesión activa por:
     *
     *   establishmentId + tableId
     *
     * Por tanto, deviceId NO puede determinar si debemos crear
     * otra sesión.
     *
     * Varios teléfonos de una misma mesa comparten la misma
     * sesión de restaurante.
     */

    const [
      existingSession,
    ] =
      await db
        .select()
        .from(
          sessions
        )
        .where(
          and(
            eq(
              sessions.establishmentId,
              table.establishmentId
            ),

            eq(
              sessions.tableId,
              table.id
            ),

            eq(
              sessions.active,
              true
            )
          )
        )
        .limit(
          1
        );

    if (
      existingSession
    ) {
      /*
       * La existencia de una sesión activa implica que
       * la mesa está ocupada.
       *
       * Esto también repara estados antiguos incoherentes
       * como una mesa "available" con sesión activa.
       */
      if (
        table.status !==
        "occupied"
      ) {
        await db
          .update(
            tables
          )
          .set({
            status:
              "occupied",

            updatedAt:
              new Date(),
          })
          .where(
            eq(
              tables.id,
              table.id
            )
          );
      }

      /*
       * MUY IMPORTANTE:
       *
       * No sobrescribimos existingSession.language.
       *
       * La sesión puede ser compartida por varios dispositivos
       * y cada cliente puede visualizar YaMar en un idioma
       * diferente.
       *
       * Devolvemos al dispositivo su idioma efectivo, pero
       * no convertimos esa preferencia individual en una
       * modificación global de la sesión compartida.
       */
      return NextResponse.json({
        ...existingSession,

        language:
          resolvedLanguage,

        reused:
          true,
      });
    }

    /*
     * ==========================================================
     * 6. CREAR NUEVA SESIÓN
     * ==========================================================
     */

    const [
      newSession,
    ] =
      await db
        .insert(
          sessions
        )
        .values({
          tableId:
            table.id,

          establishmentId:
            table.establishmentId,

          customerName,

          customerEmail,

          customerPhone,

          roomNumber,

          latitude,

          longitude,

          deviceId,

          language:
            resolvedLanguage,

          active:
            true,
        })
        .returning();

    /*
     * ==========================================================
     * 7. OCUPAR MESA
     * ==========================================================
     */

    await db
      .update(
        tables
      )
      .set({
        status:
          "occupied",

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          tables.id,
          table.id
        )
      );

    return NextResponse.json({
      ...newSession,

      reused:
        false,
    });
  } catch (
    error
  ) {
    console.error(
      "Error creating session:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      {
        status:
          500,
      }
    );
  }
}