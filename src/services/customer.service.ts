import {
  desc,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  loyaltyPoints,
  orders,
  payments,
  sessions,
} from "@/db/schema";

export interface CustomerSummary {
  key: string;

  customerName:
    string | null;

  customerEmail:
    string | null;

  customerPhone:
    string | null;

  roomNumber:
    string | null;

  language:
    string | null;

  visits:
    number;

  activeSessions:
    number;

  orderCount:
    number;

  successfulOrders:
    number;

  cancelledOrders:
    number;

  totalOrdered:
    number;

  totalPaid:
    number;

  loyaltyPoints:
    number;

  firstVisit:
    Date;

  lastVisit:
    Date;

  anonymous:
    boolean;
}

interface MutableCustomer
  extends CustomerSummary {
  sessionIds:
    Set<string>;
}

export class CustomerService {
  private static normalizeEmail(
    email: string
  ) {
    return email
      .trim()
      .toLowerCase();
  }

  private static roundMoney(
    value: number
  ) {
    return Math.round(
      (
        value +
        Number.EPSILON
      ) *
        100
    ) / 100;
  }

  /*
   * ==========================================================
   * LISTADO CRM AGREGADO POR ESTABLECIMIENTO
   * ==========================================================
   *
   * No existe una tabla "customers".
   *
   * - Con email:
   *   varias sesiones del mismo email representan
   *   el mismo cliente.
   *
   * - Sin email:
   *   cada sesión se considera un visitante anónimo
   *   independiente.
   *
   * Toda la información queda limitada al tenant
   * autenticado.
   * ==========================================================
   */

  static async listForEstablishment(
    establishmentId: number
  ): Promise<CustomerSummary[]> {
    const sessionRows =
      await db
        .select({
          id:
            sessions.id,

          customerName:
            sessions.customerName,

          customerEmail:
            sessions.customerEmail,

          customerPhone:
            sessions.customerPhone,

          roomNumber:
            sessions.roomNumber,

          language:
            sessions.language,

          active:
            sessions.active,

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
        )
        .orderBy(
          desc(
            sessions.createdAt
          )
        );

    if (
      sessionRows.length ===
      0
    ) {
      return [];
    }

    const orderRows =
      await db
        .select({
          sessionId:
            orders.sessionId,

          status:
            orders.status,

          total:
            orders.total,
        })
        .from(
          orders
        )
        .where(
          eq(
            orders.establishmentId,
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

    const loyaltyRows =
      await db
        .select({
          sessionId:
            loyaltyPoints.sessionId,

          customerEmail:
            loyaltyPoints.customerEmail,

          points:
            loyaltyPoints.points,

          lastVisit:
            loyaltyPoints.lastVisit,
        })
        .from(
          loyaltyPoints
        )
        .where(
          eq(
            loyaltyPoints.establishmentId,
            establishmentId
          )
        );

    /*
     * sessionId -> clave de cliente.
     */
    const customerKeyBySession =
      new Map<
        string,
        string
      >();

    const customers =
      new Map<
        string,
        MutableCustomer
      >();

    /*
     * ========================================================
     * SESIONES
     * ========================================================
     */

    for (
      const session of
      sessionRows
    ) {
      const normalizedEmail =
        session.customerEmail
          ? this.normalizeEmail(
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
        customers.get(
          key
        );

      if (!existing) {
        customers.set(
          key,
          {
            key,

            customerName:
              session.customerName,

            customerEmail:
              normalizedEmail,

            customerPhone:
              session.customerPhone,

            roomNumber:
              session.roomNumber,

            language:
              session.language,

            visits:
              1,

            activeSessions:
              session.active
                ? 1
                : 0,

            orderCount:
              0,

            successfulOrders:
              0,

            cancelledOrders:
              0,

            totalOrdered:
              0,

            totalPaid:
              0,

            loyaltyPoints:
              0,

            firstVisit:
              session.createdAt,

            lastVisit:
              session.createdAt,

            anonymous:
              !normalizedEmail,

            sessionIds:
              new Set([
                session.id,
              ]),
          }
        );

        continue;
      }

      existing.visits +=
        1;

      if (
        session.active
      ) {
        existing.activeSessions +=
          1;
      }

      existing.sessionIds.add(
        session.id
      );

      /*
       * sessionRows viene en orden descendente,
       * así que conservamos los datos de contacto
       * más recientes que estén presentes.
       */

      if (
        !existing.customerName &&
        session.customerName
      ) {
        existing.customerName =
          session.customerName;
      }

      if (
        !existing.customerPhone &&
        session.customerPhone
      ) {
        existing.customerPhone =
          session.customerPhone;
      }

      if (
        !existing.roomNumber &&
        session.roomNumber
      ) {
        existing.roomNumber =
          session.roomNumber;
      }

      if (
        !existing.language &&
        session.language
      ) {
        existing.language =
          session.language;
      }

      if (
        session.createdAt <
        existing.firstVisit
      ) {
        existing.firstVisit =
          session.createdAt;
      }

      if (
        session.createdAt >
        existing.lastVisit
      ) {
        existing.lastVisit =
          session.createdAt;
      }
    }

    /*
     * ========================================================
     * PEDIDOS
     * ========================================================
     */

    for (
      const order of
      orderRows
    ) {
      const key =
        customerKeyBySession.get(
          order.sessionId
        );

      if (!key) {
        continue;
      }

      const customer =
        customers.get(
          key
        );

      if (!customer) {
        continue;
      }

      customer.orderCount +=
        1;

      if (
        order.status ===
        "cancelled"
      ) {
        customer.cancelledOrders +=
          1;

        continue;
      }

      if (
        order.status ===
        "delivered"
      ) {
        customer.successfulOrders +=
          1;
      }

      customer.totalOrdered =
        this.roundMoney(
          customer.totalOrdered +
            Number(
              order.total
            )
        );
    }

    /*
     * ========================================================
     * PAGOS
     * ========================================================
     *
     * totalPaid representa únicamente importes
     * de pagos cuyo estado final es "paid".
     * ========================================================
     */

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

      const key =
        customerKeyBySession.get(
          payment.sessionId
        );

      if (!key) {
        continue;
      }

      const customer =
        customers.get(
          key
        );

      if (!customer) {
        continue;
      }

      customer.totalPaid =
        this.roundMoney(
          customer.totalPaid +
            Number(
              payment.amount
            )
        );
    }

    /*
     * ========================================================
     * FIDELIZACIÓN
     * ========================================================
     */

    for (
      const loyalty of
      loyaltyRows
    ) {
      const normalizedEmail =
        loyalty.customerEmail
          ? this.normalizeEmail(
              loyalty.customerEmail
            )
          : null;

      const key =
        normalizedEmail
          ? `email:${normalizedEmail}`
          : customerKeyBySession.get(
              loyalty.sessionId
            );

      if (!key) {
        continue;
      }

      const customer =
        customers.get(
          key
        );

      if (!customer) {
        continue;
      }

      customer.loyaltyPoints +=
        loyalty.points ??
        0;

      if (
        loyalty.lastVisit &&
        loyalty.lastVisit >
          customer.lastVisit
      ) {
        customer.lastVisit =
          loyalty.lastVisit;
      }
    }

    /*
     * Quitamos Set interno y devolvemos
     * clientes ordenados por última visita.
     */

    return Array.from(
      customers.values()
    )
      .sort(
        (
          a,
          b
        ) =>
          b.lastVisit.getTime() -
          a.lastVisit.getTime()
      )
      .map(
        ({
          sessionIds:
            _sessionIds,
          ...customer
        }) =>
          customer
      );
  }
}