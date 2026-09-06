import {
  and,
  eq,
} from "drizzle-orm";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  db,
} from "@/db";

import {
  tables,
} from "@/db/schema";

interface PageProps {
  params: Promise<{
    table: string;
  }>;
}

export default async function LegacyQrPage({
  params,
}: PageProps) {
  const {
    table,
  } =
    await params;

  const tableId =
    Number(
      table
    );

  /*
   * Esta ruta existe únicamente como compatibilidad
   * con enlaces antiguos basados en ID numérico.
   *
   * La experiencia QR canónica de YaMar utiliza:
   *
   *   /client/{qrCode}
   */
  if (
    !Number.isInteger(
      tableId
    ) ||
    tableId <=
      0
  ) {
    notFound();
  }

  const [
    existingTable,
  ] =
    await db
      .select({
        id:
          tables.id,

        qrCode:
          tables.qrCode,

        active:
          tables.active,
      })
      .from(
        tables
      )
      .where(
        and(
          eq(
            tables.id,
            tableId
          ),

          eq(
            tables.active,
            true
          )
        )
      )
      .limit(
        1
      );

  if (
    !existingTable ||
    !existingTable.qrCode
  ) {
    notFound();
  }

  redirect(
    `/client/${encodeURIComponent(
      existingTable.qrCode
    )}`
  );
}