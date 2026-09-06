import {
  and,
  asc,
  eq,
  ne,
} from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

import { PasswordService } from "@/auth/password.service";

import type {
  CreateUserInput,
  UpdateUserInput,
} from "@/validations/user.validation";

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

export class UserService {
  static async list(
    establishmentId: number
  ) {
    return db
      .select({
        id: users.id,
        establishmentId:
          users.establishmentId,
        email: users.email,
        name: users.name,
        role: users.role,
        phone: users.phone,
        avatar: users.avatar,
        active: users.active,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(
        eq(
          users.establishmentId,
          establishmentId
        )
      )
      .orderBy(
        asc(users.name),
        asc(users.id)
      );
  }

  static async getById(
    id: number,
    establishmentId: number
  ) {
    const [user] = await db
      .select({
        id: users.id,
        establishmentId:
          users.establishmentId,
        email: users.email,
        name: users.name,
        role: users.role,
        phone: users.phone,
        avatar: users.avatar,
        active: users.active,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(
        and(
          eq(users.id, id),
          eq(
            users.establishmentId,
            establishmentId
          )
        )
      )
      .limit(1);

    if (!user) {
      throw new Error(
        "USER_NOT_FOUND"
      );
    }

    return user;
  }

  static async create(
    input: CreateUserInput,
    establishmentId: number,
    actorRole: UserRole
  ) {
    if (
      !canManageRole(
        actorRole,
        input.role
      )
    ) {
      throw new Error(
        "ROLE_NOT_ALLOWED"
      );
    }

    const [existingUser] =
      await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(
          eq(
            users.email,
            input.email
          )
        )
        .limit(1);

    if (existingUser) {
      throw new Error(
        "EMAIL_ALREADY_EXISTS"
      );
    }

    const hashedPassword =
      await PasswordService.hash(
        input.password
      );

    const [createdUser] =
      await db
        .insert(users)
        .values({
          establishmentId,
          email: input.email,
          password:
            hashedPassword,
          name: input.name,
          role: input.role,
          phone:
            input.phone ?? null,
          avatar:
            input.avatar ?? null,
          active:
            input.active ?? true,
          updatedAt:
            new Date(),
        })
        .returning({
          id: users.id,
          establishmentId:
            users.establishmentId,
          email: users.email,
          name: users.name,
          role: users.role,
          phone: users.phone,
          avatar: users.avatar,
          active: users.active,
          lastLogin:
            users.lastLogin,
          createdAt:
            users.createdAt,
          updatedAt:
            users.updatedAt,
        });

    return createdUser;
  }

  static async update(
    id: number,
    input: UpdateUserInput,
    establishmentId: number,
    actorUserId: number,
    actorRole: UserRole
  ) {
    const targetUser =
      await this.getById(
        id,
        establishmentId
      );

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

    if (
      input.role &&
      !canManageRole(
        actorRole,
        input.role
      )
    ) {
      throw new Error(
        "ROLE_NOT_ALLOWED"
      );
    }

    if (
      id === actorUserId &&
      input.active === false
    ) {
      throw new Error(
        "CANNOT_DEACTIVATE_SELF"
      );
    }

    if (
      input.email &&
      input.email !==
        targetUser.email
    ) {
      const [existingUser] =
        await db
          .select({
            id: users.id,
          })
          .from(users)
          .where(
            and(
              eq(
                users.email,
                input.email
              ),
              ne(users.id, id)
            )
          )
          .limit(1);

      if (existingUser) {
        throw new Error(
          "EMAIL_ALREADY_EXISTS"
        );
      }
    }

    const updateData: {
      email?: string;
      password?: string;
      name?: string;
      role?: UserRole;
      phone?: string | null;
      avatar?: string | null;
      active?: boolean;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (
      input.email !==
      undefined
    ) {
      updateData.email =
        input.email;
    }

    if (
      input.password !==
      undefined
    ) {
      updateData.password =
        await PasswordService.hash(
          input.password
        );
    }

    if (
      input.name !==
      undefined
    ) {
      updateData.name =
        input.name;
    }

    if (
      input.role !==
      undefined
    ) {
      updateData.role =
        input.role;
    }

    if (
      input.phone !==
      undefined
    ) {
      updateData.phone =
        input.phone;
    }

    if (
      input.avatar !==
      undefined
    ) {
      updateData.avatar =
        input.avatar;
    }

    if (
      input.active !==
      undefined
    ) {
      updateData.active =
        input.active;
    }

    const [updatedUser] =
      await db
        .update(users)
        .set(updateData)
        .where(
          and(
            eq(users.id, id),
            eq(
              users.establishmentId,
              establishmentId
            )
          )
        )
        .returning({
          id: users.id,
          establishmentId:
            users.establishmentId,
          email: users.email,
          name: users.name,
          role: users.role,
          phone: users.phone,
          avatar: users.avatar,
          active: users.active,
          lastLogin:
            users.lastLogin,
          createdAt:
            users.createdAt,
          updatedAt:
            users.updatedAt,
        });

    if (!updatedUser) {
      throw new Error(
        "USER_NOT_FOUND"
      );
    }

    return updatedUser;
  }

  static async remove(
    id: number,
    establishmentId: number,
    actorUserId: number,
    actorRole: UserRole
  ) {
    if (id === actorUserId) {
      throw new Error(
        "CANNOT_DELETE_SELF"
      );
    }

    const targetUser =
      await this.getById(
        id,
        establishmentId
      );

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

    const [deletedUser] =
      await db
        .delete(users)
        .where(
          and(
            eq(users.id, id),
            eq(
              users.establishmentId,
              establishmentId
            )
          )
        )
        .returning({
          id: users.id,
        });

    if (!deletedUser) {
      throw new Error(
        "USER_NOT_FOUND"
      );
    }

    return deletedUser;
  }
}