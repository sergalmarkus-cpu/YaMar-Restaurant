import { randomBytes } from "crypto";

import { and, eq, ne } from "drizzle-orm";

import { db } from "@/db";

import {
  tables,
  establishments,
  areas,
  sessions,
} from "@/db/schema";

import {
  TableInput,
  UpdateTableInput,
} from "@/validations/table.validation";

export class TableService {
  static async list(
    establishmentId: number,
    areaId?: number
  ) {
    const conditions = [
      eq(
        tables.establishmentId,
        establishmentId
      ),
    ];

    if (areaId !== undefined) {
      conditions.push(
        eq(tables.areaId, areaId)
      );
    }

    return db
      .select()
      .from(tables)
      .where(and(...conditions));
  }

  static async getById(
    id: number,
    establishmentId: number
  ) {
    return db.query.tables.findFirst({
      where: and(
        eq(tables.id, id),
        eq(
          tables.establishmentId,
          establishmentId
        )
      ),
    });
  }

  private static async validateEstablishment(
    establishmentId: number
  ) {
    const establishment =
      await db.query.establishments.findFirst({
        where: eq(
          establishments.id,
          establishmentId
        ),
      });

    if (!establishment) {
      throw new Error(
        "El establecimiento no existe."
      );
    }

    if (!establishment.active) {
      throw new Error(
        "El establecimiento no está activo."
      );
    }

    return establishment;
  }

  private static async validateArea(
    areaId: number | null | undefined,
    establishmentId: number
  ) {
    if (
      areaId === undefined ||
      areaId === null
    ) {
      return null;
    }

    const area =
      await db.query.areas.findFirst({
        where: eq(
          areas.id,
          areaId
        ),
      });

    if (!area) {
      throw new Error(
        "La zona no existe."
      );
    }

    if (
      area.establishmentId !==
      establishmentId
    ) {
      throw new Error(
        "La zona no pertenece al establecimiento indicado."
      );
    }

    if (!area.active) {
      throw new Error(
        "La zona no está activa."
      );
    }

    return area;
  }

  private static async validateCode(
    code: string,
    establishmentId: number,
    excludeId?: number
  ) {
    const conditions = [
      eq(
        tables.establishmentId,
        establishmentId
      ),
      eq(
        tables.code,
        code
      ),
    ];

    if (excludeId !== undefined) {
      conditions.push(
        ne(
          tables.id,
          excludeId
        )
      );
    }

    const existing =
      await db.query.tables.findFirst({
        where: and(...conditions),
      });

    if (existing) {
      throw new Error(
        "Ya existe una mesa con ese código en este establecimiento."
      );
    }
  }

  static async create(
    establishmentId: number,
    data: TableInput
  ) {
    await this.validateEstablishment(
      establishmentId
    );

    await this.validateArea(
      data.areaId,
      establishmentId
    );

    await this.validateCode(
      data.code,
      establishmentId
    );

    const qrCode =
      randomBytes(16).toString("hex");

    const inserted =
      await db
        .insert(tables)
        .values({
          ...data,
          establishmentId,
          qrCode,
          status: "available",
        })
        .returning();

    return inserted[0];
  }

  static async update(
    id: number,
    establishmentId: number,
    data: UpdateTableInput
  ) {
    const existing =
      await this.getById(
        id,
        establishmentId
      );

    if (!existing) {
      return null;
    }

    const areaId =
      data.areaId !== undefined
        ? data.areaId
        : existing.areaId;

    const code =
      data.code ?? existing.code;

    await this.validateEstablishment(
      establishmentId
    );

    await this.validateArea(
      areaId,
      establishmentId
    );

    await this.validateCode(
      code,
      establishmentId,
      id
    );

    const updated =
      await db
        .update(tables)
        .set({
          ...data,
          establishmentId,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(tables.id, id),
            eq(
              tables.establishmentId,
              establishmentId
            )
          )
        )
        .returning();

    return (
      updated[0] ??
      null
    );
  }

  static async delete(
    id: number,
    establishmentId: number
  ) {
    const existing =
      await this.getById(
        id,
        establishmentId
      );

    if (!existing) {
      return null;
    }

    const activeSession =
      await db.query.sessions.findFirst({
        where: and(
          eq(
            sessions.tableId,
            id
          ),
          eq(
            sessions.active,
            true
          )
        ),
      });

    if (activeSession) {
      throw new Error(
        "No se puede eliminar una mesa que tiene una sesión activa."
      );
    }

    await db
      .delete(tables)
      .where(
        and(
          eq(tables.id, id),
          eq(
            tables.establishmentId,
            establishmentId
          )
        )
      );

    return existing;
  }
}