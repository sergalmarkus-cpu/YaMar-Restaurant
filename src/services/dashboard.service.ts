import {
  and,
  desc,
  eq,
  gte,
  ne,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  establishments,
  orderItems,
  orders,
  payments,
  products,
  sessions,
  tables,
} from "@/db/schema";

interface DashboardDay {
  date: string;
  label: string;
  sales: number;
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  tableId: number;
  tableName: string | null;
  itemCount: number;
  total: number;
  status:
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "delivering"
    | "delivered"
    | "cancelled"
    | null;
  createdAt: Date;
}

interface TopProduct {
  productId: number;
  name: unknown;
  quantity: number;
  revenue: number;
}

function roundMoney(
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

function percentChange(
  current: number,
  previous: number
) {
  if (
    previous ===
    0
  ) {
    if (
      current ===
      0
    ) {
      return 0;
    }

    return 100;
  }

  return roundMoney(
    (
      (
        current -
        previous
      ) /
      previous
    ) *
      100
  );
}

function getDateKey(
  value: Date,
  timezone: string
) {
  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          timezone,

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",
      }
    ).formatToParts(
      value
    );

  const year =
    parts.find(
      (
        part
      ) =>
        part.type ===
        "year"
    )?.value;

  const month =
    parts.find(
      (
        part
      ) =>
        part.type ===
        "month"
    )?.value;

  const day =
    parts.find(
      (
        part
      ) =>
        part.type ===
        "day"
    )?.value;

  return `${year}-${month}-${day}`;
}

function getDayLabel(
  value: Date,
  timezone: string
) {
  const label =
    new Intl.DateTimeFormat(
      "es-ES",
      {
        timeZone:
          timezone,

        weekday:
          "short",
      }
    ).format(
      value
    );

  return (
    label
      .replace(
        ".",
        ""
      )
      .slice(
        0,
        3
      )
  );
}

function getCalendarDays(
  numberOfDays: number,
  timezone: string
) {
  const result: DashboardDay[] =
    [];

  const now =
    new Date();

  for (
    let offset =
      numberOfDays -
      1;
    offset >=
    0;
    offset -=
      1
  ) {
    const date =
      new Date(
        now
      );

    date.setUTCDate(
      date.getUTCDate() -
        offset
    );

    result.push({
      date:
        getDateKey(
          date,
          timezone
        ),

      label:
        getDayLabel(
          date,
          timezone
        ),

      sales:
        0,
    });
  }

  return result;
}

export class DashboardService {
  static async getForEstablishment(
    establishmentId: number
  ) {
    /*
     * ==========================================================
     * ESTABLECIMIENTO
     * ==========================================================
     */

    const establishment =
      await db.query.establishments.findFirst({
        where:
          eq(
            establishments.id,
            establishmentId
          ),
      });

    if (
      !establishment
    ) {
      return null;
    }

    const timezone =
      establishment.timezone ??
      "Europe/Madrid";

    const currency =
      establishment.currency ??
      "EUR";

    const now =
      new Date();

    /*
     * Recuperamos una ventana ligeramente mayor de ocho días.
     *
     * El agrupado final se realiza según la zona horaria
     * configurada por el tenant.
     */
    const queryStart =
      new Date(
        now.getTime() -
          9 *
            24 *
            60 *
            60 *
            1000
      );

    /*
     * ==========================================================
     * PEDIDOS RECIENTES PARA MÉTRICAS
     * ==========================================================
     */

    const recentOrderRows =
      await db
        .select({
          id:
            orders.id,

          sessionId:
            orders.sessionId,

          status:
            orders.status,

          total:
            orders.total,

          estimatedTime:
            orders.estimatedTime,

          createdAt:
            orders.createdAt,
        })
        .from(
          orders
        )
        .where(
          and(
            eq(
              orders.establishmentId,
              establishmentId
            ),

            gte(
              orders.createdAt,
              queryStart
            )
          )
        );

    /*
     * ==========================================================
     * PAGOS RECIENTES
     * ==========================================================
     */

    const recentPaymentRows =
      await db
        .select({
          id:
            payments.id,

          sessionId:
            payments.sessionId,

          amount:
            payments.amount,

          status:
            payments.status,

          createdAt:
            payments.createdAt,
        })
        .from(
          payments
        )
        .where(
          and(
            eq(
              payments.establishmentId,
              establishmentId
            ),

            gte(
              payments.createdAt,
              queryStart
            )
          )
        );

    /*
     * ==========================================================
     * SESIONES RECIENTES
     * ==========================================================
     */

    const recentSessionRows =
      await db
        .select({
          id:
            sessions.id,

          customerEmail:
            sessions.customerEmail,

          createdAt:
            sessions.createdAt,
        })
        .from(
          sessions
        )
        .where(
          and(
            eq(
              sessions.establishmentId,
              establishmentId
            ),

            gte(
              sessions.createdAt,
              queryStart
            )
          )
        );

    const todayKey =
      getDateKey(
        now,
        timezone
      );

    const yesterday =
      new Date(
        now
      );

    yesterday.setUTCDate(
      yesterday.getUTCDate() -
        1
    );

    const yesterdayKey =
      getDateKey(
        yesterday,
        timezone
      );

    /*
     * ==========================================================
     * VENTAS
     * ==========================================================
     */

    const paidPayments =
      recentPaymentRows.filter(
        (
          payment
        ) =>
          payment.status ===
          "paid"
      );

    const salesToday =
      roundMoney(
        paidPayments
          .filter(
            (
              payment
            ) =>
              getDateKey(
                payment.createdAt,
                timezone
              ) ===
              todayKey
          )
          .reduce(
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

    const salesYesterday =
      roundMoney(
        paidPayments
          .filter(
            (
              payment
            ) =>
              getDateKey(
                payment.createdAt,
                timezone
              ) ===
              yesterdayKey
          )
          .reduce(
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

    /*
     * ==========================================================
     * PEDIDOS
     *
     * Para estadísticas comerciales ignoramos cancelados.
     * ==========================================================
     */

    const businessOrders =
      recentOrderRows.filter(
        (
          order
        ) =>
          order.status !==
          "cancelled"
      );

    const ordersToday =
      businessOrders.filter(
        (
          order
        ) =>
          getDateKey(
            order.createdAt,
            timezone
          ) ===
          todayKey
      ).length;

    const ordersYesterday =
      businessOrders.filter(
        (
          order
        ) =>
          getDateKey(
            order.createdAt,
            timezone
          ) ===
          yesterdayKey
      ).length;

    /*
     * ==========================================================
     * CLIENTES / VISITANTES
     *
     * Una sesión QR representa una visita real al negocio.
     * ==========================================================
     */

    const customersToday =
      recentSessionRows.filter(
        (
          session
        ) =>
          getDateKey(
            session.createdAt,
            timezone
          ) ===
          todayKey
      ).length;

    const customersYesterday =
      recentSessionRows.filter(
        (
          session
        ) =>
          getDateKey(
            session.createdAt,
            timezone
          ) ===
          yesterdayKey
      ).length;

    /*
     * ==========================================================
     * TICKET MEDIO
     *
     * Se calcula sobre sesiones con al menos un pago cobrado.
     * ==========================================================
     */

    const paidToday =
      paidPayments.filter(
        (
          payment
        ) =>
          getDateKey(
            payment.createdAt,
            timezone
          ) ===
          todayKey
      );

    const paidYesterday =
      paidPayments.filter(
        (
          payment
        ) =>
          getDateKey(
            payment.createdAt,
            timezone
          ) ===
          yesterdayKey
      );

    const paidSessionsToday =
      new Set(
        paidToday.map(
          (
            payment
          ) =>
            payment.sessionId
        )
      ).size;

    const paidSessionsYesterday =
      new Set(
        paidYesterday.map(
          (
            payment
          ) =>
            payment.sessionId
        )
      ).size;

    const averageTicketToday =
      paidSessionsToday >
      0
        ? roundMoney(
            salesToday /
              paidSessionsToday
          )
        : 0;

    const averageTicketYesterday =
      paidSessionsYesterday >
      0
        ? roundMoney(
            salesYesterday /
              paidSessionsYesterday
          )
        : 0;

    /*
     * ==========================================================
     * VENTAS ÚLTIMOS 7 DÍAS
     * ==========================================================
     */

    const weeklySales =
      getCalendarDays(
        7,
        timezone
      );

    const weeklySalesMap =
      new Map(
        weeklySales.map(
          (
            day
          ) => [
            day.date,
            day,
          ]
        )
      );

    for (
      const payment of
        paidPayments
    ) {
      const key =
        getDateKey(
          payment.createdAt,
          timezone
        );

      const day =
        weeklySalesMap.get(
          key
        );

      if (
        !day
      ) {
        continue;
      }

      day.sales =
        roundMoney(
          day.sales +
            Number(
              payment.amount
            )
        );
    }

    /*
     * ==========================================================
     * ESTADO DE COCINA
     * ==========================================================
     */

    const activeKitchenRows =
      await db
        .select({
          id:
            orders.id,

          status:
            orders.status,

          estimatedTime:
            orders.estimatedTime,

          createdAt:
            orders.createdAt,
        })
        .from(
          orders
        )
        .where(
          and(
            eq(
              orders.establishmentId,
              establishmentId
            ),

            ne(
              orders.status,
              "delivered"
            ),

            ne(
              orders.status,
              "cancelled"
            )
          )
        );

    const kitchenReady =
      activeKitchenRows.filter(
        (
          order
        ) =>
          order.status ===
          "ready"
      ).length;

    const kitchenPreparing =
      activeKitchenRows.filter(
        (
          order
        ) =>
          order.status ===
            "accepted" ||
          order.status ===
            "preparing"
      ).length;

    const kitchenDelayed =
      activeKitchenRows.filter(
        (
          order
        ) => {
          const estimatedTime =
            order.estimatedTime ??
            15;

          const elapsedMinutes =
            (
              now.getTime() -
              order.createdAt.getTime()
            ) /
            60000;

          return (
            elapsedMinutes >
            estimatedTime
          );
        }
      ).length;

    /*
     * ==========================================================
     * PEDIDOS RECIENTES
     * ==========================================================
     */

    const recentOrdersRaw =
      await db
        .select({
          id:
            orders.id,

          orderNumber:
            orders.orderNumber,

          tableId:
            orders.tableId,

          tableName:
            tables.code,

          total:
            orders.total,

          status:
            orders.status,

          createdAt:
            orders.createdAt,
        })
        .from(
          orders
        )
        .leftJoin(
          tables,
          eq(
            orders.tableId,
            tables.id
          )
        )
        .where(
          eq(
            orders.establishmentId,
            establishmentId
          )
        )
        .orderBy(
          desc(
            orders.createdAt
          )
        )
        .limit(
          5
        );

    const recentOrderIds =
      recentOrdersRaw.map(
        (
          order
        ) =>
          order.id
      );

    const itemCounts =
      new Map<
        number,
        number
      >();

    if (
      recentOrderIds.length >
      0
    ) {
      const recentItems =
        await db
          .select({
            orderId:
              orderItems.orderId,

            quantity:
              orderItems.quantity,
          })
          .from(
            orderItems
          );

      for (
        const item of
          recentItems
      ) {
        if (
          !recentOrderIds.includes(
            item.orderId
          )
        ) {
          continue;
        }

        itemCounts.set(
          item.orderId,
          (
            itemCounts.get(
              item.orderId
            ) ??
            0
          ) +
            item.quantity
        );
      }
    }

    const recentOrders:
      RecentOrder[] =
      recentOrdersRaw.map(
        (
          order
        ) => ({
          id:
            order.id,

          orderNumber:
            order.orderNumber,

          tableId:
            order.tableId,

          tableName:
            order.tableName,

          itemCount:
            itemCounts.get(
              order.id
            ) ??
            0,

          total:
            Number(
              order.total
            ),

          status:
            order.status,

          createdAt:
            order.createdAt,
        })
      );

    /*
     * ==========================================================
     * PRODUCTOS MÁS VENDIDOS - ÚLTIMOS 7 DÍAS
     * ==========================================================
     */

    const firstWeeklyDate =
      weeklySales[0]
        ?.date;

    const topProductRows =
      await db
        .select({
          productId:
            products.id,

          name:
            products.name,

          quantity:
            orderItems.quantity,

          subtotal:
            orderItems.subtotal,

          orderStatus:
            orders.status,

          orderCreatedAt:
            orders.createdAt,
        })
        .from(
          orderItems
        )
        .innerJoin(
          orders,
          eq(
            orderItems.orderId,
            orders.id
          )
        )
        .innerJoin(
          products,
          eq(
            orderItems.productId,
            products.id
          )
        )
        .where(
          eq(
            orders.establishmentId,
            establishmentId
          )
        );

    const productMap =
      new Map<
        number,
        TopProduct
      >();

    for (
      const row of
        topProductRows
    ) {
      if (
        row.orderStatus ===
        "cancelled"
      ) {
        continue;
      }

      const orderDate =
        getDateKey(
          row.orderCreatedAt,
          timezone
        );

      if (
        firstWeeklyDate &&
        orderDate <
          firstWeeklyDate
      ) {
        continue;
      }

      const current =
        productMap.get(
          row.productId
        );

      if (
        current
      ) {
        current.quantity +=
          row.quantity;

        current.revenue =
          roundMoney(
            current.revenue +
              Number(
                row.subtotal
              )
          );

        continue;
      }

      productMap.set(
        row.productId,
        {
          productId:
            row.productId,

          name:
            row.name,

          quantity:
            row.quantity,

          revenue:
            Number(
              row.subtotal
            ),
        }
      );
    }

    const topProducts =
      Array.from(
        productMap.values()
      )
        .sort(
          (
            a,
            b
          ) => {
            if (
              b.quantity !==
              a.quantity
            ) {
              return (
                b.quantity -
                a.quantity
              );
            }

            return (
              b.revenue -
              a.revenue
            );
          }
        )
        .slice(
          0,
          5
        )
        .map(
          (
            product
          ) => ({
            ...product,

            revenue:
              roundMoney(
                product.revenue
              ),
          })
        );

    return {
      establishment: {
        id:
          establishment.id,

        name:
          establishment.name,

        currency,

        timezone,
      },

      metrics: {
        sales: {
          today:
            salesToday,

          yesterday:
            salesYesterday,

          change:
            percentChange(
              salesToday,
              salesYesterday
            ),
        },

        orders: {
          today:
            ordersToday,

          yesterday:
            ordersYesterday,

          change:
            percentChange(
              ordersToday,
              ordersYesterday
            ),
        },

        customers: {
          today:
            customersToday,

          yesterday:
            customersYesterday,

          change:
            percentChange(
              customersToday,
              customersYesterday
            ),
        },

        averageTicket: {
          today:
            averageTicketToday,

          yesterday:
            averageTicketYesterday,

          change:
            percentChange(
              averageTicketToday,
              averageTicketYesterday
            ),
        },
      },

      kitchen: {
        ready:
          kitchenReady,

        preparing:
          kitchenPreparing,

        delayed:
          kitchenDelayed,
      },

      weeklySales,

      recentOrders,

      topProducts,
    };
  }
}