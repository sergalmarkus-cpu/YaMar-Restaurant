import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

import { JwtService } from "./jwt.service";
import { PasswordService } from "./password.service";

import type { JwtPayload } from "./auth.types";

export class AuthService {
  static async login(
    email: string,
    password: string
  ) {
    const normalizedEmail = email.trim().toLowerCase();

    const [user] = await db
      .select({
        id: users.id,
        establishmentId: users.establishmentId,
        email: users.email,
        password: users.password,
        name: users.name,
        role: users.role,
        active: users.active,
      })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    if (!user.active) {
      throw new Error("USER_INACTIVE");
    }

    const passwordValid = await PasswordService.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const payload: JwtPayload = {
      userId: user.id,
      establishmentId: user.establishmentId,
      role: user.role,
      email: user.email,
    };

    const [accessToken, refreshToken] =
      await Promise.all([
        JwtService.generateAccessToken(payload),
        JwtService.generateRefreshToken(payload),
      ]);

    await db
      .update(users)
      .set({
        lastLogin: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return {
      user: {
        id: user.id,
        establishmentId: user.establishmentId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}