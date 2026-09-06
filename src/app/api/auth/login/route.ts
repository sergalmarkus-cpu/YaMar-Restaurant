import { NextRequest, NextResponse } from "next/server";

import { AuthService } from "@/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const result = await AuthService.login(
      email,
      password
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error during login:", error);

    if (error instanceof Error) {
      switch (error.message) {
        case "INVALID_CREDENTIALS":
          return NextResponse.json(
            {
              success: false,
              error: "Invalid email or password",
            },
            { status: 401 }
          );

        case "USER_INACTIVE":
          return NextResponse.json(
            {
              success: false,
              error: "User account is inactive",
            },
            { status: 403 }
          );

        default:
          break;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}