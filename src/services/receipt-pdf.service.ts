import {
  jsPDF,
} from "jspdf";

import {
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  establishments,
} from "@/db/schema";

type ReceiptPdfItem = {
  orderId?: number;
  orderNumber?: string;
  productId?: number;
  productName?: unknown;
  quantity?: number;
  unitPrice?: string;
  subtotal?: string;
  modifiers?: unknown;
  notes?: string | null;
};

type ReceiptPdfInput = {
  id: number;
  establishmentId: number;
  receiptNumber: string;
  total: string;
  items: unknown;
  createdAt: Date;
};

export class ReceiptPdfService {
  private static normalizeText(
    value: unknown
  ) {
    if (
      typeof value ===
      "string"
    ) {
      return value;
    }

    if (
      value ===
        null ||
      value ===
        undefined
    ) {
      return "";
    }

    try {
      return JSON.stringify(
        value
      );
    } catch {
      return String(
        value
      );
    }
  }

  private static normalizeItems(
    items: unknown
  ): ReceiptPdfItem[] {
    if (
      !Array.isArray(
        items
      )
    ) {
      return [];
    }

    return items.filter(
      (
        item
      ): item is ReceiptPdfItem =>
        typeof item ===
          "object" &&
        item !==
          null
    );
  }

  private static formatMoney(
    value: unknown,
    currency: string
  ) {
    const numberValue =
      Number(
        value
      );

    if (
      !Number.isFinite(
        numberValue
      )
    ) {
      return `0,00 ${currency}`;
    }

    return new Intl.NumberFormat(
      "es-ES",
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2,
      }
    ).format(
      numberValue
    ) +
      ` ${currency}`;
  }

  private static formatDate(
    value: Date,
    timezone: string
  ) {
    try {
      return new Intl.DateTimeFormat(
        "es-ES",
        {
          timeZone:
            timezone,

          year:
            "numeric",

          month:
            "2-digit",

          day:
            "2-digit",

          hour:
            "2-digit",

          minute:
            "2-digit",
        }
      ).format(
        value
      );
    } catch {
      return value.toISOString();
    }
  }

  private static sanitizeFilename(
    value: string
  ) {
    return value.replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );
  }

  static async generate(
    receipt: ReceiptPdfInput
  ) {
    const establishment =
      await db.query.establishments
        .findFirst({
          where:
            eq(
              establishments.id,
              receipt.establishmentId
            ),
        });

    if (
      !establishment
    ) {
      throw new Error(
        "El establecimiento no existe."
      );
    }

    const currency =
      establishment.currency ??
      "EUR";

    const timezone =
      establishment.timezone ??
      "Europe/Madrid";

    const items =
      this.normalizeItems(
        receipt.items
      );

    const doc =
      new jsPDF({
        orientation:
          "portrait",

        unit:
          "mm",

        format:
          "a4",
      });

    const pageWidth =
      doc.internal.pageSize
        .getWidth();

    const pageHeight =
      doc.internal.pageSize
        .getHeight();

    const marginLeft =
      18;

    const marginRight =
      18;

    const usableWidth =
      pageWidth -
      marginLeft -
      marginRight;

    const bottomMargin =
      20;

    let y =
      20;

    const ensureSpace = (
      requiredHeight: number
    ) => {
      if (
        y +
          requiredHeight <=
        pageHeight -
          bottomMargin
      ) {
        return;
      }

      doc.addPage();

      y =
        20;
    };

    /*
     * ==========================================================
     * CABECERA
     * ==========================================================
     */

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(
      18
    );

    doc.text(
      this.normalizeText(
        establishment.name
      ),
      marginLeft,
      y
    );

    y +=
      8;

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(
      10
    );

    const establishmentLines =
      [
        establishment.address,
        establishment.phone,
        establishment.email,
      ].filter(
        (
          value
        ) =>
          typeof value ===
            "string" &&
          value.trim()
            .length >
            0
      );

    for (
      const line
      of establishmentLines
    ) {
      doc.text(
        this.normalizeText(
          line
        ),
        marginLeft,
        y
      );

      y +=
        5;
    }

    y +=
      3;

    doc.setDrawColor(
      180
    );

    doc.line(
      marginLeft,
      y,
      pageWidth -
        marginRight,
      y
    );

    y +=
      8;

    /*
     * ==========================================================
     * DATOS DEL RECIBO
     * ==========================================================
     */

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(
      14
    );

    doc.text(
      "RECIBO",
      marginLeft,
      y
    );

    y +=
      7;

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(
      10
    );

    doc.text(
      `Número: ${receipt.receiptNumber}`,
      marginLeft,
      y
    );

    y +=
      5;

    doc.text(
      `Fecha: ${this.formatDate(
        receipt.createdAt,
        timezone
      )}`,
      marginLeft,
      y
    );

    y +=
      9;

    /*
     * ==========================================================
     * CABECERA DE ARTÍCULOS
     * ==========================================================
     */

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Artículo",
      marginLeft,
      y
    );

    doc.text(
      "Cant.",
      125,
      y,
      {
        align:
          "right",
      }
    );

    doc.text(
      "Precio",
      153,
      y,
      {
        align:
          "right",
      }
    );

    doc.text(
      "Subtotal",
      pageWidth -
        marginRight,
      y,
      {
        align:
          "right",
      }
    );

    y +=
      3;

    doc.line(
      marginLeft,
      y,
      pageWidth -
        marginRight,
      y
    );

    y +=
      6;

    /*
     * ==========================================================
     * ARTÍCULOS
     * ==========================================================
     */

    doc.setFont(
      "helvetica",
      "normal"
    );

    for (
      const item
      of items
    ) {
      ensureSpace(
        18
      );

      const productName =
        this.normalizeText(
          item.productName
        ) ||
        "Artículo";

      const quantity =
        Number(
          item.quantity ??
            0
        );

      const nameLines =
        doc.splitTextToSize(
          productName,
          90
        );

      doc.text(
        nameLines,
        marginLeft,
        y
      );

      doc.text(
        String(
          Number.isFinite(
            quantity
          )
            ? quantity
            : 0
        ),
        125,
        y,
        {
          align:
            "right",
        }
      );

      doc.text(
        this.formatMoney(
          item.unitPrice,
          currency
        ),
        153,
        y,
        {
          align:
            "right",
        }
      );

      doc.text(
        this.formatMoney(
          item.subtotal,
          currency
        ),
        pageWidth -
          marginRight,
        y,
        {
          align:
            "right",
        }
      );

      const nameHeight =
        Math.max(
          1,
          nameLines.length
        ) *
        5;

      y +=
        nameHeight;

      if (
        item.notes
      ) {
        const notes =
          doc.splitTextToSize(
            `Nota: ${item.notes}`,
            usableWidth -
              10
          );

        doc.setFontSize(
          8
        );

        doc.text(
          notes,
          marginLeft +
            4,
          y
        );

        y +=
          notes.length *
          4;

        doc.setFontSize(
          10
        );
      }

      y +=
        4;
    }

    /*
     * ==========================================================
     * TOTAL
     * ==========================================================
     */

    ensureSpace(
      25
    );

    y +=
      2;

    doc.line(
      115,
      y,
      pageWidth -
        marginRight,
      y
    );

    y +=
      8;

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(
      13
    );

    doc.text(
      "TOTAL",
      140,
      y,
      {
        align:
          "right",
      }
    );

    doc.text(
      this.formatMoney(
        receipt.total,
        currency
      ),
      pageWidth -
        marginRight,
      y,
      {
        align:
          "right",
      }
    );

    /*
     * ==========================================================
     * PIE
     * ==========================================================
     */

    ensureSpace(
      25
    );

    y +=
      18;

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(
      9
    );

    doc.text(
      "Gracias por su visita.",
      pageWidth /
        2,
      y,
      {
        align:
          "center",
      }
    );

    y +=
      5;

    doc.text(
      "Recibo generado electrónicamente por YaMar.",
      pageWidth /
        2,
      y,
      {
        align:
          "center",
      }
    );

    const arrayBuffer =
      doc.output(
        "arraybuffer"
      );

    const bytes =
      new Uint8Array(
        arrayBuffer
      );

    if (
      bytes.length <
      5
    ) {
      throw new Error(
        "El PDF generado está vacío."
      );
    }

    const signature =
      String.fromCharCode(
        ...bytes.slice(
          0,
          5
        )
      );

    if (
      signature !==
      "%PDF-"
    ) {
      throw new Error(
        "El documento generado no es un PDF válido."
      );
    }

    const filename =
      `${this.sanitizeFilename(
        receipt.receiptNumber
      )}.pdf`;

    return {
      bytes,
      filename,
    };
  }
}