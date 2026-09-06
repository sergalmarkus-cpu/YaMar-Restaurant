import { NextRequest, NextResponse } from "next/server";

import {
  ApiAuthError,
  authenticateRequest,
} from "@/auth/api-auth";

import { WaiterCallService } from "@/services/waiter-call.service";
import { updateWaiterCallSchema } from "@/validations/waiter-call.validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const authUser =
      await authenticateRequest(request);

    const { id } = await context.params;

    const callId = Number(id);

    if (
      !Number.isInteger(callId) ||
      callId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid waiter call id",
        },
        { status: 400 }
      );
    }

    const call =
      await WaiterCallService.getById(
        callId,
        authUser.establishmentId
      );

    return NextResponse.json({
      success: true,
      data: call,
    });
  } catch (error) {
    console.error(
      "Error fetching waiter call:",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    if (
      error instanceof Error &&
      error.message ===
        "WAITER_CALL_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Waiter call not found",
        },
        { status: 404 }
      );
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

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const callId = Number(id);

    if (
      !Number.isInteger(callId) ||
      callId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid waiter call id",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const validation =
      updateWaiterCallSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid waiter call update data",
          details:
            validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const authUser =
      await authenticateRequest(request);

    const updatedCall =
      await WaiterCallService.updateStatus(
        callId,
        validation.data,
        authUser.userId,
        authUser.establishmentId,
        authUser.role
      );

    return NextResponse.json({
      success: true,
      data: updatedCall,
    });
  } catch (error) {
    console.error(
      "Error updating waiter call:",
      error
    );

    const authResponse =
      handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    if (error instanceof Error) {
      switch (error.message) {
        case "FORBIDDEN":
          return NextResponse.json(
            {
              success: false,
              error:
                "You are not allowed to manage waiter calls",
            },
            { status: 403 }
          );

        case "USER_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              error: "User not found",
            },
            { status: 401 }
          );

        case "USER_INACTIVE":
          return NextResponse.json(
            {
              success: false,
              error: "User is inactive",
            },
            { status: 403 }
          );

        case "ESTABLISHMENT_ACCESS_DENIED":
          return NextResponse.json(
            {
              success: false,
              error:
                "Establishment access denied",
            },
            { status: 403 }
          );

        case "ROLE_MISMATCH":
          return NextResponse.json(
            {
              success: false,
              error:
                "Authentication role mismatch",
            },
            { status: 403 }
          );

        case "WAITER_CALL_NOT_FOUND":
          return NextResponse.json(
            {
              success: false,
              error:
                "Waiter call not found",
            },
            { status: 404 }
          );

        case "WAITER_CALL_ALREADY_RESOLVED":
          return NextResponse.json(
            {
              success: false,
              error:
                "Waiter call is already resolved",
            },
            { status: 409 }
          );

        case "INVALID_STATUS_TRANSITION":
          return NextResponse.json(
            {
              success: false,
              error:
                "Invalid waiter call status transition",
            },
            { status: 409 }
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