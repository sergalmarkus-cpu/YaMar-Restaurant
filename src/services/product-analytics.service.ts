import {
  and,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  establishments,
  orderItems,
  orders,
  products,
} from "@/db/schema";

export type ProductAnalyticsPeriod =
  | 7
  | 30
  | 90;

interface ProductAnalyticsDay {
  date: string;
  label: string;
  units: number;
  revenue: number;
  orders: number;
}

interface ProductRankingItem {
  productId: number;
  name: unknown;
  units: number;
  revenue: number;
  orders: number;
  averageUnitPrice: number;
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
  return new Intl.DateTimeFormat(
    "es-ES",
    {
      timeZone:
        timezone,

      day:
        "2-digit",

      month:
        "short",
    }
  )
    .format(
      value
    )
    .replace(
      ".",
      ""
    );
}

function getCalendarDays(
  days: number,
  timezone: string
): ProductAnalyticsDay[] {
  const result:
    ProductAnalyticsDay[] =
    [];

  const now =
    new Date();

  for (
    let offset =
      days - 1;
    offset >=
    0;
    offset -=
    1
  ) {
    const date =
      new Date(
        now.getTime() -
          offset *
            24 *
            60 *
            60 *
            1000
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

      units:
        0,

      revenue:
        0,

      orders:
        0,
    });
  }

  return result;
}

export class ProductAnalyticsService {
  static async getForEstablishment(
    establishmentId: number,
    period: ProductAnalyticsPeriod
  ) {
    /*
     * ==========================================================
     * ESTABLECIMIENTO
     * ==========================================================
     */

    const establishmentRows =
      await db
        .select({
          id:
            establishments.id,

          name:
            establishments.name,

          currency:
            establishments.currency,

          timezone:
            establishments.timezone,
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
        .limit(1);

    const establishment =
      establishmentRows[0];

    if (
      !establishment
    ) {
      return null;
    }

    const currency =
      establishment.currency ??
      "EUR";

    const timezone =
      establishment.timezone ??
      "Europe/Madrid";

    /*
     * ==========================================================
     * CALENDARIO DEL PERIODO
     * ==========================================================
     */

    const daily =
      getCalendarDays(
        period,
        timezone
      );

    const firstDate =
      daily[0]?.date;

    const lastDate =
      daily[
        daily.length -
          1
      ]?.date;

    const dailyMap =
      new Map(
        daily.map(
          (
            day
          ) => [
            day.date,
            day,
          ]
        )
      );

    /*
     * ==========================================================
     * ARTÍCULOS DE PEDIDOS DEL TENANT
     *
     * Seguridad multi-tenant:
     * - order.establishmentId
     * - product.establishmentId
     *
     * Se ignoran pedidos cancelados.
     * ==========================================================
     */

    const rows =
      await db
        .select({
          orderId:
            orders.id,

          orderStatus:
            orders.status,

          orderCreatedAt:
            orders.createdAt,

          productId:
            products.id,

          productName:
            products.name,

          quantity:
            orderItems.quantity,

          subtotal:
            orderItems.subtotal,
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
          and(
            eq(
              orders.establishmentId,
              establishmentId
            ),

            eq(
              products.establishmentId,
              establishmentId
            )
          )
        );

    /*
     * ==========================================================
     * ACUMULADORES
     * ==========================================================
     */

    const productMap =
      new Map<
        number,
        {
          productId: number;
          name: unknown;
          units: number;
          revenue: number;
          orderIds:
            Set<number>;
        }
      >();

    const allOrderIds =
      new Set<number>();

    let totalUnits =
      0;

    let totalRevenue =
      0;

    /*
     * ==========================================================
     * PROCESAMIENTO
     * ==========================================================
     */

    for (
      const row of
        rows
    ) {
      if (
        row.orderStatus ===
        "cancelled"
      ) {
        continue;
      }

      const dateKey =
        getDateKey(
          row.orderCreatedAt,
          timezone
        );

      if (
        firstDate &&
        dateKey <
          firstDate
      ) {
        continue;
      }

      if (
        lastDate &&
        dateKey >
          lastDate
      ) {
        continue;
      }

      const quantity =
        Number(
          row.quantity
        );

      const revenue =
        Number(
          row.subtotal
        );

      totalUnits +=
        quantity;

      totalRevenue +=
        revenue;

      allOrderIds.add(
        row.orderId
      );

      /*
       * Día
       */

      const day =
        dailyMap.get(
          dateKey
        );

      if (
        day
      ) {
        day.units +=
          quantity;

        day.revenue =
          roundMoney(
            day.revenue +
              revenue
          );
      }

      /*
       * Producto
       */

      const existing =
        productMap.get(
          row.productId
        );

      if (
        existing
      ) {
        existing.units +=
          quantity;

        existing.revenue =
          roundMoney(
            existing.revenue +
              revenue
          );

        existing.orderIds.add(
          row.orderId
        );
      } else {
        productMap.set(
          row.productId,
          {
            productId:
              row.productId,

            name:
              row.productName,

            units:
              quantity,

            revenue:
              roundMoney(
                revenue
              ),

            orderIds:
              new Set([
                row.orderId,
              ]),
          }
        );
      }
    }

    /*
     * ==========================================================
     * PEDIDOS ÚNICOS POR DÍA
     * ==========================================================
     */

    for (
      const day of
        daily
    ) {
      const orderIds =
        new Set<number>();

      for (
        const row of
          rows
      ) {
        if (
          row.orderStatus ===
          "cancelled"
        ) {
          continue;
        }

        const dateKey =
          getDateKey(
            row.orderCreatedAt,
            timezone
          );

        if (
          dateKey ===
          day.date
        ) {
          orderIds.add(
            row.orderId
          );
        }
      }

      day.orders =
        orderIds.size;

      day.revenue =
        roundMoney(
          day.revenue
        );
    }

    /*
     * ==========================================================
     * RANKING
     * ==========================================================
     */

    const ranking:
      ProductRankingItem[] =
      Array.from(
        productMap.values()
      )
        .map(
          (
            product
          ) => ({
            productId:
              product.productId,

            name:
              product.name,

            units:
              product.units,

            revenue:
              roundMoney(
                product.revenue
              ),

            orders:
              product.orderIds.size,

            averageUnitPrice:
              product.units >
              0
                ? roundMoney(
                    product.revenue /
                      product.units
                  )
                : 0,
          })
        )
        .sort(
          (
            a,
            b
          ) => {
            if (
              b.units !==
              a.units
            ) {
              return (
                b.units -
                a.units
              );
            }

            if (
              b.revenue !==
              a.revenue
            ) {
              return (
                b.revenue -
                a.revenue
              );
            }

            return (
              a.productId -
              b.productId
            );
          }
        );

    const topProduct =
      ranking[0] ??
      null;

    const distinctProducts =
      ranking.length;

    const averageUnitsPerOrder =
      allOrderIds.size >
      0
        ? Math.round(
            (
              totalUnits /
              allOrderIds.size
            ) *
              100
          ) /
          100
        : 0;

    const averageDailyUnits =
      period >
      0
        ? Math.round(
            (
              totalUnits /
              period
            ) *
              100
          ) /
          100
        : 0;

    /*
     * ==========================================================
     * RESPUESTA
     * ==========================================================
     */

    return {
      establishment: {
        id:
          establishment.id,

        name:
          establishment.name,

        currency,

        timezone,
      },

      period: {
        days:
          period,

        from:
          firstDate ??
          "",

        to:
          lastDate ??
          "",
      },

      summary: {
        totalUnits,

        totalRevenue:
          roundMoney(
            totalRevenue
          ),

        totalOrders:
          allOrderIds.size,

        distinctProducts,

        averageUnitsPerOrder,

        averageDailyUnits,

        topProduct:
          topProduct
            ? {
                productId:
                  topProduct.productId,

                name:
                  topProduct.name,

                units:
                  topProduct.units,

                revenue:
                  topProduct.revenue,
              }
            : null,
      },

      daily,

      ranking,
    };
  }
}