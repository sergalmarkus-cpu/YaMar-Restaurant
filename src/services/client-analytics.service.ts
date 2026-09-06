import {
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  establishments,
  payments,
  sessions,
} from "@/db/schema";

export type ClientAnalyticsPeriod =
  | 7
  | 30
  | 90;

interface ClientAnalyticsDay {
  date: string;
  label: string;
  visits: number;
  customers: number;
  newCustomers: number;
  returningCustomers: number;
}

interface CustomerAggregate {
  key: string;
  firstVisit: Date;
  visitsInPeriod: number;
  paidInPeriod: number;
  anonymous: boolean;
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

function normalizeEmail(
  email: string
) {
  return email
    .trim()
    .toLowerCase();
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

  if (
    !year ||
    !month ||
    !day
  ) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

function getDateLabel(
  dateKey: string,
  timezone: string
) {
  const [
    year,
    month,
    day,
  ] =
    dateKey
      .split("-")
      .map(Number);

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        12
      )
    );

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
    .format(date)
    .replace(".", "");
}

function buildDateKeys(
  period: ClientAnalyticsPeriod,
  timezone: string
) {
  const todayKey =
    getDateKey(
      new Date(),
      timezone
    );

  const [
    year,
    month,
    day,
  ] =
    todayKey
      .split("-")
      .map(Number);

  const result:
    string[] =
    [];

  for (
    let offset =
      period - 1;
    offset >=
    0;
    offset -=
      1
  ) {
    const date =
      new Date(
        Date.UTC(
          year,
          month - 1,
          day - offset,
          12
        )
      );

    const dateKey =
      [
        date.getUTCFullYear(),
        String(
          date.getUTCMonth() +
            1
        ).padStart(
          2,
          "0"
        ),
        String(
          date.getUTCDate()
        ).padStart(
          2,
          "0"
        ),
      ].join("-");

    result.push(
      dateKey
    );
  }

  return result;
}

export class ClientAnalyticsService {
  static async getForEstablishment(
    establishmentId: number,
    period: ClientAnalyticsPeriod
  ) {
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
      throw new Error(
        "ESTABLISHMENT_NOT_FOUND"
      );
    }

    const currency =
      establishment.currency ??
      "EUR";

    const timezone =
      establishment.timezone ??
      "Europe/Madrid";

    const dateKeys =
      buildDateKeys(
        period,
        timezone
      );

    const firstDate =
      dateKeys[0] ??
      "";

    const lastDate =
      dateKeys[
        dateKeys.length -
          1
      ] ??
      "";

    /*
     * Necesitamos el histórico completo de sesiones
     * para distinguir correctamente:
     *
     * - cliente nuevo;
     * - cliente recurrente.
     *
     * Un email normalizado representa un mismo cliente.
     * Sin email, cada sesión representa un visitante
     * anónimo independiente, igual que en CustomerService.
     */
    const sessionRows =
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
          eq(
            sessions.establishmentId,
            establishmentId
          )
        );

    const paymentRows =
      await db
        .select({
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
          eq(
            payments.establishmentId,
            establishmentId
          )
        );

    const customerKeyBySession =
      new Map<
        string,
        string
      >();

    const firstVisitByCustomer =
      new Map<
        string,
        Date
      >();

    for (
      const session of
      sessionRows
    ) {
      const normalizedEmail =
        session.customerEmail
          ? normalizeEmail(
              session.customerEmail
            )
          : null;

      const key =
        normalizedEmail
          ? `email:${normalizedEmail}`
          : `session:${session.id}`;

      customerKeyBySession.set(
        session.id,
        key
      );

      const existing =
        firstVisitByCustomer.get(
          key
        );

      if (
        !existing ||
        session.createdAt <
          existing
      ) {
        firstVisitByCustomer.set(
          key,
          session.createdAt
        );
      }
    }

    const dailyMap =
      new Map<
        string,
        ClientAnalyticsDay
      >();

    const customerKeysByDay =
      new Map<
        string,
        Set<string>
      >();

    const newCustomerKeysByDay =
      new Map<
        string,
        Set<string>
      >();

    const returningCustomerKeysByDay =
      new Map<
        string,
        Set<string>
      >();

    for (
      const dateKey of
      dateKeys
    ) {
      dailyMap.set(
        dateKey,
        {
          date:
            dateKey,
          label:
            getDateLabel(
              dateKey,
              timezone
            ),
          visits:
            0,
          customers:
            0,
          newCustomers:
            0,
          returningCustomers:
            0,
        }
      );

      customerKeysByDay.set(
        dateKey,
        new Set<string>()
      );

      newCustomerKeysByDay.set(
        dateKey,
        new Set<string>()
      );

      returningCustomerKeysByDay.set(
        dateKey,
        new Set<string>()
      );
    }

    const customersInPeriod =
      new Map<
        string,
        CustomerAggregate
      >();

    let totalVisits =
      0;

    for (
      const session of
      sessionRows
    ) {
      const dateKey =
        getDateKey(
          session.createdAt,
          timezone
        );

      const day =
        dailyMap.get(
          dateKey
        );

      if (
        !day
      ) {
        continue;
      }

      const key =
        customerKeyBySession.get(
          session.id
        );

      if (
        !key
      ) {
        continue;
      }

      totalVisits +=
        1;

      day.visits +=
        1;

      customerKeysByDay
        .get(
          dateKey
        )
        ?.add(
          key
        );

      const firstVisit =
        firstVisitByCustomer.get(
          key
        ) ??
        session.createdAt;

      const firstVisitKey =
        getDateKey(
          firstVisit,
          timezone
        );

      if (
        firstVisitKey ===
        dateKey
      ) {
        newCustomerKeysByDay
          .get(
            dateKey
          )
          ?.add(
            key
          );
      } else {
        returningCustomerKeysByDay
          .get(
            dateKey
          )
          ?.add(
            key
          );
      }

      const existing =
        customersInPeriod.get(
          key
        );

      if (
        existing
      ) {
        existing.visitsInPeriod +=
          1;
      } else {
        customersInPeriod.set(
          key,
          {
            key,
            firstVisit,
            visitsInPeriod:
              1,
            paidInPeriod:
              0,
            anonymous:
              key.startsWith(
                "session:"
              ),
          }
        );
      }
    }

    const payingCustomerKeys =
      new Set<string>();

    let totalRevenue =
      0;

    for (
      const payment of
      paymentRows
    ) {
      if (
        payment.status !==
        "paid"
      ) {
        continue;
      }

      const dateKey =
        getDateKey(
          payment.createdAt,
          timezone
        );

      if (
        !dailyMap.has(
          dateKey
        )
      ) {
        continue;
      }

      const key =
        customerKeyBySession.get(
          payment.sessionId
        );

      if (
        !key
      ) {
        continue;
      }

      const customer =
        customersInPeriod.get(
          key
        );

      if (
        !customer
      ) {
        continue;
      }

      const amount =
        Number(
          payment.amount
        );

      customer.paidInPeriod =
        roundMoney(
          customer.paidInPeriod +
            amount
        );

      totalRevenue =
        roundMoney(
          totalRevenue +
            amount
        );

      payingCustomerKeys.add(
        key
      );
    }

    const daily =
      dateKeys.map(
        (
          dateKey
        ) => {
          const day =
            dailyMap.get(
              dateKey
            )!;

          day.customers =
            customerKeysByDay.get(
              dateKey
            )?.size ??
            0;

          day.newCustomers =
            newCustomerKeysByDay.get(
              dateKey
            )?.size ??
            0;

          day.returningCustomers =
            returningCustomerKeysByDay.get(
              dateKey
            )?.size ??
            0;

          return day;
        }
      );

    const uniqueCustomers =
      customersInPeriod.size;

    let newCustomers =
      0;

    let returningCustomers =
      0;

    let anonymousCustomers =
      0;

    for (
      const customer of
      customersInPeriod.values()
    ) {
      const firstVisitKey =
        getDateKey(
          customer.firstVisit,
          timezone
        );

      if (
        firstVisitKey >=
          firstDate &&
        firstVisitKey <=
          lastDate
      ) {
        newCustomers +=
          1;
      } else {
        returningCustomers +=
          1;
      }

      if (
        customer.anonymous
      ) {
        anonymousCustomers +=
          1;
      }
    }

    const identifiedCustomers =
      uniqueCustomers -
      anonymousCustomers;

    const payingCustomers =
      payingCustomerKeys.size;

    const averageSpendPerCustomer =
      payingCustomers >
      0
        ? roundMoney(
            totalRevenue /
              payingCustomers
          )
        : 0;

    const averageVisitsPerCustomer =
      uniqueCustomers >
      0
        ? Math.round(
            (
              totalVisits /
              uniqueCustomers
            ) *
              100
          ) /
          100
        : 0;

    const repeatRate =
      uniqueCustomers >
      0
        ? Math.round(
            (
              returningCustomers /
              uniqueCustomers
            ) *
              10000
          ) /
          100
        : 0;

    const topCustomers =
      Array.from(
        customersInPeriod.values()
      )
        .filter(
          (
            customer
          ) =>
            !customer.anonymous
        )
        .sort(
          (
            a,
            b
          ) =>
            b.paidInPeriod -
              a.paidInPeriod ||
            b.visitsInPeriod -
              a.visitsInPeriod
        )
        .slice(
          0,
          10
        )
        .map(
          (
            customer
          ) => ({
            key:
              customer.key,
            visits:
              customer.visitsInPeriod,
            totalPaid:
              customer.paidInPeriod,
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

      period: {
        days:
          period,
        from:
          firstDate,
        to:
          lastDate,
      },

      summary: {
        uniqueCustomers,
        newCustomers,
        returningCustomers,
        identifiedCustomers,
        anonymousCustomers,
        payingCustomers,
        totalVisits,
        totalRevenue:
          roundMoney(
            totalRevenue
          ),
        averageSpendPerCustomer,
        averageVisitsPerCustomer,
        repeatRate,
      },

      daily,

      topCustomers,
    };
  }
}
