import type { JWTPayload } from "jose";

export interface JwtPayload extends JWTPayload {
  userId: number;
  establishmentId: number;
  role:
    | "admin"
    | "manager"
    | "waiter"
    | "kitchen"
    | "bar"
    | "cashier";
  email: string;
}

export interface AuthUser extends JwtPayload {
  iat?: number;
  exp?: number;
}