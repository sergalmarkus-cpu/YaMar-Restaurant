import { SignJWT, jwtVerify } from 'jose';

import { env } from '@/config/env';

import type { JwtPayload } from './auth.types';

const encoder = new TextEncoder();

const accessSecret = encoder.encode(env.JWT_SECRET);
const refreshSecret = encoder.encode(
  env.JWT_REFRESH_SECRET
);

export class JwtService {
  static async generateAccessToken(
    payload: JwtPayload
  ) {
    return await new SignJWT(payload)
      .setProtectedHeader({
        alg: 'HS256',
      })
      .setIssuedAt()
      .setExpirationTime(env.JWT_EXPIRES_IN)
      .sign(accessSecret);
  }

  static async generateRefreshToken(
    payload: JwtPayload
  ) {
    return await new SignJWT(payload)
      .setProtectedHeader({
        alg: 'HS256',
      })
      .setIssuedAt()
      .setExpirationTime(
        env.JWT_REFRESH_EXPIRES_IN
      )
      .sign(refreshSecret);
  }

  static async verifyAccessToken(
    token: string
  ) {
    const { payload } = await jwtVerify(
      token,
      accessSecret
    );

    return payload as JwtPayload;
  }

  static async verifyRefreshToken(
    token: string
  ) {
    const { payload } = await jwtVerify(
      token,
      refreshSecret
    );

    return payload as JwtPayload;
  }
}