import {
  and,
  eq,
  gte,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  establishments,
  orders,
  payments,
} from "@/db/schema";

export type SalesAnalyticsPeriod =
  7 |
  30 |
  90;

interface SalesAnalyticsDay {
  date: string;
  label: string;
  sales: number;
  payments: number;
  orders: number;
  customers: number;
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
): SalesAnalyticsDay[] {
  const result:
    SalesAnalyticsDay[] =
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

      payments:
        0,

      orders:
        0,

      customers:
        0,
    });
  }

  return result;
}

export class SalesAnalyticsService {
  static async getForEstablishment(
    establishmentId: number,
    period: SalesAnalyticsPeriod
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
        .limit(
          1
        );

    const establishment =
      establishmentRows[0];

    if (
      !establishment
    ) {
      return null;
    }

    const timezone =
      establishment.timezone ||
      "Europe/Madrid";

    const currency =
      establishment.currency ||
      "EUR";

    /*
     * Pedimos algo más de margen temporal
     * para evitar perder registros al convertir
     * desde UTC a la zona horaria del negocio.
     */
    const queryStart =
      new Date();

    queryStart.setUTCDate(
      queryStart.getUTCDate() -
        (
          period +
          2
        )
    );

    /*
     * ==========================================================
     * PAGOS
     * ==========================================================
     *
     * Igual que DashboardService:
     * solo status = "paid" representa venta real.
     * ==========================================================
     */

    const paymentRows =
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

    const paidPayments =
      paymentRows.filter(
        (
          payment
        ) =>
          payment.status ===
          "paid"
      );

    /*
     * ==========================================================
     * PEDIDOS
     * ==========================================================
     *
     * Igual que DashboardService:
     * cancelados no cuentan como actividad comercial.
     * ==========================================================
     */

    const orderRows =
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

    const businessOrders =
      orderRows.filter(
        (
          order
        ) =>
          order.status !==
          "cancelled"
      );

    /*
     * ==========================================================
     * CALENDARIO
     * ==========================================================
     */

    const daily =
      getCalendarDays(
        period,
        timezone
      );

    const dayMap =
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

    const customerSessionsByDay =
      new Map<
        string,
        Set<string>
      >();

    /*
     * ==========================================================
     * DISTRIBUCIÓN DE PAGOS
     * ==========================================================
     */

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
        dayMap.get(
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

      day.payments +=
        1;

      let sessionsForDay =
        customerSessionsByDay.get(
          key
        );

      if (
        !sessionsForDay
      ) {
        sessionsForDay =
          new Set<string>();

        customerSessionsByDay.set(
          key,
          sessionsForDay
        );
      }

      sessionsForDay.add(
        payment.sessionId
      );
    }

    /*
     * ==========================================================
     * DISTRIBUCIÓN DE PEDIDOS
     * ==========================================================
     */

    for (
      const order of
        businessOrders
    ) {
      const key =
        getDateKey(
          order.createdAt,
          timezone
        );

      const day =
        dayMap.get(
          key
        );

      if (
        !day
      ) {
        continue;
      }

      day.orders +=
        1;
    }

    /*
     * ==========================================================
     * CLIENTES PAGADORES POR DÍA
     * ==========================================================
     *
     * Una misma sesión con varios pagos
     * cuenta una sola vez.
     * ==========================================================
     */

    for (
      const day of
        daily
    ) {
      day.customers =
        customerSessionsByDay.get(
          day.date
        )?.size ??
        0;
    }

    /*
     * ==========================================================
     * TOTALES DEL PERIODO
     * ==========================================================
     */

    const totalSales =
      roundMoney(
        daily.reduce(
          (
            sum,
            day
          ) =>
            sum +
            day.sales,
          0
        )
      );

    const totalPayments =
      daily.reduce(
        (
          sum,
          day
        ) =>
          sum +
          day.payments,
        0
      );

    const totalOrders =
      daily.reduce(
        (
          sum,
          day
        ) =>
          sum +
          day.orders,
        0
      );

    const paidSessionIds =
      new Set<string>();

    for (
      const sessionsForDay of
        customerSessionsByDay.values()
    ) {
      for (
        const sessionId of
          sessionsForDay
      ) {
        paidSessionIds.add(
          sessionId
        );
      }
    }

    const payingCustomers =
      paidSessionIds.size;

    const averageTicket =
      payingCustomers >
      0
        ? roundMoney(
            totalSales /
              payingCustomers
          )
        : 0;

    const averageDailySales =
      period >
      0
        ? roundMoney(
            totalSales /
              period
          )
        : 0;

    /*
     * Día con mayor facturación.
     */
    const bestDay =
      daily.reduce<
        SalesAnalyticsDay |
        null
      >(
        (
          best,
          day
        ) => {
          if (
            !best ||
            day.sales >
              best.sales
          ) {
            return day;
          }

          return best;
        },
        null
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

      period: {
        days:
          period,

        from:
          daily[0]
            ?.date ??
          null,

        to:
          daily[
            daily.length -
              1
          ]?.date ??
          null,
      },

      summary: {
        totalSales,

        totalPayments,

        totalOrders,

        payingCustomers,

        averageTicket,

        averageDailySales,

        bestDay:
          bestDay &&
          bestDay.sales >
            0
            ? {
                date:
                  bestDay.date,

                label:
                  bestDay.label,

                sales:
                  bestDay.sales,
              }
            : null,
      },

      daily,
    };
  }
}