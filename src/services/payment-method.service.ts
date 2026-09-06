import {
  and,
  asc,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  establishments,
  paymentMethods,
} from "@/db/schema";

import type {
  PaymentMethodUpdateInput,
} from "@/validations/payment-method.validation";

type PaymentMethod =
  | "card"
  | "cash"
  | "transfer"
  | "paypal"
  | "apple_pay"
  | "google_pay";

interface DefaultPaymentMethod {
  method: PaymentMethod;
  displayName: string;
  sortOrder: number;
}

const DEFAULT_PAYMENT_METHODS:
  DefaultPaymentMethod[] =
  [
    {
      method: "card",
      displayName: "Tarjeta",
      sortOrder: 10,
    },
    {
      method: "cash",
      displayName: "Efectivo",
      sortOrder: 20,
    },
    {
      method: "transfer",
      displayName: "Transferencia bancaria",
      sortOrder: 30,
    },
    {
      method: "paypal",
      displayName: "PayPal",
      sortOrder: 40,
    },
    {
      method: "apple_pay",
      displayName: "Apple Pay",
      sortOrder: 50,
    },
    {
      method: "google_pay",
      displayName: "Google Pay",
      sortOrder: 60,
    },
  ];

export class PaymentMethodService {
  /*
   * ==========================================================
   * ESTABLECIMIENTO
   * ==========================================================
   */

  private static async establishmentExists(
    establishmentId: number
  ) {
    const rows =
      await db
        .select({
          id: establishments.id,
        })
        .from(
          establishments
        )
        .where(
          eq(
            establishments.id,
            establishmentId
          )
        )
        .limit(
          1
        );

    return Boolean(
      rows[0]
    );
  }

  /*
   * ==========================================================
   * INICIALIZACIÓN AUTOMÁTICA
   * ==========================================================
   */

  static async ensureDefaults(
    establishmentId: number
  ) {
    const exists =
      await this.establishmentExists(
        establishmentId
      );

    if (!exists) {
      return false;
    }

    const existing =
      await db
        .select({
          method: paymentMethods.method,
        })
        .from(
          paymentMethods
        )
        .where(
          eq(
            paymentMethods.establishmentId,
            establishmentId
          )
        );

    const existingMethods =
      new Set(
        existing.map(
          (row) =>
            row.method
        )
      );

    const missing =
      DEFAULT_PAYMENT_METHODS.filter(
        (item) =>
          !existingMethods.has(
            item.method
          )
      );

    if (
      missing.length ===
      0
    ) {
      return true;
    }

    await db
      .insert(
        paymentMethods
      )
      .values(
        missing.map(
          (item) => ({
            establishmentId,
            method:
              item.method,
            enabled:
              true,
            displayName:
              item.displayName,
            sortOrder:
              item.sortOrder,
          })
        )
      )
      .onConflictDoNothing();

    return true;
  }

  /*
   * ==========================================================
   * LISTAR
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId: number
  ) {
    const initialized =
      await this.ensureDefaults(
        establishmentId
      );

    if (!initialized) {
      return null;
    }

    return db
      .select()
      .from(
        paymentMethods
      )
      .where(
        eq(
          paymentMethods.establishmentId,
          establishmentId
        )
      )
      .orderBy(
        asc(
          paymentMethods.sortOrder
        ),
        asc(
          paymentMethods.id
        )
      );
  }

  /*
   * ==========================================================
   * OBTENER POR ID
   * ==========================================================
   */

  static async getByIdForEstablishment(
    id: number,
    establishmentId: number
  ) {
    return db.query
      .paymentMethods
      .findFirst({
        where:
          and(
            eq(
              paymentMethods.id,
              id
            ),
            eq(
              paymentMethods.establishmentId,
              establishmentId
            )
          ),
      });
  }

  /*
   * ==========================================================
   * ACTUALIZAR
   * ==========================================================
   */

  static async updateForEstablishment(
    id: number,
    establishmentId: number,
    data:
      PaymentMethodUpdateInput
  ) {
    const existing =
      await this
        .getByIdForEstablishment(
          id,
          establishmentId
        );

    if (!existing) {
      return null;
    }

    const updated =
      await db
        .update(
          paymentMethods
        )
        .set({
          ...(data.enabled !==
          undefined
            ? {
                enabled:
                  data.enabled,
              }
            : {}),

          ...(data.displayName !==
          undefined
            ? {
                displayName:
                  data.displayName,
              }
            : {}),

          ...(data.sortOrder !==
          undefined
            ? {
                sortOrder:
                  data.sortOrder,
              }
            : {}),

          updatedAt:
            new Date(),
        })
        .where(
          and(
            eq(
              paymentMethods.id,
              id
            ),
            eq(
              paymentMethods.establishmentId,
              establishmentId
            )
          )
        )
        .returning();

    return (
      updated[0] ??
      null
    );
  }
}