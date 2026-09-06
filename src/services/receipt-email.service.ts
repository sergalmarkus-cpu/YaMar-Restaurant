import {
  and,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  receipts,
  sessions,
} from "@/db/schema";

import {
  EmailService,
} from "./email.service";

import {
  Logger,
} from "./logger.service";

export class ReceiptEmailService {
  private static escapeHtml(
    value: unknown
  ) {
    return String(
      value ?? ""
    )
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }

  private static getProductName(
    productName: unknown
  ) {
    if (
      typeof productName ===
      "string"
    ) {
      return productName;
    }

    if (
      productName &&
      typeof productName ===
        "object"
    ) {
      const names =
        productName as Record<
          string,
          unknown
        >;

      const preferred =
        names.es ??
        names.en ??
        names.fr;

      if (
        typeof preferred ===
        "string"
      ) {
        return preferred;
      }

      const first =
        Object.values(
          names
        ).find(
          (
            value
          ) =>
            typeof value ===
            "string"
        );

      if (
        typeof first ===
        "string"
      ) {
        return first;
      }
    }

    return "Producto";
  }

  static async sendForReceipt(
    receiptId: number,
    establishmentId: number
  ) {
    const rows =
      await db
        .select({
          receipt:
            receipts,

          customerEmail:
            sessions.customerEmail,

          customerName:
            sessions.customerName,
        })
        .from(
          receipts
        )
        .innerJoin(
          sessions,
          eq(
            sessions.id,
            receipts.sessionId
          )
        )
        .where(
          and(
            eq(
              receipts.id,
              receiptId
            ),

            eq(
              receipts.establishmentId,
              establishmentId
            )
          )
        )
        .limit(
          1
        );

    const row =
      rows[0];

    if (!row) {
      throw new Error(
        "RECEIPT_NOT_FOUND"
      );
    }

    if (
      row.receipt.emailSent
    ) {
      return {
        sent:
          false,

        alreadySent:
          true,

        skipped:
          false,

        reason:
          null,
      };
    }

    const customerEmail =
      row.customerEmail
        ?.trim();

    if (!customerEmail) {
      Logger.info(
        "Recibo sin email de cliente",
        {
          receiptId,
          establishmentId,
        }
      );

      return {
        sent:
          false,

        alreadySent:
          false,

        skipped:
          true,

        reason:
          "CUSTOMER_EMAIL_MISSING",
      };
    }

    if (
      !EmailService.isConfigured()
    ) {
      Logger.info(
        "Email de recibo omitido: Resend no configurado",
        {
          receiptId,
          establishmentId,
        }
      );

      return {
        sent:
          false,

        alreadySent:
          false,

        skipped:
          true,

        reason:
          "EMAIL_NOT_CONFIGURED",
      };
    }

    const rawItems =
      Array.isArray(
        row.receipt.items
      )
        ? row.receipt.items
        : [];

    const itemRows =
      rawItems
        .map(
          (
            rawItem
          ) => {
            const item =
              rawItem as Record<
                string,
                unknown
              >;

            const name =
              this.getProductName(
                item.productName
              );

            const quantity =
              Number(
                item.quantity ??
                  0
              );

            const subtotal =
              Number(
                item.subtotal ??
                  0
              );

            return `
              <tr>
                <td style="padding:8px;border-bottom:1px solid #eee;">
                  ${this.escapeHtml(
                    name
                  )}
                </td>

                <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">
                  ${this.escapeHtml(
                    quantity
                  )}
                </td>

                <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">
                  ${subtotal.toFixed(
                    2
                  )} €
                </td>
              </tr>
            `;
          }
        )
        .join(
          ""
        );

    const customerName =
      row.customerName
        ?.trim();

    const greeting =
      customerName
        ? `Hola ${this.escapeHtml(
            customerName
          )},`
        : "Hola,";

    const html =
      `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;line-height:1.6;color:#222;">
          <h2>Tu recibo de YaMar</h2>

          <p>
            ${greeting}
          </p>

          <p>
            Gracias por tu visita. Este es el resumen de tu cuenta.
          </p>

          <p>
            <strong>Recibo:</strong>
            ${this.escapeHtml(
              row.receipt.receiptNumber
            )}
          </p>

          <table style="width:100%;border-collapse:collapse;margin-top:20px;">
            <thead>
              <tr>
                <th style="padding:8px;text-align:left;border-bottom:2px solid #ddd;">
                  Producto
                </th>

                <th style="padding:8px;text-align:center;border-bottom:2px solid #ddd;">
                  Cantidad
                </th>

                <th style="padding:8px;text-align:right;border-bottom:2px solid #ddd;">
                  Importe
                </th>
              </tr>
            </thead>

            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <p style="font-size:18px;text-align:right;margin-top:20px;">
            <strong>
              Total:
              ${Number(
                row.receipt.total
              ).toFixed(
                2
              )} €
            </strong>
          </p>

          <p>
            Gracias por utilizar YaMar.
          </p>
        </div>
      `;

    const result =
      await EmailService.send({
        to:
          customerEmail,

        subject:
          `Tu recibo YaMar ${row.receipt.receiptNumber}`,

        html,

        text:
          `Tu recibo YaMar ${row.receipt.receiptNumber}. Total: ${Number(
            row.receipt.total
          ).toFixed(
            2
          )} €.`,

        idempotencyKey:
          `yamar-receipt-${row.receipt.id}`,
      });

    if (!result.id) {
      throw new Error(
        "RECEIPT_EMAIL_ID_MISSING"
      );
    }

    const updated =
      await db
        .update(
          receipts
        )
        .set({
          emailSent:
            true,
        })
        .where(
          and(
            eq(
              receipts.id,
              receiptId
            ),

            eq(
              receipts.establishmentId,
              establishmentId
            ),

            eq(
              receipts.emailSent,
              false
            )
          )
        )
        .returning();

    Logger.info(
      "Recibo enviado por email",
      {
        receiptId,
        establishmentId,
        emailId:
          result.id,
      }
    );

    return {
      sent:
        true,

      alreadySent:
        false,

      skipped:
        false,

      reason:
        null,

      emailId:
        result.id,

      receipt:
        updated[0] ??
        row.receipt,
    };
  }
}