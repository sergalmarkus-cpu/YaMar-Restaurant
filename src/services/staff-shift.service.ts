import {
  and,
  asc,
  eq,
  gt,
  lt,
  ne,
} from "drizzle-orm";

import { db } from "@/db";

import {
  staffShifts,
  users,
} from "@/db/schema";

import type {
  CreateStaffShiftInput,
  StaffShiftStatus,
  UpdateStaffShiftInput,
} from "@/validations/staff-shift.validation";

type UserRole =
  | "admin"
  | "manager"
  | "waiter"
  | "kitchen"
  | "bar"
  | "cashier";

const MANAGER_ALLOWED_ROLES: UserRole[] = [
  "waiter",
  "kitchen",
  "bar",
  "cashier",
];

function canManageRole(
  actorRole: UserRole,
  targetRole: UserRole
) {
  if (actorRole === "admin") {
    return true;
  }

  if (actorRole === "manager") {
    return MANAGER_ALLOWED_ROLES.includes(
      targetRole
    );
  }

  return false;
}

export class StaffShiftService {
  /*
   * ==========================================================
   * VALIDAR ACTOR ADMINISTRATIVO
   * ==========================================================
   */

  private static async validateActor(
    actorUserId: number,
    establishmentId: number,
    actorRole: UserRole
  ) {
    if (
      actorRole !== "admin" &&
      actorRole !== "manager"
    ) {
      throw new Error(
        "FORBIDDEN"
      );
    }

    const [actor] =
      await db
        .select({
          id: users.id,
          establishmentId:
            users.establishmentId,
          role: users.role,
          active: users.active,
        })
        .from(users)
        .where(
          eq(
            users.id,
            actorUserId
          )
        )
        .limit(1);

    if (!actor) {
      throw new Error(
        "USER_NOT_FOUND"
      );
    }

    if (!actor.active) {
      throw new Error(
        "USER_INACTIVE"
      );
    }

    if (
      actor.establishmentId !==
      establishmentId
    ) {
      throw new Error(
        "ESTABLISHMENT_ACCESS_DENIED"
      );
    }

    if (
      actor.role !==
      actorRole
    ) {
      throw new Error(
        "ROLE_MISMATCH"
      );
    }

    return actor;
  }

  /*
   * ==========================================================
   * VALIDAR EMPLEADO DEL TURNO
   * ==========================================================
   */

  private static async validateTargetUser(
    userId: number,
    establishmentId: number,
    actorRole: UserRole
  ) {
    const [targetUser] =
      await db
        .select({
          id: users.id,
          establishmentId:
            users.establishmentId,
          name: users.name,
          email: users.email,
          role: users.role,
          active: users.active,
        })
        .from(users)
        .where(
          and(
            eq(
              users.id,
              userId
            ),
            eq(
              users.establishmentId,
              establishmentId
            )
          )
        )
        .limit(1);

    if (!targetUser) {
      throw new Error(
        "SHIFT_USER_NOT_FOUND"
      );
    }

    if (!targetUser.active) {
      throw new Error(
        "SHIFT_USER_INACTIVE"
      );
    }

    if (
      !canManageRole(
        actorRole,
        targetUser.role
      )
    ) {
      throw new Error(
        "ROLE_NOT_ALLOWED"
      );
    }

    return targetUser;
  }

  /*
   * ==========================================================
   * VALIDAR INTERVALO
   * ==========================================================
   */

  private static validateDateRange(
    startAt: Date,
    endAt: Date
  ) {
    if (
      endAt <= startAt
    ) {
      throw new Error(
        "SHIFT_INVALID_DATE_RANGE"
      );
    }
  }

  /*
   * ==========================================================
   * DETECTAR SOLAPAMIENTO
   *
   * Dos intervalos se solapan cuando:
   *
   * existing.startAt < newEnd
   * &&
   * existing.endAt > newStart
   *
   * Un turno que termina exactamente cuando empieza otro
   * NO se considera solapado.
   * ==========================================================
   */

  private static async validateNoOverlap(
    establishmentId: number,
    userId: number,
    startAt: Date,
    endAt: Date,
    excludeShiftId?: number
  ) {
    const conditions = [
      eq(
        staffShifts.establishmentId,
        establishmentId
      ),

      eq(
        staffShifts.userId,
        userId
      ),

      ne(
        staffShifts.status,
        "cancelled"
      ),

      lt(
        staffShifts.startAt,
        endAt
      ),

      gt(
        staffShifts.endAt,
        startAt
      ),
    ];

    if (
      excludeShiftId !==
      undefined
    ) {
      conditions.push(
        ne(
          staffShifts.id,
          excludeShiftId
        )
      );
    }

    const [overlap] =
      await db
        .select({
          id: staffShifts.id,
        })
        .from(staffShifts)
        .where(
          and(
            ...conditions
          )
        )
        .limit(1);

    if (overlap) {
      throw new Error(
        "SHIFT_OVERLAP"
      );
    }
  }

  /*
   * ==========================================================
   * LISTAR TURNOS DEL ESTABLECIMIENTO
   * ==========================================================
   */

  static async list(
    establishmentId: number,
    actorUserId: number,
    actorRole: UserRole
  ) {
    await this.validateActor(
      actorUserId,
      establishmentId,
      actorRole
    );

    return db
      .select({
        id: staffShifts.id,

        establishmentId:
          staffShifts.establishmentId,

        userId:
          staffShifts.userId,

        userName:
          users.name,

        userEmail:
          users.email,

        userRole:
          users.role,

        startAt:
          staffShifts.startAt,

        endAt:
          staffShifts.endAt,

        status:
          staffShifts.status,

        notes:
          staffShifts.notes,

        createdBy:
          staffShifts.createdBy,

        createdAt:
          staffShifts.createdAt,

        updatedAt:
          staffShifts.updatedAt,
      })
      .from(staffShifts)
      .innerJoin(
        users,
        eq(
          staffShifts.userId,
          users.id
        )
      )
      .where(
        eq(
          staffShifts.establishmentId,
          establishmentId
        )
      )
      .orderBy(
        asc(
          staffShifts.startAt
        ),
        asc(
          staffShifts.id
        )
      );
  }

  /*
   * ==========================================================
   * OBTENER TURNO POR ID + TENANT
   * ==========================================================
   */

  static async getById(
    id: number,
    establishmentId: number
  ) {
    const [shift] =
      await db
        .select({
          id: staffShifts.id,

          establishmentId:
            staffShifts.establishmentId,

          userId:
            staffShifts.userId,

          userName:
            users.name,

          userEmail:
            users.email,

          userRole:
            users.role,

          startAt:
            staffShifts.startAt,

          endAt:
            staffShifts.endAt,

          status:
            staffShifts.status,

          notes:
            staffShifts.notes,

          createdBy:
            staffShifts.createdBy,

          createdAt:
            staffShifts.createdAt,

          updatedAt:
            staffShifts.updatedAt,
        })
        .from(staffShifts)
        .innerJoin(
          users,
          eq(
            staffShifts.userId,
            users.id
          )
        )
        .where(
          and(
            eq(
              staffShifts.id,
              id
            ),
            eq(
              staffShifts.establishmentId,
              establishmentId
            )
          )
        )
        .limit(1);

    if (!shift) {
      throw new Error(
        "SHIFT_NOT_FOUND"
      );
    }

    return shift;
  }

  /*
   * ==========================================================
   * CREAR TURNO
   * ==========================================================
   */

  static async create(
    input: CreateStaffShiftInput,
    establishmentId: number,
    actorUserId: number,
    actorRole: UserRole
  ) {
    await this.validateActor(
      actorUserId,
      establishmentId,
      actorRole
    );

    await this.validateTargetUser(
      input.userId,
      establishmentId,
      actorRole
    );

    this.validateDateRange(
      input.startAt,
      input.endAt
    );

    if (
      input.status !==
      "cancelled"
    ) {
      await this.validateNoOverlap(
        establishmentId,
        input.userId,
        input.startAt,
        input.endAt
      );
    }

    const [createdShift] =
      await db
        .insert(staffShifts)
        .values({
          establishmentId,

          userId:
            input.userId,

          startAt:
            input.startAt,

          endAt:
            input.endAt,

          status:
            input.status,

          notes:
            input.notes ??
            null,

          createdBy:
            actorUserId,

          updatedAt:
            new Date(),
        })
        .returning();

    if (!createdShift) {
      throw new Error(
        "SHIFT_CREATE_FAILED"
      );
    }

    return this.getById(
      createdShift.id,
      establishmentId
    );
  }

  /*
   * ==========================================================
   * ACTUALIZAR TURNO
   * ==========================================================
   */

  static async update(
    id: number,
    input: UpdateStaffShiftInput,
    establishmentId: number,
    actorUserId: number,
    actorRole: UserRole
  ) {
    await this.validateActor(
      actorUserId,
      establishmentId,
      actorRole
    );

    const existing =
      await this.getById(
        id,
        establishmentId
      );

    const nextUserId =
      input.userId ??
      existing.userId;

    const nextStartAt =
      input.startAt ??
      existing.startAt;

    const nextEndAt =
      input.endAt ??
      existing.endAt;

    const nextStatus: StaffShiftStatus =
      input.status ??
      existing.status;

    await this.validateTargetUser(
      nextUserId,
      establishmentId,
      actorRole
    );

    this.validateDateRange(
      nextStartAt,
      nextEndAt
    );

    if (
      nextStatus !==
      "cancelled"
    ) {
      await this.validateNoOverlap(
        establishmentId,
        nextUserId,
        nextStartAt,
        nextEndAt,
        id
      );
    }

    const updateData: {
      userId?: number;
      startAt?: Date;
      endAt?: Date;
      status?: StaffShiftStatus;
      notes?: string | null;
      updatedAt: Date;
    } = {
      updatedAt:
        new Date(),
    };

    if (
      input.userId !==
      undefined
    ) {
      updateData.userId =
        input.userId;
    }

    if (
      input.startAt !==
      undefined
    ) {
      updateData.startAt =
        input.startAt;
    }

    if (
      input.endAt !==
      undefined
    ) {
      updateData.endAt =
        input.endAt;
    }

    if (
      input.status !==
      undefined
    ) {
      updateData.status =
        input.status;
    }

    if (
      input.notes !==
      undefined
    ) {
      updateData.notes =
        input.notes;
    }

    const [updatedShift] =
      await db
        .update(staffShifts)
        .set(updateData)
        .where(
          and(
            eq(
              staffShifts.id,
              id
            ),
            eq(
              staffShifts.establishmentId,
              establishmentId
            )
          )
        )
        .returning();

    if (!updatedShift) {
      throw new Error(
        "SHIFT_NOT_FOUND"
      );
    }

    return this.getById(
      updatedShift.id,
      establishmentId
    );
  }

  /*
   * ==========================================================
   * ELIMINAR TURNO
   * ==========================================================
   */

  static async remove(
    id: number,
    establishmentId: number,
    actorUserId: number,
    actorRole: UserRole
  ) {
    await this.validateActor(
      actorUserId,
      establishmentId,
      actorRole
    );

    const existing =
      await this.getById(
        id,
        establishmentId
      );

    await this.validateTargetUser(
      existing.userId,
      establishmentId,
      actorRole
    );

    const [deletedShift] =
      await db
        .delete(staffShifts)
        .where(
          and(
            eq(
              staffShifts.id,
              id
            ),
            eq(
              staffShifts.establishmentId,
              establishmentId
            )
          )
        )
        .returning({
          id: staffShifts.id,
        });

    if (!deletedShift) {
      throw new Error(
        "SHIFT_NOT_FOUND"
      );
    }

    return deletedShift;
  }
}