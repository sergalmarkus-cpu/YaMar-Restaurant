import { NextRequest } from "next/server";
import { JWTExpired } from "jose/errors";

import { JwtService } from "./jwt.service";
import type { JwtPayload } from "./auth.types";

export class ApiAuthError extends Error {
  constructor(
    message:
      | "AUTH_HEADER_MISSING"
      | "AUTH_HEADER_INVALID"
      | "TOKEN_INVALID"
      | "TOKEN_EXPIRED"
  ) {
    super(message);
    this.name = "ApiAuthError";
  }
}

function extractBearerToken(
  request: NextRequest
): string {
  const authorization =
    request.headers.get("authorization");

  if (!authorization) {
    throw new ApiAuthError(
      "AUTH_HEADER_MISSING"
    );
  }

  const parts =
    authorization.trim().split(/\s+/);

  if (
    parts.length !== 2 ||
    parts[0]?.toLowerCase() !== "bearer" ||
    !parts[1]
  ) {
    throw new ApiAuthError(
      "AUTH_HEADER_INVALID"
    );
  }

  return parts[1];
}

export async function authenticateRequest(
  request: NextRequest
): Promise<JwtPayload> {
  const token =
    extractBearerToken(request);

  try {
    return await JwtService.verifyAccessToken(
      token
    );
  } catch (error) {
    if (
      error instanceof JWTExpired ||
      (
        error instanceof Error &&
        "code" in error &&
        error.code === "ERR_JWT_EXPIRED"
      )
    ) {
      throw new ApiAuthError(
        "TOKEN_EXPIRED"
      );
    }

    throw new ApiAuthError(
      "TOKEN_INVALID"
    );
  }
}