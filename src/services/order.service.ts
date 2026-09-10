import { db } from "@/db";

import {
  orders,
  orderItems,
  products,
  modifiers,
  sessions,
  notifications,
} from "@/db/schema";

import {
  and,
  eq,
  inArray,
} from "drizzle-orm";

import {
  OrderInput,
} from "@/validations/order.validation";

import {
  IdService,
} from "./id.service";

export class OrderService {
  /*
   * ==========================================================
   * CREAR PEDIDO DESDE SESIÓN QR
   * ==========================================================
   */

  static async create(
    data: OrderInput
  ) {
    /*
     * ==========================================================
     * 1. VALIDAR SESIÓN
     * ==========================================================
     *
     * La sesión es la fuente de verdad para:
     *
     * - tableId
     * - establishmentId
     *
     * El cliente nunca controla esos valores.
     */

    const session =
      await db
        .query
        .sessions
        .findFirst({
          where:
            eq(
              sessions.id,
              data.sessionId
            ),
        });

    if (!session) {
      throw new Error(
        "La sesión no existe."
      );
    }

    if (!session.active) {
      throw new Error(
        "La sesión no está activa."
      );
    }

    const tableId =
      session.tableId;

    const establishmentId =
      session.establishmentId;

    /*
     * ==========================================================
     * 2. OBTENER IDS ÚNICOS DE PRODUCTOS
     * ==========================================================
     */

    const productIds = [
      ...new Set(
        data.items.map(
          (item) =>
            item.productId
        )
      ),
    ];

    /*
     * ==========================================================
     * 3. OBTENER PRODUCTOS REALES DEL TENANT
     * ==========================================================
     *
     * No usamos ningún precio enviado por frontend.
     *
     * Además filtramos directamente por establishmentId
     * de la sesión para reforzar aislamiento multi-tenant.
     */

    const productRows =
      await db
        .select()
        .from(
          products
        )
        .where(
          and(
            inArray(
              products.id,
              productIds
            ),

            eq(
              products.establishmentId,
              establishmentId
            )
          )
        );

    const productMap =
      new Map(
        productRows.map(
          (product) => [
            product.id,
            product,
          ]
        )
      );

    /*
     * ==========================================================
     * 4. OBTENER MODIFICADORES
     * ==========================================================
     */

    const modifierIds = [
      ...new Set(
        data.items.flatMap(
          (item) =>
            item.modifiers?.map(
              (modifier) =>
                modifier.id
            ) ?? []
        )
      ),
    ];

    const modifierRows =
      modifierIds.length > 0
        ? await db
            .select()
            .from(
              modifiers
            )
            .where(
              inArray(
                modifiers.id,
                modifierIds
              )
            )
        : [];

    const modifierMap =
      new Map(
        modifierRows.map(
          (modifier) => [
            modifier.id,
            modifier,
          ]
        )
      );

    /*
     * ==========================================================
     * 5. CALCULAR CANTIDAD TOTAL POR PRODUCTO
     * ==========================================================
     *
     * Un mismo producto puede aparecer varias veces en el
     * carrito con distintos modificadores o notas.
     *
     * Ejemplo:
     *
     * producto 14 + modificador A -> cantidad 1
     * producto 14 sin modificador -> cantidad 2
     *
     * El stock necesario para el producto 14 es 3.
     */

    const quantityByProduct =
      new Map<number, number>();

    for (
      const item of
      data.items
    ) {
      const currentQuantity =
        quantityByProduct.get(
          item.productId
        ) ?? 0;

      quantityByProduct.set(
        item.productId,
        currentQuantity +
          item.quantity
      );
    }

    /*
     * ==========================================================
     * 6. VALIDAR PRODUCTOS Y STOCK ACUMULADO
     * ==========================================================
     */

    for (
      const [
        productId,
        requiredQuantity,
      ] of quantityByProduct
    ) {
      const product =
        productMap.get(
          productId
        );

      /*
       * Un producto inexistente o perteneciente
       * a otro establecimiento produce el mismo
       * resultado público.
       *
       * Así evitamos filtrar información
       * entre tenants.
       */

      if (!product) {
        throw new Error(
          `Producto ${productId} no encontrado.`
        );
      }

      if (
        product.establishmentId !==
        establishmentId
      ) {
        throw new Error(
          `El producto ${product.id} no pertenece al establecimiento.`
        );
      }

      if (!product.active) {
        throw new Error(
          `El producto ${product.id} está inactivo.`
        );
      }

      if (!product.available) {
        throw new Error(
          `El producto ${product.id} no está disponible.`
        );
      }

      if (
        product.stock !==
          null &&
        product.stock <
          requiredQuantity
      ) {
        throw new Error(
          `Stock insuficiente para el producto ${product.id}.`
        );
      }
    }

    /*
     * ==========================================================
     * 7. VALIDAR Y CALCULAR ITEMS
     * ==========================================================
     */

    let subtotal =
      0;

    const calculatedItems =
      data.items.map(
        (item) => {
          const product =
            productMap.get(
              item.productId
            );

          /*
           * Este caso ya ha sido validado en el bloque anterior,
           * pero mantenemos la comprobación para que TypeScript
           * y el propio servicio no dependan de una aserción.
           */

          if (!product) {
            throw new Error(
              `Producto ${item.productId} no encontrado.`
            );
          }

          /*
           * Precio real procedente exclusivamente
           * de PostgreSQL.
           */

          let unitPrice =
            Number(
              product.price
            );

          if (
            !Number.isFinite(
              unitPrice
            )
          ) {
            throw new Error(
              `Precio inválido para el producto ${product.id}.`
            );
          }

          /*
           * ======================================================
           * MODIFICADORES DEL ITEM
           * ======================================================
           */

          const selectedModifiers =
            item.modifiers?.map(
              (modifier) => {
                const modifierRecord =
                  modifierMap.get(
                    modifier.id
                  );

                if (
                  !modifierRecord
                ) {
                  throw new Error(
                    `Modificador ${modifier.id} no encontrado.`
                  );
                }

                if (
                  !modifierRecord.active
                ) {
                  throw new Error(
                    `El modificador ${modifier.id} no está activo.`
                  );
                }

                /*
                 * El modificador debe pertenecer
                 * exactamente al producto solicitado.
                 *
                 * Esto también impide reutilizar
                 * modificadores de otro producto/tenant.
                 */

                if (
                  modifierRecord.productId !==
                  product.id
                ) {
                  throw new Error(
                    `El modificador ${modifier.id} no pertenece al producto ${product.id}.`
                  );
                }

                const modifierPrice =
                  Number(
                    modifierRecord.price ??
                    0
                  );

                if (
                  !Number.isFinite(
                    modifierPrice
                  )
                ) {
                  throw new Error(
                    `Precio inválido para el modificador ${modifier.id}.`
                  );
                }

                unitPrice +=
                  modifierPrice;

                return {
                  id:
                    modifierRecord.id,

                  name:
                    modifierRecord.name,

                  type:
                    modifierRecord.type,

                  price:
                    modifierPrice.toFixed(
                      2
                    ),
                };
              }
            ) ?? [];

          const itemSubtotal =
            unitPrice *
            item.quantity;

          subtotal +=
            itemSubtotal;

          return {
            productId:
              product.id,

            quantity:
              item.quantity,

            unitPrice:
              unitPrice.toFixed(
                2
              ),

            subtotal:
              itemSubtotal.toFixed(
                2
              ),

            modifiers:
              selectedModifiers,

            notes:
              item.notes ??
              "",
          };
        }
      );

    /*
     * ==========================================================
     * 8. TOTALES
     * ==========================================================
     */

    const tax =
      0;

    const total =
      subtotal +
      tax;

    /*
     * ==========================================================
     * 9. NÚMERO DE PEDIDO
     * ==========================================================
     */

    const orderNumber =
      IdService.generateOrderNumber(
        establishmentId
      );

    /*
     * ==========================================================
     * 10. CREAR PEDIDO + ITEMS + STOCK
     * ==========================================================
     *
     * Todo ocurre dentro de una única transacción.
     */

    return db.transaction(
      async (tx) => {
        const inserted =
          await tx
            .insert(
              orders
            )
            .values({
              sessionId:
                session.id,

              tableId,

              establishmentId,

              orderNumber,

              status:
                "pending",

              subtotal:
                subtotal.toFixed(
                  2
                ),

              tax:
                tax.toFixed(
                  2
                ),

              tip:
                "0.00",

              total:
                total.toFixed(
                  2
                ),

              notes:
                data.notes ??
                "",

              latitude:
                session.latitude,

              longitude:
                session.longitude,

              estimatedTime:
                15,
            })
            .returning();

        const created =
          inserted[0];

        if (!created) {
          throw new Error(
            "No se pudo crear el pedido."
          );
        }

        /*
         * ======================================================
         * INSERTAR ITEMS
         * ======================================================
         */

        await tx
          .insert(
            orderItems
          )
          .values(
            calculatedItems.map(
              (item) => ({
                orderId:
                  created.id,

                productId:
                  item.productId,

                quantity:
                  item.quantity,

                unitPrice:
                  item.unitPrice,

                subtotal:
                  item.subtotal,

                modifiers:
                  item.modifiers,

                notes:
                  item.notes,

                status:
                  "pending" as const,
              })
            )
          );

        /*
         * ======================================================
         * ACTUALIZAR STOCK
         * ======================================================
         *
         * El descuento se realiza una sola vez por producto
         * utilizando la cantidad total solicitada.
         *
         * Esto evita que dos variantes del mismo producto
         * sobrescriban entre sí el nuevo stock.
         */

        for (
          const [
            productId,
            requiredQuantity,
          ] of quantityByProduct
        ) {
          const product =
            productMap.get(
              productId
            );

          if (
            !product ||
            product.stock ===
              null
          ) {
            continue;
          }

          await tx
            .update(
              products
            )
            .set({
              stock:
                product.stock -
                requiredQuantity,

              updatedAt:
                new Date(),
            })
            .where(
              and(
                eq(
                  products.id,
                  productId
                ),

                eq(
                  products.establishmentId,
                  establishmentId
                )
              )
            );
        }

        /*
         * ======================================================
         * CREAR NOTIFICACIÓN: NUEVO PEDIDO
         * ======================================================
         *
         * Se crea dentro de la misma transacción que el pedido,
         * sus items y la actualización de stock.
         *
         * Así evitamos:
         * - pedidos confirmados sin notificación;
         * - notificaciones de pedidos que finalmente hagan rollback.
         */

        await tx
          .insert(
            notifications
          )
          .values({
            establishmentId,

            userId:
              null,

            type:
              "new_order",

            title:
              "Nuevo pedido",

            message:
              `Nuevo pedido ${created.orderNumber} en mesa ${created.tableId}.`,

            data: {
              orderId:
                created.id,

              orderNumber:
                created.orderNumber,

              sessionId:
                created.sessionId,

              tableId:
                created.tableId,

              total:
                created.total,

              status:
                created.status,
            },

            read:
              false,
          });

        return created;
      }
    );
  }

  /*
   * ==========================================================
   * LISTAR PEDIDOS DEL ESTABLECIMIENTO
   * ==========================================================
   */

  static async getAllForEstablishment(
    establishmentId: number
  ) {
    return db
      .query
      .orders
      .findMany({
        where:
          eq(
            orders.establishmentId,
            establishmentId
          ),

        with: {
          items: {
            with: {
              product:
                true,
            },
          },
        },

        orderBy: (
          orders,
          {
            desc,
          }
        ) => [
          desc(
            orders.createdAt
          ),
        ],
      });
  }

  /*
   * ==========================================================
   * OBTENER PEDIDO DEL ESTABLECIMIENTO
   * ==========================================================
   */

  static async getByIdForEstablishment(
    id: number,
    establishmentId: number
  ) {
    return db
      .query
      .orders
      .findFirst({
        where:
          and(
            eq(
              orders.id,
              id
            ),

            eq(
              orders.establishmentId,
              establishmentId
            )
          ),

        with: {
          items: {
            with: {
              product:
                true,
            },
          },
        },
      });
  }

  /*
   * ==========================================================
   * ACTUALIZAR PEDIDO DEL ESTABLECIMIENTO
   * ==========================================================
   */

  static async updateForEstablishment(
    id: number,
    establishmentId: number,
    data: Partial<
      typeof orders.$inferInsert
    >
  ) {
    /*
     * Nunca aceptamos establishmentId procedente
     * del frontend como fuente de autoridad.
     */

    const {
      establishmentId:
        _ignoredEstablishmentId,

      id:
        _ignoredId,

      ...safeData
    } = data;

    const result =
      await db
        .update(
          orders
        )
        .set({
          ...safeData,

          updatedAt:
            new Date(),
        })
        .where(
          and(
            eq(
              orders.id,
              id
            ),

            eq(
              orders.establishmentId,
              establishmentId
            )
          )
        )
        .returning();

    return (
      result[0] ??
      null
    );
  }

  /*
   * ==========================================================
   * ELIMINAR PEDIDO DEL ESTABLECIMIENTO
   * ==========================================================
   */

  static async deleteForEstablishment(
    id: number,
    establishmentId: number
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

    return db.transaction(
      async (tx) => {
        await tx
          .delete(
            orderItems
          )
          .where(
            eq(
              orderItems.orderId,
              id
            )
          );

        const deleted =
          await tx
            .delete(
              orders
            )
            .where(
              and(
                eq(
                  orders.id,
                  id
                ),

                eq(
                  orders.establishmentId,
                  establishmentId
                )
              )
            )
            .returning();

        return (
          deleted[0] ??
          null
        );
      }
    );
  }
}
