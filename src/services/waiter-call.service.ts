import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  establishments,
  notifications,
  sessions,
  tables,
  users,
  waiterCalls,
} from "@/db/schema";

import type {
  CreateWaiterCallInput,
  UpdateWaiterCallInput,
} from "@/validations/waiter-call.validation";

const VALID_ROLES = [
  "admin",
  "manager",
  "waiter",
] as const;

export class WaiterCallService {
  static async create(input: CreateWaiterCallInput) {
    const [session] = await db
      .select({
        id: sessions.id,
        tableId: sessions.tableId,
        establishmentId: sessions.establishmentId,
        latitude: sessions.latitude,
        longitude: sessions.longitude,
        active: sessions.active,
        tableEstablishmentId: tables.establishmentId,
        tableActive: tables.active,
        establishmentActive: establishments.active,
      })
      .from(sessions)
      .innerJoin(tables, eq(tables.id, sessions.tableId))
      .innerJoin(
        establishments,
        eq(establishments.id, sessions.establishmentId)
      )
      .where(eq(sessions.id, input.sessionId))
      .limit(1);

    if (!session) {
      throw new Error("SESSION_NOT_FOUND");
    }

    if (!session.active) {
      throw new Error("SESSION_INACTIVE");
    }

    if (!session.tableActive) {
      throw new Error("TABLE_INACTIVE");
    }

    if (!session.establishmentActive) {
      throw new Error("ESTABLISHMENT_INACTIVE");
    }

    if (session.tableEstablishmentId !== session.establishmentId) {
      throw new Error("SESSION_TABLE_ESTABLISHMENT_MISMATCH");
    }

    return await db.transaction(async (tx) => {
      const [call] = await tx
        .insert(waiterCalls)
        .values({
          sessionId: session.id,
          tableId: session.tableId,
          establishmentId: session.establishmentId,
          type: input.type,
          message: input.message,
          latitude: input.latitude ?? session.latitude,
          longitude: input.longitude ?? session.longitude,
          status: "pending",
        })
        .returning();

      await tx
        .insert(notifications)
        .values({
          establishmentId: session.establishmentId,
          userId: null,
          type: "waiter_call",
          title: "Llamada de mesa",
          message: `La mesa ${session.tableId} solicita atención: ${input.type}.`,
          data: {
            waiterCallId: call.id,
            sessionId: call.sessionId,
            tableId: call.tableId,
            callType: call.type,
            message: call.message,
            status: call.status,
          },
          read: false,
        });

      return call;
    });
  }

  static async getBySession(sessionId: string) {
    return await db
      .select()
      .from(waiterCalls)
      .where(eq(waiterCalls.sessionId, sessionId))
      .orderBy(desc(waiterCalls.createdAt));
  }

  static async getById(
    id: number,
    establishmentId: number
  ) {
    const [call] = await db
      .select()
      .from(waiterCalls)
      .where(
        and(
          eq(waiterCalls.id, id),
          eq(
            waiterCalls.establishmentId,
            establishmentId
          )
        )
      )
      .limit(1);

    if (!call) {
      throw new Error("WAITER_CALL_NOT_FOUND");
    }

    return call;
  }

  static async getByEstablishment(
    establishmentId: number,
    status?: "pending" | "acknowledged" | "resolved"
  ) {
    const conditions = [
      eq(
        waiterCalls.establishmentId,
        establishmentId
      ),
    ];

    if (status) {
      conditions.push(
        eq(waiterCalls.status, status)
      );
    }

    return await db
      .select()
      .from(waiterCalls)
      .where(and(...conditions))
      .orderBy(desc(waiterCalls.createdAt));
  }

  static async updateStatus(
    id: number,
    input: UpdateWaiterCallInput,
    userId: number,
    establishmentId: number,
    userRole: string
  ) {
    if (
      !VALID_ROLES.includes(
        userRole as (typeof VALID_ROLES)[number]
      )
    ) {
      throw new Error("FORBIDDEN");
    }

    const [user] = await db
      .select({
        id: users.id,
        establishmentId: users.establishmentId,
        role: users.role,
        active: users.active,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.active) {
      throw new Error("USER_INACTIVE");
    }

    if (user.establishmentId !== establishmentId) {
      throw new Error("ESTABLISHMENT_ACCESS_DENIED");
    }

    if (user.role !== userRole) {
      throw new Error("ROLE_MISMATCH");
    }

    const [call] = await db
      .select()
      .from(waiterCalls)
      .where(
        and(
          eq(waiterCalls.id, id),
          eq(
            waiterCalls.establishmentId,
            establishmentId
          )
        )
      )
      .limit(1);

    if (!call) {
      throw new Error("WAITER_CALL_NOT_FOUND");
    }

    if (call.status === "resolved") {
      throw new Error(
        "WAITER_CALL_ALREADY_RESOLVED"
      );
    }

    if (
      input.status === "acknowledged" &&
      call.status !== "pending"
    ) {
      throw new Error(
        "INVALID_STATUS_TRANSITION"
      );
    }

    if (
      input.status === "resolved" &&
      call.status !== "pending" &&
      call.status !== "acknowledged"
    ) {
      throw new Error(
        "INVALID_STATUS_TRANSITION"
      );
    }

    const now = new Date();

    const updateData: {
      status: "acknowledged" | "resolved";
      acknowledgedBy?: number;
      acknowledgedAt?: Date;
      resolvedBy?: number;
      resolvedAt?: Date;
    } = {
      status: input.status,
    };

    if (input.status === "acknowledged") {
      updateData.acknowledgedBy = userId;
      updateData.acknowledgedAt = now;
    }

    if (input.status === "resolved") {
      updateData.resolvedBy = userId;
      updateData.resolvedAt = now;

      if (call.status === "pending") {
        updateData.acknowledgedBy = userId;
        updateData.acknowledgedAt = now;
      }
    }

    const [updatedCall] = await db
      .update(waiterCalls)
      .set(updateData)
      .where(
        and(
          eq(waiterCalls.id, id),
          eq(
            waiterCalls.establishmentId,
            establishmentId
          )
        )
      )
      .returning();

    return updatedCall;
  }
}