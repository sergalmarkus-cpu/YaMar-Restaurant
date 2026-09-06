import { NextRequest, NextResponse } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import { createWaiterCallSchema } from "@/validations/waiter-call.validation";
import { WaiterCallService } from "@/services/waiter-call.service";

function handleAuthError(error: unknown) {
  if (!(error instanceof ApiAuthError)) {
    return null;
  }

  switch (error.message) {
    case "AUTH_HEADER_MISSING":
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );

    case "AUTH_HEADER_INVALID":
      return NextResponse.json(
        {
          success: false,
          error: "Invalid authorization header",
        },
        { status: 401 }
      );

    case "TOKEN_EXPIRED":
      return NextResponse.json(
        {
          success: false,
          error: "Authentication token expired",
        },
        { status: 401 }
      );

    case "TOKEN_INVALID":
      return NextResponse.json(
        {
          success: false,
          error: "Invalid authentication token",
        },
        { status: 401 }
      );

    default:
      return NextResponse.json(
        {
          success: false,
          error: "Authentication failed",
        },
        { status: 401 }
      );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation =
      createWaiterCallSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid waiter call data",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const call = await WaiterCallService.create(
      validation.data
    );

    return NextResponse.json(
      {
        success: true,
        data: call,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Error creating waiter call:",
      error
    );

    if (error instanceof Error) {
      switch (error.message) {
        case "SESSION_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              error: "Session not found",
            },
            { status: 404 }
          );

        case "SESSION_INACTIVE":
          return NextResponse.json(
            {
              success: false,
              error: "Session is inactive",
            },
            { status: 400 }
          );

        case "TABLE_INACTIVE":
          return NextResponse.json(
            {
              success: false,
              error: "Table is inactive",
            },
            { status: 400 }
          );

        case "ESTABLISHMENT_INACTIVE":
          return NextResponse.json(
            {
              success: false,
              error: "Establishment is inactive",
            },
            { status: 400 }
          );

        case "SESSION_TABLE_ESTABLISHMENT_MISMATCH":
          return NextResponse.json(
            {
              success: false,
              error:
                "Session and table do not belong to the same establishment",
            },
            { status: 400 }
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

export async function GET(request: NextRequest) {
  try {
    const authUser = await authenticateRequest(
      request
    );

    const { searchParams } = new URL(request.url);

    const sessionId =
      searchParams.get("sessionId");

    const statusParam =
      searchParams.get("status");

    if (
      statusParam &&
      ![
        "pending",
        "acknowledged",
        "resolved",
      ].includes(statusParam)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status",
        },
        { status: 400 }
      );
    }

    if (sessionId) {
      const calls =
        await WaiterCallService.getBySession(
          sessionId
        );

      const unauthorized =
        calls.some(
          (call) =>
            call.establishmentId !==
            authUser.establishmentId
        );

      if (unauthorized) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Establishment access denied",
          },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: calls,
      });
    }

    const calls =
      await WaiterCallService.getByEstablishment(
        authUser.establishmentId,
        statusParam as
          | "pending"
          | "acknowledged"
          | "resolved"
          | undefined
      );

    return NextResponse.json({
      success: true,
      data: calls,
    });
  } catch (error) {
    console.error(
      "Error fetching waiter calls:",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
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