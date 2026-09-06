import {
  and,
  asc,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  customerVouchers,
  mealVouchers,
} from "@/db/schema";

import type {
  CustomerVoucherCreateInput,
  CustomerVoucherUpdateInput,
} from "@/validations/customer-voucher.validation";

export class CustomerVoucherService {
  /*
   * ==========================================================
   * VALIDAR VALE DEL TENANT
   * ==========================================================
   */

  private static async getVoucherForEstablishment(
    voucherId: number,
    establishmentId: number
  ) {
    const voucher =
      await db.query.mealVouchers.findFirst({
        where:
          and(
            eq(
              mealVouchers.id,
              voucherId
            ),

            eq(
              mealVouchers.establishmentId,
              establishmentId
            )
          ),
      });

    if (
      !voucher
    ) {
      throw new Error(
        "CUSTOMER_VOUCHER_PARENT_NOT_FOUND"
      );
    }

    return voucher;
  }

  /*
   * ==========================================================
   * LISTAR MEDIANTE JOIN MULTI-TENANT
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId: number
  ) {
    return db
      .select({
        customerVoucher:
          customerVouchers,
      })
      .from(
        customerVouchers
      )
      .innerJoin(
        mealVouchers,
        eq(
          customerVouchers.voucherId,
          mealVouchers.id
        )
      )
      .where(
        eq(
          mealVouchers.establishmentId,
          establishmentId
        )
      )
      .orderBy(
        asc(
          customerVouchers.id
        )
      )
      .then(
        (rows) =>
          rows.map(
            (row) =>
              row.customerVoucher
          )
      );
  }

  /*
   * ==========================================================
   * OBTENER POR ID MEDIANTE JOIN
   * ==========================================================
   */

  static async getByIdForEstablishment(
    id: number,
    establishmentId: number
  ) {
    const rows =
      await db
        .select({
          customerVoucher:
            customerVouchers,
        })
        .from(
          customerVouchers
        )
        .innerJoin(
          mealVouchers,
          eq(
            customerVouchers.voucherId,
            mealVouchers.id
          )
        )
        .where(
          and(
            eq(
              customerVouchers.id,
              id
            ),

            eq(
              mealVouchers.establishmentId,
              establishmentId
            )
          )
        )
        .limit(1);

    return (
      rows[0]?.customerVoucher ??
      null
    );
  }

  static async createForEstablishment(
    establishmentId: number,
    data: CustomerVoucherCreateInput
  ) {
    await this.getVoucherForEstablishment(
      data.voucherId,
      establishmentId
    );

    const used =
      Number(
        data.creditsUsed
      );

    const remaining =
      Number(
        data.creditsRemaining
      );

    if (
      !Number.isFinite(
        used
      ) ||
      used < 0 ||
      !Number.isFinite(
        remaining
      ) ||
      remaining < 0
    ) {
      throw new Error(
        "INVALID_CUSTOMER_VOUCHER_CREDITS"
      );
    }

    const inserted =
      await db
        .insert(
          customerVouchers
        )
        .values({
          voucherId:
            data.voucherId,

          customerEmail:
            data.customerEmail
              ?.trim()
              .toLowerCase() ??
            null,

          roomNumber:
            data.roomNumber ??
            null,

          creditsUsed:
            used.toFixed(2),

          creditsRemaining:
            remaining.toFixed(2),

          active:
            data.active,
        })
        .returning();

    return (
      inserted[0] ??
      null
    );
  }

  static async updateForEstablishment(
    id: number,
    establishmentId: number,
    data: CustomerVoucherUpdateInput
  ) {
    const existing =
      await this.getByIdForEstablishment(
        id,
        establishmentId
      );

    if (
      !existing
    ) {
      return null;
    }

    const updateData: Record<
      string,
      unknown
    > = {};

    if (
      data.customerEmail !==
      undefined
    ) {
      updateData.customerEmail =
        data.customerEmail
          ?.trim()
          .toLowerCase() ??
        null;
    }

    if (
      data.roomNumber !==
      undefined
    ) {
      updateData.roomNumber =
        data.roomNumber;
    }

    if (
      data.creditsUsed !==
      undefined
    ) {
      updateData.creditsUsed =
        Number(
          data.creditsUsed
        ).toFixed(2);
    }

    if (
      data.creditsRemaining !==
      undefined
    ) {
      updateData.creditsRemaining =
        Number(
          data.creditsRemaining
        ).toFixed(2);
    }

    if (
      data.active !==
      undefined
    ) {
      updateData.active =
        data.active;
    }

    if (
      Object.keys(
        updateData
      ).length ===
      0
    ) {
      return existing;
    }

    const updated =
      await db
        .update(
          customerVouchers
        )
        .set({
          ...updateData,

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            customerVouchers.id,
            id
          )
        )
        .returning();

    return (
      updated[0] ??
      null
    );
  }

  static async deleteForEstablishment(
    id: number,
    establishmentId: number
  ) {
    const existing =
      await this.getByIdForEstablishment(
        id,
        establishmentId
      );

    if (
      !existing
    ) {
      return null;
    }

    const deleted =
      await db
        .delete(
          customerVouchers
        )
        .where(
          eq(
            customerVouchers.id,
            id
          )
        )
        .returning();

    return (
      deleted[0] ??
      null
    );
  }
}