import {
  and,
  eq,
  ne,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  establishments,
} from "@/db/schema";

import type {
  EstablishmentFeaturesInput,
  EstablishmentUpdateInput,
} from "@/validations/establishment.validation";

const DEFAULT_FEATURES = {
  geolocation: true,
  onlinePayment: true,
  splitBill: true,
  ratings: true,
  loyalty: false,
  reservations: false,
  callWaiter: true,
};

function normalizeFeatures(
  value: unknown
): Required<EstablishmentFeaturesInput> {
  if (
    typeof value !==
      "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return {
      ...DEFAULT_FEATURES,
    };
  }

  const record =
    value as Record<
      string,
      unknown
    >;

  return {
    geolocation:
      typeof record.geolocation ===
      "boolean"
        ? record.geolocation
        : DEFAULT_FEATURES.geolocation,

    onlinePayment:
      typeof record.onlinePayment ===
      "boolean"
        ? record.onlinePayment
        : DEFAULT_FEATURES.onlinePayment,

    splitBill:
      typeof record.splitBill ===
      "boolean"
        ? record.splitBill
        : DEFAULT_FEATURES.splitBill,

    ratings:
      typeof record.ratings ===
      "boolean"
        ? record.ratings
        : DEFAULT_FEATURES.ratings,

    loyalty:
      typeof record.loyalty ===
      "boolean"
        ? record.loyalty
        : DEFAULT_FEATURES.loyalty,

    reservations:
      typeof record.reservations ===
      "boolean"
        ? record.reservations
        : DEFAULT_FEATURES.reservations,

    callWaiter:
      typeof record.callWaiter ===
      "boolean"
        ? record.callWaiter
        : DEFAULT_FEATURES.callWaiter,
  };
}

export class EstablishmentService {
  static async getById(
    id: number
  ) {
    return (
      await db.query.establishments.findFirst({
        where: eq(
          establishments.id,
          id
        ),
      })
    ) ?? null;
  }

  static async getForAuthenticatedEstablishment(
    establishmentId: number
  ) {
    return this.getById(
      establishmentId
    );
  }

  static async validateSlug(
    slug: string,
    excludeId: number
  ) {
    const existing =
      await db.query.establishments.findFirst({
        where: and(
          eq(
            establishments.slug,
            slug
          ),

          ne(
            establishments.id,
            excludeId
          )
        ),
      });

    if (existing) {
      throw new Error(
        "ESTABLISHMENT_SLUG_EXISTS"
      );
    }
  }

  static async updateForEstablishment(
    id: number,
    authenticatedEstablishmentId: number,
    data: EstablishmentUpdateInput
  ) {
    if (
      id !==
      authenticatedEstablishmentId
    ) {
      return null;
    }

    const existing =
      await this.getById(
        id
      );

    if (!existing) {
      return null;
    }

    if (
      data.slug !==
      undefined
    ) {
      await this.validateSlug(
        data.slug,
        id
      );
    }

    const updateData: Record<
      string,
      unknown
    > = {
      updatedAt:
        new Date(),
    };

    if (
      data.name !==
      undefined
    ) {
      updateData.name =
        data.name;
    }

    if (
      data.slug !==
      undefined
    ) {
      updateData.slug =
        data.slug;
    }

    if (
      data.description !==
      undefined
    ) {
      updateData.description =
        data.description;
    }

    if (
      data.address !==
      undefined
    ) {
      updateData.address =
        data.address;
    }

    if (
      data.phone !==
      undefined
    ) {
      updateData.phone =
        data.phone;
    }

    if (
      data.email !==
      undefined
    ) {
      updateData.email =
        data.email;
    }

    if (
      data.latitude !==
      undefined
    ) {
      updateData.latitude =
        data.latitude === null
          ? null
          : data.latitude.toFixed(
              7
            );
    }

    if (
      data.longitude !==
      undefined
    ) {
      updateData.longitude =
        data.longitude === null
          ? null
          : data.longitude.toFixed(
              7
            );
    }

    if (
      data.maxDeliveryDistance !==
      undefined
    ) {
      updateData.maxDeliveryDistance =
        data.maxDeliveryDistance;
    }

    if (
      data.geoFenceEnabled !==
      undefined
    ) {
      updateData.geoFenceEnabled =
        data.geoFenceEnabled;
    }

    if (
      data.logo !==
      undefined
    ) {
      updateData.logo =
        data.logo;
    }

    if (
      data.primaryColor !==
      undefined
    ) {
      updateData.primaryColor =
        data.primaryColor;
    }

    if (
      data.secondaryColor !==
      undefined
    ) {
      updateData.secondaryColor =
        data.secondaryColor;
    }

    if (
      data.currency !==
      undefined
    ) {
      updateData.currency =
        data.currency;
    }

    if (
      data.timezone !==
      undefined
    ) {
      updateData.timezone =
        data.timezone;
    }

    if (
      data.features !==
      undefined
    ) {
      updateData.features = {
        ...normalizeFeatures(
          existing.features
        ),
        ...data.features,
      };
    }

    if (
      data.active !==
      undefined
    ) {
      updateData.active =
        data.active;
    }

    const updated =
      await db
        .update(
          establishments
        )
        .set(
          updateData
        )
        .where(
          and(
            eq(
              establishments.id,
              id
            ),

            eq(
              establishments.id,
              authenticatedEstablishmentId
            )
          )
        )
        .returning();

    return (
      updated[0] ??
      null
    );
  }

  static async deactivateForEstablishment(
    id: number,
    authenticatedEstablishmentId: number
  ) {
    if (
      id !==
      authenticatedEstablishmentId
    ) {
      return null;
    }

    const updated =
      await db
        .update(
          establishments
        )
        .set({
          active:
            false,

          updatedAt:
            new Date(),
        })
        .where(
          and(
            eq(
              establishments.id,
              id
            ),

            eq(
              establishments.id,
              authenticatedEstablishmentId
            )
          )
        )
        .returning();

    return (
      updated[0] ??
      null
    );
  }

  static async getPublicByIdentifier(
    identifier: string
  ) {
    const establishment =
      await db.query.establishments.findFirst({
        where: and(
          eq(
            establishments.slug,
            identifier
          ),

          eq(
            establishments.active,
            true
          )
        ),
      });

    return (
      establishment ??
      null
    );
  }
}