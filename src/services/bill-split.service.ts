import {
  and,
  eq,
  ne,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  billSplits,
  orders,
  orderItems,
  sessions,
} from "@/db/schema";

import {
  BillSplitInput,
} from "@/validations/bill-split.validation";

import {
  Logger,
} from "./logger.service";

export class BillSplitService {
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
   * VALIDAR SESIÓN
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

    if (!session) {
      throw new Error(
        "La sesión no existe."
      );
    }

    if (!session.active) {
      throw new Error(
        "La sesión ya está cerrada."
      );
    }

    return session;
  }

  /*
   * ==========================================================
   * DATOS DE LA SESIÓN
   * ==========================================================
   */

  private static async getSessionData(
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

    if (
      sessionOrders.length ===
      0
    ) {
      throw new Error(
        "La sesión no tiene pedidos válidos para dividir."
      );
    }

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

    return {
      orders:
        sessionOrders,

      total,
    };
  }

  /*
   * ==========================================================
   * REPARTO IGUALITARIO
   * ==========================================================
   */

  private static validateEqual(
    total: number,
    splits:
      Record<
        string,
        any
      >[]
  ) {
    if (
      splits.length <
      2
    ) {
      throw new Error(
        "El reparto igualitario requiere al menos dos participantes."
      );
    }

    const amount =
      this.round(
        total /
          splits.length
      );

    return splits.map(
      (
        split,
        index
      ) => ({
        ...split,

        participant:
          split.participant ??
          index + 1,

        amount:
          amount.toFixed(
            2
          ),
      })
    );
  }

  /*
   * ==========================================================
   * REPARTO POR PORCENTAJE
   * ==========================================================
   */

  private static validatePercentage(
    total: number,
    splits:
      Record<
        string,
        any
      >[]
  ) {
    const percentageTotal =
      this.round(
        splits.reduce(
          (
            sum,
            split
          ) =>
            sum +
            Number(
              split.percentage ??
                0
            ),
          0
        )
      );

    if (
      percentageTotal !==
      100
    ) {
      throw new Error(
        "Los porcentajes del reparto deben sumar exactamente 100%."
      );
    }

    return splits.map(
      (
        split,
        index
      ) => {
        const percentage =
          Number(
            split.percentage
          );

        if (
          !Number.isFinite(
            percentage
          ) ||
          percentage <=
            0
        ) {
          throw new Error(
            `Porcentaje inválido en el participante ${index + 1}.`
          );
        }

        return {
          ...split,

          participant:
            split.participant ??
            index + 1,

          amount:
            (
              (
                total *
                percentage
              ) /
              100
            ).toFixed(
              2
            ),
        };
      }
    );
  }

  /*
   * ==========================================================
   * REPARTO PERSONALIZADO
   * ==========================================================
   */

  private static validateCustom(
    total: number,
    splits:
      Record<
        string,
        any
      >[]
  ) {
    const amountTotal =
      this.round(
        splits.reduce(
          (
            sum,
            split
          ) =>
            sum +
            Number(
              split.amount ??
                0
            ),
          0
        )
      );

    if (
      amountTotal !==
      total
    ) {
      throw new Error(
        `Los importes del reparto deben sumar exactamente ${total.toFixed(
          2
        )}.`
      );
    }

    return splits.map(
      (
        split,
        index
      ) => {
        const amount =
          Number(
            split.amount
          );

        if (
          !Number.isFinite(
            amount
          ) ||
          amount <=
            0
        ) {
          throw new Error(
            `Importe inválido en el participante ${index + 1}.`
          );
        }

        return {
          ...split,

          participant:
            split.participant ??
            index + 1,

          amount:
            amount.toFixed(
              2
            ),
        };
      }
    );
  }

  /*
   * ==========================================================
   * REPARTO POR ARTÍCULOS
   * ==========================================================
   */

  private static async validateItems(
    sessionId: string,
    total: number,
    splits:
      Record<
        string,
        any
      >[]
  ) {
    const sessionOrders =
      await db
        .select({
          orderId:
            orders.id,
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

            ne(
              orders.status,
              "cancelled"
            )
          )
        );

    const orderIds =
      sessionOrders.map(
        (
          order
        ) =>
          order.orderId
      );

    if (
      orderIds.length ===
      0
    ) {
      throw new Error(
        "La sesión no tiene pedidos válidos."
      );
    }

    const allItems:
      Array<
        typeof orderItems.$inferSelect
      > = [];

    for (
      const orderId
      of orderIds
    ) {
      const rows =
        await db
          .select()
          .from(
            orderItems
          )
          .where(
            eq(
              orderItems.orderId,
              orderId
            )
          );

      allItems.push(
        ...rows
      );
    }

    const available =
      new Map<
        number,
        {
          quantity:
            number;

          subtotal:
            number;
        }
      >();

    for (
      const item
      of allItems
    ) {
      available.set(
        item.id,
        {
          quantity:
            item.quantity,

          subtotal:
            Number(
              item.subtotal
            ),
        }
      );
    }

    let allocatedTotal =
      0;

    const normalized =
      splits.map(
        (
          split,
          splitIndex
        ) => {
          if (
            !Array.isArray(
              split.items
            ) ||
            split.items
              .length ===
              0
          ) {
            throw new Error(
              `El participante ${splitIndex + 1} no tiene artículos asignados.`
            );
          }

          let participantTotal =
            0;

          const normalizedItems =
            split.items.map(
              (
                item: any
              ) => {
                const itemId =
                  Number(
                    item.itemId
                  );

                const quantity =
                  Number(
                    item.quantity
                  );

                const availableItem =
                  available.get(
                    itemId
                  );

                if (
                  !availableItem
                ) {
                  throw new Error(
                    `El artículo ${itemId} no pertenece a la sesión.`
                  );
                }

                if (
                  !Number.isInteger(
                    quantity
                  ) ||
                  quantity <=
                    0
                ) {
                  throw new Error(
                    `Cantidad inválida para el artículo ${itemId}.`
                  );
                }

                if (
                  quantity >
                  availableItem.quantity
                ) {
                  throw new Error(
                    `La cantidad asignada del artículo ${itemId} supera la cantidad pedida.`
                  );
                }

                const unitPrice =
                  availableItem.subtotal /
                  availableItem.quantity;

                const itemTotal =
                  unitPrice *
                  quantity;

                participantTotal +=
                  itemTotal;

                availableItem.quantity -=
                  quantity;

                return {
                  itemId,

                  quantity,

                  amount:
                    this.round(
                      itemTotal
                    ).toFixed(
                      2
                    ),
                };
              }
            );

          allocatedTotal +=
            participantTotal;

          return {
            ...split,

            participant:
              split.participant ??
              splitIndex +
                1,

            items:
              normalizedItems,

            amount:
              this.round(
                participantTotal
              ).toFixed(
                2
              ),
          };
        }
      );

    const roundedAllocated =
      this.round(
        allocatedTotal
      );

    if (
      roundedAllocated !==
      total
    ) {
      throw new Error(
        `Los artículos asignados suman ${roundedAllocated.toFixed(
          2
        )}, pero la cuenta total es ${total.toFixed(
          2
        )}.`
      );
    }

    return normalized;
  }

  /*
   * ==========================================================
   * CREAR DESDE SESIÓN DEL CLIENTE
   * ==========================================================
   */

  static async create(
    data: BillSplitInput
  ) {
    Logger.info(
      "Creando división de cuenta",
      {
        sessionId:
          data.sessionId,

        splitType:
          data.splitType,
      }
    );

    /*
     * La sesión es la autoridad.
     *
     * Además impedimos crear divisiones
     * sobre sesiones inexistentes o cerradas.
     */
    await this.getSession(
      data.sessionId
    );

    const {
      total,
    } =
      await this.getSessionData(
        data.sessionId
      );

    let normalizedSplits;

    switch (
      data.splitType
    ) {
      case "equal":
        normalizedSplits =
          this.validateEqual(
            total,
            data.splits
          );
        break;

      case "percentage":
        normalizedSplits =
          this.validatePercentage(
            total,
            data.splits
          );
        break;

      case "custom":
        normalizedSplits =
          this.validateCustom(
            total,
            data.splits
          );
        break;

      case "items":
        normalizedSplits =
          await this.validateItems(
            data.sessionId,
            total,
            data.splits
          );
        break;

      default:
        throw new Error(
          "Tipo de división no válido."
        );
    }

    const inserted =
      await db
        .insert(
          billSplits
        )
        .values({
          sessionId:
            data.sessionId,

          splitType:
            data.splitType,

          splits:
            normalizedSplits,
        })
        .returning();

    Logger.info(
      "División de cuenta creada",
      {
        id:
          inserted[0].id,

        total,
      }
    );

    return {
      ...inserted[0],

      total,

      splits:
        normalizedSplits,
    };
  }

  /*
   * ==========================================================
   * ADMIN - LISTAR POR ESTABLECIMIENTO
   *
   * bill_splits no tiene establishmentId.
   * El aislamiento se realiza mediante sessions.
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId: number,
    sessionId?: string
  ) {
    if (
      sessionId
    ) {
      const rows =
        await db
          .select({
            billSplit: billSplits,
          })
          .from(
            billSplits
          )
          .innerJoin(
            sessions,
            eq(
              billSplits.sessionId,
              sessions.id
            )
          )
          .where(
            and(
              eq(
                sessions.establishmentId,
                establishmentId
              ),

              eq(
                billSplits.sessionId,
                sessionId
              )
            )
          );

      return rows.map(
        (
          row
        ) =>
          row.billSplit
      );
    }

    const rows =
      await db
        .select({
          billSplit: billSplits,
        })
        .from(
          billSplits
        )
        .innerJoin(
          sessions,
          eq(
            billSplits.sessionId,
            sessions.id
          )
        )
        .where(
          eq(
            sessions.establishmentId,
            establishmentId
          )
        );

    return rows.map(
      (
        row
      ) =>
        row.billSplit
    );
  }

  /*
   * ==========================================================
   * ADMIN - OBTENER POR ID Y TENANT
   * ==========================================================
   */

  static async getByIdForEstablishment(
    id: number,
    establishmentId: number
  ) {
    const rows =
      await db
        .select({
          billSplit: billSplits,
        })
        .from(
          billSplits
        )
        .innerJoin(
          sessions,
          eq(
            billSplits.sessionId,
            sessions.id
          )
        )
        .where(
          and(
            eq(
              billSplits.id,
              id
            ),

            eq(
              sessions.establishmentId,
              establishmentId
            )
          )
        )
        .limit(
          1
        );

    return (
      rows[0]?.billSplit ??
      null
    );
  }

  /*
   * ==========================================================
   * ADMIN - ELIMINAR POR TENANT
   * ==========================================================
   */

  static async deleteForEstablishment(
    id: number,
    establishmentId: number
  ) {
    Logger.info(
      "Eliminando división de cuenta",
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

    const deleted =
      await db
        .delete(
          billSplits
        )
        .where(
          eq(
            billSplits.id,
            id
          )
        )
        .returning();

    if (
      !deleted[0]
    ) {
      return null;
    }

    Logger.info(
      "División de cuenta eliminada",
      {
        id,
      }
    );

    return deleted[0];
  }
}

