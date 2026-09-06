import {
  and,
  asc,
  eq,
  ne,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  receipts,
  sessions,
  orders,
  orderItems,
  payments,
  products,
} from "@/db/schema";

import {
  ReceiptUpdateInput,
} from "@/validations/receipt.validation";

import {
  Logger,
} from "./logger.service";

export class ReceiptService {
  private static round(
    value: number
  ) {
    return (
      Math.round(
        (
          value +
          Number.EPSILON
        ) *
          100
      ) /
      100
    );
  }

  /*
   * ==========================================================
   * SESIÓN
   * ==========================================================
   */

  private static async getSession(
    sessionId: string
  ) {
    const session =
      await db.query.sessions.findFirst({
        where:
          eq(
            sessions.id,
            sessionId
          ),
      });

    if (
      !session
    ) {
      throw new Error(
        "La sesión no existe."
      );
    }

    return session;
  }

  /*
   * ==========================================================
   * TOTALES
   * ==========================================================
   */

  private static async getSessionTotal(
    sessionId: string
  ) {
    const sessionOrders =
      await db
        .select()
        .from(
          orders
        )
        .where(
          and(
            eq(
              orders.sessionId,
              sessionId
            ),

            ne(
              orders.status,
              "cancelled"
            )
          )
        );

    return this.round(
      sessionOrders.reduce(
        (
          sum,
          order
        ) =>
          sum +
          Number(
            order.total
          ),
        0
      )
    );
  }

  private static async getPaidTotal(
    sessionId: string
  ) {
    const sessionPayments =
      await db
        .select()
        .from(
          payments
        )
        .where(
          and(
            eq(
              payments.sessionId,
              sessionId
            ),

            eq(
              payments.status,
              "paid"
            )
          )
        );

    return this.round(
      sessionPayments.reduce(
        (
          sum,
          payment
        ) =>
          sum +
          Number(
            payment.amount
          ),
        0
      )
    );
  }

  /*
   * ==========================================================
   * NÚMERO DE RECIBO
   * ==========================================================
   */

  private static createReceiptNumber(
    establishmentId: number,
    sessionId: string
  ) {
    const now =
      new Date();

    const year =
      now
        .getUTCFullYear()
        .toString();

    const month =
      String(
        now.getUTCMonth() +
          1
      ).padStart(
        2,
        "0"
      );

    const day =
      String(
        now.getUTCDate()
      ).padStart(
        2,
        "0"
      );

    const time =
      [
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds(),
      ]
        .map(
          (
            value,
            index
          ) =>
            String(
              value
            ).padStart(
              index ===
                3
                ? 3
                : 2,
              "0"
            )
        )
        .join(
          ""
        );

    const sessionFragment =
      sessionId
        .replace(
          /-/g,
          ""
        )
        .slice(
          0,
          8
        )
        .toUpperCase();

    return [
      "REC",
      establishmentId,
      `${year}${month}${day}`,
      time,
      sessionFragment,
    ].join(
      "-"
    );
  }

  /*
   * ==========================================================
   * ITEMS DEL RECIBO
   * ==========================================================
   */

  private static async getReceiptItems(
    sessionId: string,
    establishmentId: number
  ) {
    const sessionOrders =
      await db
        .select({
          id:
            orders.id,

          orderNumber:
            orders.orderNumber,

          createdAt:
            orders.createdAt,
        })
        .from(
          orders
        )
        .where(
          and(
            eq(
              orders.sessionId,
              sessionId
            ),

            eq(
              orders.establishmentId,
              establishmentId
            ),

            ne(
              orders.status,
              "cancelled"
            )
          )
        )
        .orderBy(
          asc(
            orders.id
          )
        );

    const result:
      Array<{
        orderId: number;
        orderNumber: string;
        productId: number;
        productName: unknown;
        quantity: number;
        unitPrice: string;
        subtotal: string;
        modifiers: unknown;
        notes: string | null;
      }> =
        [];

    for (
      const order
      of sessionOrders
    ) {
      const items =
        await db
          .select({
            productId:
              orderItems.productId,

            productName:
              products.name,

            quantity:
              orderItems.quantity,

            unitPrice:
              orderItems.unitPrice,

            subtotal:
              orderItems.subtotal,

            modifiers:
              orderItems.modifiers,

            notes:
              orderItems.notes,
          })
          .from(
            orderItems
          )
          .innerJoin(
            products,
            eq(
              products.id,
              orderItems.productId
            )
          )
          .where(
            eq(
              orderItems.orderId,
              order.id
            )
          )
          .orderBy(
            asc(
              orderItems.id
            )
          );

      for (
        const item
        of items
      ) {
        result.push({
          orderId:
            order.id,

          orderNumber:
            order.orderNumber,

          productId:
            item.productId,

          productName:
            item.productName,

          quantity:
            item.quantity,

          unitPrice:
            item.unitPrice,

          subtotal:
            item.subtotal,

          modifiers:
            item.modifiers ??
            [],

          notes:
            item.notes ??
            null,
        });
      }
    }

    return result;
  }

  /*
   * ==========================================================
   * ADMIN - LISTAR
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId: number,
    sessionId?: string
  ) {
    if (
      sessionId
    ) {
      return db
        .select()
        .from(
          receipts
        )
        .where(
          and(
            eq(
              receipts.establishmentId,
              establishmentId
            ),

            eq(
              receipts.sessionId,
              sessionId
            )
          )
        );
    }

    return db
      .select()
      .from(
        receipts
      )
      .where(
        eq(
          receipts.establishmentId,
          establishmentId
        )
      );
  }

  /*
   * ==========================================================
   * ADMIN - OBTENER POR ID
   * ==========================================================
   */

  static async getByIdForEstablishment(
    id: number,
    establishmentId: number
  ) {
    return db.query.receipts.findFirst({
      where:
        and(
          eq(
            receipts.id,
            id
          ),

          eq(
            receipts.establishmentId,
            establishmentId
          )
        ),
    });
  }

  /*
   * ==========================================================
   * OBTENER POR SESIÓN
   * ==========================================================
   */

  static async getBySessionId(
    sessionId: string
  ) {
    return db.query.receipts.findFirst({
      where:
        eq(
          receipts.sessionId,
          sessionId
        ),
    });
  }

  /*
   * ==========================================================
   * GENERAR DESDE SERVIDOR
   * ==========================================================
   */

  static async createForClosedPaidSession(
    sessionId: string
  ) {
    Logger.info(
      "Generando recibo desde sesión",
      {
        sessionId,
      }
    );

    /*
     * Idempotencia.
     *
     * Si ya existe un recibo para la sesión,
     * devolvemos exactamente ese recibo.
     */
    const existing =
      await this.getBySessionId(
        sessionId
      );

    if (
      existing
    ) {
      return existing;
    }

    const session =
      await this.getSession(
        sessionId
      );

    if (
      session.active ||
      session.closedAt ===
        null
    ) {
      throw new Error(
        "La sesión debe estar cerrada antes de generar el recibo."
      );
    }

    const total =
      await this.getSessionTotal(
        sessionId
      );

    if (
      total <= 0
    ) {
      throw new Error(
        "La sesión no tiene ningún importe facturable."
      );
    }

    const paid =
      await this.getPaidTotal(
        sessionId
      );

    if (
      paid <
      total
    ) {
      throw new Error(
        `La cuenta no está completamente pagada. Total: ${total.toFixed(
          2
        )}, pagado: ${paid.toFixed(
          2
        )}.`
      );
    }

    if (
      paid >
      total
    ) {
      throw new Error(
        `El importe pagado supera el total de la sesión. Total: ${total.toFixed(
          2
        )}, pagado: ${paid.toFixed(
          2
        )}.`
      );
    }

    const items =
      await this.getReceiptItems(
        sessionId,
        session.establishmentId
      );

    if (
      items.length ===
      0
    ) {
      throw new Error(
        "La sesión no contiene artículos facturables."
      );
    }

    const receiptNumber =
      this.createReceiptNumber(
        session.establishmentId,
        sessionId
      );

    try {
      const inserted =
        await db
          .insert(
            receipts
          )
          .values({
            sessionId,

            establishmentId:
              session.establishmentId,

            receiptNumber,

            /*
             * El PDF todavía no existe.
             * Se añadirá cuando el servicio PDF
             * genere el documento real.
             */
            pdfUrl:
              null,

            emailSent:
              false,

            total:
              total.toFixed(
                2
              ),

            items,
          })
          .returning();

      const receipt =
        inserted[0];

      if (
        !receipt
      ) {
        throw new Error(
          "No se pudo guardar el recibo."
        );
      }

      Logger.info(
        "Recibo generado",
        {
          id:
            receipt.id,

          sessionId,

          establishmentId:
            session.establishmentId,

          receiptNumber:
            receipt.receiptNumber,
        }
      );

      return receipt;
    } catch (
      error: any
    ) {
      const postgresError =
        error?.cause ??
        error;

      /*
       * Si dos procesos intentan generar el mismo
       * recibo simultáneamente, la restricción UNIQUE
       * de sessionId decide el ganador.
       *
       * El segundo proceso recupera el ya creado.
       */
      if (
        postgresError?.code ===
        "23505"
      ) {
        const concurrentReceipt =
          await this.getBySessionId(
            sessionId
          );

        if (
          concurrentReceipt
        ) {
          return concurrentReceipt;
        }
      }

      throw error;
    }
  }

  /*
   * ==========================================================
   * ADMIN - ACTUALIZAR
   * ==========================================================
   */

  static async updateForEstablishment(
    id: number,
    establishmentId: number,
    data: ReceiptUpdateInput
  ) {
    Logger.info(
      "Actualizando recibo",
      {
        id,
        establishmentId,
      }
    );

    const existing =
      await this
        .getByIdForEstablishment(
          id,
          establishmentId
        );

    if (
      !existing
    ) {
      return null;
    }

    if (
      Object.keys(
        data
      ).length ===
      0
    ) {
      return existing;
    }

    const updated =
      await db
        .update(
          receipts
        )
        .set({
          ...(data.pdfUrl !==
          undefined
            ? {
                pdfUrl:
                  data.pdfUrl,
              }
            : {}),

          ...(data.emailSent !==
          undefined
            ? {
                emailSent:
                  data.emailSent,
              }
            : {}),

          ...(data.items !==
          undefined
            ? {
                items:
                  data.items,
              }
            : {}),
        })
        .where(
          and(
            eq(
              receipts.id,
              id
            ),

            eq(
              receipts.establishmentId,
              establishmentId
            )
          )
        )
        .returning();

    Logger.info(
      "Recibo actualizado",
      {
        id,
      }
    );

    return (
      updated[0] ??
      null
    );
  }

  /*
   * ==========================================================
   * ADMIN - ELIMINAR
   * ==========================================================
   */

  static async deleteForEstablishment(
    id: number,
    establishmentId: number
  ) {
    Logger.info(
      "Eliminando recibo",
      {
        id,
        establishmentId,
      }
    );

    const deleted =
      await db
        .delete(
          receipts
        )
        .where(
          and(
            eq(
              receipts.id,
              id
            ),

            eq(
              receipts.establishmentId,
              establishmentId
            )
          )
        )
        .returning();

    if (
      !deleted[0]
    ) {
      return null;
    }

    Logger.info(
      "Recibo eliminado",
      {
        id,
      }
    );

    return deleted[0];
  }
}