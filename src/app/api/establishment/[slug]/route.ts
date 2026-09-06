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
  tables,
} from "@/db/schema";

function publicFields() {
  return {
    id:
      establishments.id,

    name:
      establishments.name,

    slug:
      establishments.slug,

    description:
      establishments.description,

    address:
      establishments.address,

    phone:
      establishments.phone,

    email:
      establishments.email,

    latitude:
      establishments.latitude,

    longitude:
      establishments.longitude,

    maxDeliveryDistance:
      establishments.maxDeliveryDistance,

    geoFenceEnabled:
      establishments.geoFenceEnabled,

    logo:
      establishments.logo,

    primaryColor:
      establishments.primaryColor,

    secondaryColor:
      establishments.secondaryColor,

    currency:
      establishments.currency,

    timezone:
      establishments.timezone,

    defaultLanguage:
      establishments.defaultLanguage,

    enabledLanguages:
      establishments.enabledLanguages,

    features:
      establishments.features,

    active:
      establishments.active,
  };
}

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  try {
    const {
      slug: rawIdentifier,
    } =
      await params;

    const identifier =
      rawIdentifier?.trim();

    if (
      !identifier
    ) {
      return NextResponse.json(
        {
          error:
            "Establishment identifier is required",
        },
        {
          status:
            400,
        }
      );
    }

    /*
     * ==========================================================
     * BUSCAR POR SLUG
     * ==========================================================
     */

    const [
      bySlug,
    ] =
      await db
        .select(
          publicFields()
        )
        .from(
          establishments
        )
        .where(
          and(
            eq(
              establishments.slug,
              identifier
            ),

            eq(
              establishments.active,
              true
            )
          )
        )
        .limit(1);

    if (
      bySlug
    ) {
      return NextResponse.json(
        bySlug
      );
    }

    /*
     * ==========================================================
     * BUSCAR POR QR DE MESA
     * ==========================================================
     */

    const [
      table,
    ] =
      await db
        .select({
          establishmentId:
            tables.establishmentId,
        })
        .from(
          tables
        )
        .where(
          and(
            eq(
              tables.qrCode,
              identifier
            ),

            eq(
              tables.active,
              true
            )
          )
        )
        .limit(1);

    if (
      !table
    ) {
      return NextResponse.json(
        {
          error:
            "Establishment not found",
        },
        {
          status:
            404,
        }
      );
    }

    const [
      establishment,
    ] =
      await db
        .select(
          publicFields()
        )
        .from(
          establishments
        )
        .where(
          and(
            eq(
              establishments.id,
              table.establishmentId
            ),

            eq(
              establishments.active,
              true
            )
          )
        )
        .limit(1);

    if (
      !establishment
    ) {
      return NextResponse.json(
        {
          error:
            "Establishment not found",
        },
        {
          status:
            404,
        }
      );
    }

    return NextResponse.json(
      establishment
    );
  } catch (
    error
  ) {
    console.error(
      "Error fetching establishment:",
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