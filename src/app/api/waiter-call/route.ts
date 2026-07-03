import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { waiterCalls, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, type, message, latitude, longitude } = body;

    // Validate session
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (!session || !session.active) {
      return NextResponse.json(
        { error: "Invalid or inactive session" },
        { status: 400 }
      );
    }

    // Create waiter call
    const [call] = await db
      .insert(waiterCalls)
      .values({
        sessionId,
        tableId: session.tableId,
        establishmentId: session.establishmentId,
        type,
        message,
        latitude: latitude || session.latitude,
        longitude: longitude || session.longitude,
        status: "pending",
      })
      .returning();

    return NextResponse.json(call);
  } catch (error) {
    console.error("Error creating waiter call:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const calls = await db
      .select()
      .from(waiterCalls)
      .where(eq(waiterCalls.sessionId, sessionId))
      .orderBy(waiterCalls.createdAt);

    return NextResponse.json(calls);
  } catch (error) {
    console.error("Error fetching waiter calls:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
