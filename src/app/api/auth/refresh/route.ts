import { NextRequest, NextResponse } from "next/server";

import { JwtService } from "@/auth/jwt.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const refreshToken =
      typeof body.refreshToken === "string"
        ? body.refreshToken.trim()
        : "";

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Refresh token is required",
        },
        { status: 400 }
      );
    }

    const payload =
      await JwtService.verifyRefreshToken(refreshToken);

    const accessToken =
      await JwtService.generateAccessToken({
        userId: payload.userId,
        establishmentId: payload.establishmentId,
        role: payload.role,
        email: payload.email,
      });

    return NextResponse.json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    console.error(
      "Error refreshing access token:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Invalid or expired refresh token",
      },
      { status: 401 }
    );
  }
}