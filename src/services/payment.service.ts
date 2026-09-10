import {
  and,
  eq,
  ne,
  sql,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  payments,
  sessions,
  billSplits,
  orders,
  notifications,
} from "@/db/schema";

import {
  PaymentInput,
  PaymentUpdateInput,
} from "@/validations/payment.validation";

import {
  SessionService,
} from "@/services/session.service";

import {
  ReceiptService,
} from "@/services/receipt.service";

import {
  Logger,
} from "./logger.service";

export class PaymentService {
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

    if (
      !session.active
    ) {
      throw new Error(
        "La sesión ya está cerrada."
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
   * CIERRE FINANCIERO DE SESIÓN
   * ==========================================================
   */

  private static async closeSessionIfFullyPaid(
    sessionId: string
  ) {
    const total =
      await this.getSessionTotal(
        sessionId
      );

    if (
      total <= 0
    ) {
      return {
        fullyPaid:
          false,

        sessionClosed:
          false,

        total:
          this.round(
            total
          ),

        paid:
          0,

        pending:
          this.round(
            Math.max(
              total,
              0
            )
          ),
      };
    }

    const paid =
      await this.getPaidTotal(
        sessionId
      );

    const pending =
      this.round(
        Math.max(
          total -
            paid,
          0
        )
      );

    const fullyPaid =
      paid >=
      total;

    if (
      !fullyPaid
    ) {
      return {
        fullyPaid:
          false,

        sessionClosed:
          false,

        total,

        paid,

        pending,
      };
    }

    /*
     * La sesión solo se cierra después de volver
     * a calcular en servidor la cuenta completa.
     */
    const session =
  await SessionService.close(
    sessionId
  );

if (
  !session
) {
  throw new Error(
    "La sesión asociada al pago no existe."
  );
}

if (
  session.active
) {
  throw new Error(
    "No se pudo cerrar la sesión después de completar el pago."
  );
}

/*
 * El recibo se genera únicamente después de:
 *
 * 1. comprobar el total real de pedidos;
 * 2. comprobar los pagos realmente paid;
 * 3. cerrar la sesión;
 * 4. sincronizar/liberar la mesa.
 *
 * ReceiptService vuelve a comprobar por sí mismo
 * que la sesión esté cerrada y completamente pagada.
 */
const receipt =
  await ReceiptService
    .createForClosedPaidSession(
      sessionId
    );

return {
  fullyPaid:
    true,

  sessionClosed:
    true,

  total,

  paid,

  pending:
    0,

  receipt,
};
  }

  /*
   * ==========================================================
   * BILL SPLIT
   * ==========================================================
   */

  private static async validateBillSplit(
    sessionId: string,
    billSplitId: number
  ) {
    const billSplit =
      await db.query.billSplits.findFirst({
        where:
          eq(
            billSplits.id,
            billSplitId
          ),
      });

    if (
      !billSplit
    ) {
      throw new Error(
        "La división de cuenta no existe."
      );
    }

    if (
      billSplit.sessionId !==
      sessionId
    ) {
      throw new Error(
        "La división de cuenta no pertenece a esta sesión."
      );
    }

    return billSplit;
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
          payments
        )
        .where(
          and(
            eq(
              payments.establishmentId,
              establishmentId
            ),

            eq(
              payments.sessionId,
              sessionId
            )
          )
        );
    }

    return db
      .select()
      .from(
        payments
      )
      .where(
        eq(
          payments.establishmentId,
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
    return db.query.payments.findFirst({
      where:
        and(
          eq(
            payments.id,
            id
          ),

          eq(
            payments.establishmentId,
            establishmentId
          )
        ),
    });
  }

  /*
   * ==========================================================
   * CREAR PAGO DESDE SESIÓN
   * ==========================================================
   */

  static async create(
    data: PaymentInput
  ) {
    Logger.info(
      "Creando pago",
      {
        sessionId:
          data.sessionId,

        amount:
          data.amount,

        method:
          data.method,
      }
    );

    const session =
      await this.getSession(
        data.sessionId
      );

    if (
      data.establishmentId !==
        undefined &&
      data.establishmentId !==
        session.establishmentId
    ) {
      throw new Error(
        "La sesión no pertenece al establecimiento indicado."
      );
    }

    if (
      data.billSplitId !==
        undefined &&
      data.billSplitId !==
        null
    ) {
      await this.validateBillSplit(
        data.sessionId,
        data.billSplitId
      );
    }

    const amount =
      Number(
        data.amount
      );

    if (
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {
      throw new Error(
        "El importe del pago debe ser mayor que cero."
      );
    }

    const total =
      await this.getSessionTotal(
        data.sessionId
      );

    if (
      total <= 0
    ) {
      throw new Error(
        "La sesión no tiene ningún importe pendiente."
      );
    }

    const paid =
      await this.getPaidTotal(
        data.sessionId
      );

    const pending =
      this.round(
        total -
          paid
      );

    if (
      amount >
      pending
    ) {
      throw new Error(
        `El importe del pago (${amount.toFixed(
          2
        )}) supera el importe pendiente (${pending.toFixed(
          2
        )}).`
      );
    }

    const inserted =
      await db
        .insert(
          payments
        )
        .values({
          sessionId:
            data.sessionId,

          establishmentId:
            session.establishmentId,

          billSplitId:
            data.billSplitId ??
            null,

          amount:
            amount.toFixed(
              2
            ),

          method:
            data.method,

          status:
            "pending",

          stripePaymentIntentId:
            data.stripePaymentIntentId ??
            null,

          transactionId:
            data.transactionId ??
            null,

          receiptUrl:
            data.receiptUrl ??
            null,

          metadata:
            data.metadata ??
            {},
        })
        .returning();

    Logger.info(
      "Pago creado",
      {
        id:
          inserted[0].id,

        establishmentId:
          session.establishmentId,
      }
    );

    return inserted[0];
  }

    /*
   * ==========================================================
   * GUEST CHECKOUT - PAGO CARD ATÓMICO
   * ==========================================================
   *
   * Serializa por sessionId las solicitudes concurrentes.
   *
   * Dos requests simultáneos para la misma sesión:
   *
   * 1. el primero obtiene el advisory lock;
   * 2. crea el payment pending;
   * 3. confirma la transacción;
   * 4. el segundo entra después;
   * 5. encuentra y reutiliza el mismo payment.
   *
   * No bloquea pagos pertenecientes a otras sesiones.
   */

  static async getOrCreatePendingGuestCardPayment(
    input: {
      sessionId: string;
      establishmentId: number;
      amount: string;
    }
  ) {
    return db.transaction(
      async (
        tx
      ) => {
        await tx.execute(
          sql`
            SELECT pg_advisory_xact_lock(
              hashtext(${input.sessionId})
            )
          `
        );

        const session =
          await tx.query.sessions.findFirst({
            where:
              and(
                eq(
                  sessions.id,
                  input.sessionId
                ),

                eq(
                  sessions.establishmentId,
                  input.establishmentId
                )
              ),
          });

        if (
          !session
        ) {
          throw new Error(
            "La sesión no existe."
          );
        }

        if (
          !session.active
        ) {
          throw new Error(
            "La sesión ya está cerrada."
          );
        }

        const existing =
          await tx.query.payments.findFirst({
            where:
              and(
                eq(
                  payments.sessionId,
                  input.sessionId
                ),

                eq(
                  payments.establishmentId,
                  input.establishmentId
                ),

                eq(
                  payments.method,
                  "card"
                ),

                eq(
                  payments.status,
                  "pending"
                )
              ),
          });

        if (
          existing
        ) {
          if (
            Number(
              existing.amount
            ) !==
            Number(
              input.amount
            )
          ) {
            throw new Error(
              "STRIPE_PENDING_PAYMENT_AMOUNT_MISMATCH"
            );
          }

          return existing;
        }

        const amount =
          Number(
            input.amount
          );

        if (
          !Number.isFinite(
            amount
          ) ||
          amount <= 0
        ) {
          throw new Error(
            "El importe del pago debe ser mayor que cero."
          );
        }

        /*
         * Recalculamos dentro del lock.
         *
         * No confiamos únicamente en el cálculo que hizo
         * anteriormente el endpoint.
         */
        const sessionOrders =
          await tx
            .select({
              total:
                orders.total,
            })
            .from(
              orders
            )
            .where(
              and(
                eq(
                  orders.sessionId,
                  input.sessionId
                ),

                eq(
                  orders.establishmentId,
                  input.establishmentId
                ),

                ne(
                  orders.status,
                  "cancelled"
                )
              )
            );

        const total =
          this.round(
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

        const paidPayments =
          await tx
            .select({
              amount:
                payments.amount,
            })
            .from(
              payments
            )
            .where(
              and(
                eq(
                  payments.sessionId,
                  input.sessionId
                ),

                eq(
                  payments.establishmentId,
                  input.establishmentId
                ),

                eq(
                  payments.status,
                  "paid"
                )
              )
            );

        const paid =
          this.round(
            paidPayments.reduce(
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

        const pending =
          this.round(
            total -
            paid
          );

        if (
          pending <= 0
        ) {
          throw new Error(
            "La sesión no tiene ningún importe pendiente."
          );
        }

        if (
          amount >
          pending
        ) {
          throw new Error(
            `El importe del pago (${amount.toFixed(
              2
            )}) supera el importe pendiente (${pending.toFixed(
              2
            )}).`
          );
        }

        const inserted =
          await tx
            .insert(
              payments
            )
            .values({
              sessionId:
                input.sessionId,

              establishmentId:
                input.establishmentId,

              billSplitId:
                null,

              amount:
                amount.toFixed(
                  2
                ),

              method:
                "card",

              status:
                "pending",

              stripePaymentIntentId:
                null,

              transactionId:
                null,

              receiptUrl:
                null,

              metadata: {
                source:
                  "guest_checkout",
              },
            })
            .returning();

        return inserted[0];
      }
    );
  }

  static async getPendingStripePaymentForSession(
    sessionId: string,
    establishmentId: number
  ) {
    return db.query.payments.findFirst({
      where:
        and(
          eq(
            payments.sessionId,
            sessionId
          ),

          eq(
            payments.establishmentId,
            establishmentId
          ),

          eq(
            payments.method,
            "card"
          ),

          eq(
            payments.status,
            "pending"
          )
        ),
    });
  }

  /*
   * ==========================================================
   * STRIPE - VINCULAR PAYMENT INTENT
   * ==========================================================
   */

  static async attachStripePaymentIntent(
    id: number,
    establishmentId: number,
    stripePaymentIntentId: string
  ) {
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
      existing.method !==
        "card"
    ) {
      throw new Error(
        "El pago no corresponde a un pago con tarjeta."
      );
    }

    if (
      existing.status !==
        "pending"
    ) {
      throw new Error(
        "Solo se puede vincular Stripe a un pago pendiente."
      );
    }

    if (
      existing
        .stripePaymentIntentId
    ) {
      if (
        existing
          .stripePaymentIntentId ===
        stripePaymentIntentId
      ) {
        return existing;
      }

      throw new Error(
        "El pago ya está vinculado a otro PaymentIntent."
      );
    }

    const updated =
      await db
        .update(
          payments
        )
        .set({
          stripePaymentIntentId,

          updatedAt:
            new Date(),
        })
        .where(
          and(
            eq(
              payments.id,
              id
            ),

            eq(
              payments.establishmentId,
              establishmentId
            ),

            eq(
              payments.status,
              "pending"
            )
          )
        )
        .returning();

    return (
      updated[0] ??
      null
    );
  }

  /*
   * ==========================================================
   * STRIPE - BUSCAR POR PAYMENT INTENT
   * ==========================================================
   */

  static async getByStripePaymentIntentId(
    stripePaymentIntentId: string
  ) {
    return db.query.payments.findFirst({
      where:
        eq(
          payments
            .stripePaymentIntentId,
          stripePaymentIntentId
        ),
    });
  }

  /*
   * ==========================================================
   * ADMIN - ACTUALIZAR ESTADO
   * ==========================================================
   */

    static async updateStatusForEstablishment(
    id: number,
    establishmentId: number,
    status:
      | "pending"
      | "partial"
      | "paid"
      | "refunded",
    options?: {
      stripeRefundConfirmed?: boolean;
    }
  ) {
    Logger.info(
      "Actualizando estado del pago",
      {
        id,
        establishmentId,
        status,
      }
    );

    /*
     * ========================================================
     * TRANSACCIÓN FINANCIERA
     * ========================================================
     *
     * Primero obtenemos el pago para conocer su sessionId.
     *
     * Dentro de la transacción adquirimos después un advisory
     * lock por sesión. Todas las confirmaciones financieras
     * de la misma sesión quedan serializadas.
     *
     * IMPORTANTE:
     * después de obtener el lock volvemos a leer el pago.
     * No utilizamos para decisiones financieras el snapshot
     * obtenido antes del bloqueo.
     */

    const initialPayment =
      await this
        .getByIdForEstablishment(
          id,
          establishmentId
        );

    if (
      !initialPayment
    ) {
      return null;
    }

    const transactionResult =
      await db.transaction(
        async (
          tx
        ) => {
          await tx.execute(
            sql`
              SELECT pg_advisory_xact_lock(
                hashtext(${initialPayment.sessionId})
              )
            `
          );

          /*
           * Volvemos a leer el pago DESPUÉS del lock.
           */
          const lockedPayments =
            await tx
              .select()
              .from(
                payments
              )
              .where(
                and(
                  eq(
                    payments.id,
                    id
                  ),

                  eq(
                    payments.establishmentId,
                    establishmentId
                  )
                )
              )
              .limit(
                1
              );

          const payment =
            lockedPayments[0] ??
            null;

          if (
            !payment
          ) {
            return null;
          }

          /*
           * Protección adicional:
           * el pago no puede haber cambiado de sesión entre
           * la lectura inicial y la lectura bloqueada.
           */
          if (
            payment.sessionId !==
            initialPayment.sessionId
          ) {
            throw new Error(
              "PAYMENT_SESSION_CHANGED"
            );
          }

          const currentStatus =
            payment.status ??
            "pending";

          /*
           * Idempotencia.
           *
           * Si Stripe repite posteriormente un webhook
           * payment_intent.succeeded, volver a marcar el mismo
           * pago como paid no incrementará el saldo otra vez.
           */
          if (
            currentStatus ===
            status
          ) {
            return {
              payment,
              currentStatus,
              changed:
                false,
            };
          }
          /*
           * ==================================================
           * PROTECCIÓN DE REEMBOLSOS STRIPE
           * ==================================================
           *
           * Los pagos Stripe no pueden marcarse como
           * "refunded" únicamente mediante un cambio
           * de estado local.
           *
           * Stripe debe confirmar primero el reembolso.
           */
          if (
            status ===
              "refunded" &&
            payment.method ===
              "card" &&
            Boolean(
              payment.stripePaymentIntentId
            ) &&
            options?.stripeRefundConfirmed !==
              true
          ) {
            throw new Error(
              "STRIPE_REFUND_REQUIRED"
            );
          }


          const allowedTransitions:
            Record<
              string,
              string[]
            > = {
              pending: [
                "paid",
                "partial",
              ],

              partial: [
                "paid",
                "refunded",
              ],

              paid: [
                "refunded",
              ],

              refunded:
                [],
            };

          const allowed =
            allowedTransitions[
              currentStatus
            ] ?? [];

          if (
            !allowed.includes(
              status
            )
          ) {
            throw new Error(
              `No se puede cambiar el estado del pago de "${currentStatus}" a "${status}".`
            );
          }

          /*
           * ==================================================
           * PROTECCIÓN CONTRA SOBREPAGO
           * ==================================================
           *
           * Este cálculo se realiza DESPUÉS de adquirir el
           * lock de la sesión.
           *
           * Por tanto, otra confirmación de esta misma sesión
           * no puede calcular paid simultáneamente.
           */

          if (
            status ===
            "paid"
          ) {
            const sessionOrders =
              await tx
                .select({
                  total:
                    orders.total,
                })
                .from(
                  orders
                )
                .where(
                  and(
                    eq(
                      orders.sessionId,
                      payment.sessionId
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
                );

            const total =
              this.round(
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

            const paidPayments =
              await tx
                .select({
                  amount:
                    payments.amount,
                })
                .from(
                  payments
                )
                .where(
                  and(
                    eq(
                      payments.sessionId,
                      payment.sessionId
                    ),

                    eq(
                      payments.establishmentId,
                      establishmentId
                    ),

                    eq(
                      payments.status,
                      "paid"
                    )
                  )
                );

            const paid =
              this.round(
                paidPayments.reduce(
                  (
                    sum,
                    paidPayment
                  ) =>
                    sum +
                    Number(
                      paidPayment.amount
                    ),
                  0
                )
              );

            const amount =
              Number(
                payment.amount
              );

            const newPaidTotal =
              this.round(
                paid +
                amount
              );

            if (
              newPaidTotal >
              total
            ) {
              throw new Error(
                `El pago supera el total de la cuenta. Total: ${total.toFixed(
                  2
                )}, pagado: ${newPaidTotal.toFixed(
                  2
                )}.`
              );
            }
          }

          const updated =
            await tx
              .update(
                payments
              )
              .set({
                status,

                updatedAt:
                  new Date(),
              })
              .where(
                and(
                  eq(
                    payments.id,
                    id
                  ),

                  eq(
                    payments.establishmentId,
                    establishmentId
                  )
                )
              )
              .returning();

                    const updatedPayment =
            updated[0] ??
            null;

          if (
            !updatedPayment
          ) {
            return null;
          }

          /*
           * ==================================================
           * NOTIFICACIÓN: PAGO RECIBIDO
           * ==================================================
           *
           * Solo se genera cuando el pago cambia realmente
           * a "paid".
           *
           * La notificación forma parte de la misma transacción
           * financiera que confirma el pago.
           *
           * Gracias a la comprobación de idempotencia anterior,
           * un webhook repetido de Stripe no genera una segunda
           * notificación.
           */

          if (
            status ===
            "paid"
          ) {
            await tx
              .insert(
                notifications
              )
              .values({
                establishmentId,

                userId:
                  null,

                type:
                  "payment_received",

                title:
                  "Pago recibido",

                message:
                  `Pago de ${updatedPayment.amount} recibido.`,

                data: {
                  paymentId:
                    updatedPayment.id,

                  sessionId:
                    updatedPayment.sessionId,

                  billSplitId:
                    updatedPayment.billSplitId,

                  amount:
                    updatedPayment.amount,

                  method:
                    updatedPayment.method,

                  status:
                    updatedPayment.status,
                },

                read:
                  false,
              });
          }

          return {
            payment:
              updatedPayment,

            currentStatus,

            changed:
              true,
          };
        }
      );

    if (
      !transactionResult
    ) {
      return null;
    }

    /*
     * ========================================================
     * SETTLEMENT
     * ========================================================
     *
     * Se ejecuta después del COMMIT.
     *
     * La parte financiera crítica ya quedó serializada.
     * closeSessionIfFullyPaid es idempotente y conserva el
     * flujo que ya tenemos probado:
     *
     * pago completo
     * → cierre sesión
     * → liberación mesa
     * → recibo.
     */

    const settlement =
      status ===
      "paid"
        ? await this.closeSessionIfFullyPaid(
            transactionResult
              .payment
              .sessionId
          )
        : null;

    Logger.info(
      transactionResult.changed
        ? "Estado del pago actualizado"
        : "Estado del pago ya estaba actualizado",
      {
        id,

        from:
          transactionResult
            .currentStatus,

        to:
          status,

        changed:
          transactionResult
            .changed,

        fullyPaid:
          settlement?.fullyPaid ??
          false,

        sessionClosed:
          settlement?.sessionClosed ??
          false,
      }
    );

    return {
      payment:
        transactionResult
          .payment,

      settlement,
    };
  }

  /*
   * ==========================================================
   * ADMIN - ACTUALIZAR
   * ==========================================================
   */

  static async updateForEstablishment(
    id: number,
    establishmentId: number,
    data: PaymentUpdateInput
  ) {
    Logger.info(
      "Actualizando pago",
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
      data.status !==
        undefined &&
      data.status !==
        existing.status
    ) {
      const statusResult =
        await this
          .updateStatusForEstablishment(
            id,
            establishmentId,
            data.status
          );

      if (
        !statusResult
      ) {
        return null;
      }
    }

    const {
      status:
        _status,
      ...otherFields
    } =
      data;

    if (
      Object.keys(
        otherFields
      ).length ===
      0
    ) {
      return this
        .getByIdForEstablishment(
          id,
          establishmentId
        );
    }

    const updated =
      await db
        .update(
          payments
        )
        .set({
          ...otherFields,

          updatedAt:
            new Date(),
        })
        .where(
          and(
            eq(
              payments.id,
              id
            ),

            eq(
              payments.establishmentId,
              establishmentId
            )
          )
        )
        .returning();

    Logger.info(
      "Pago actualizado",
      {
        id,
      }
    );

    return (
      updated[0] ??
      (
        await this
          .getByIdForEstablishment(
            id,
            establishmentId
          )
      )
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
      "Eliminando pago",
      {
        id,
        establishmentId,
      }
    );

    const deleted =
      await db
        .delete(
          payments
        )
        .where(
          and(
            eq(
              payments.id,
              id
            ),

            eq(
              payments.establishmentId,
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
      "Pago eliminado",
      {
        id,
      }
    );

    return deleted[0];
  }
}