import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ratings, sessions, orders } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      foodRating,
      serviceRating,
      attentionRating,
      comment,
      photos = [],
    } = body;

    // Validate session
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (!session) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 400 }
      );
    }

    // Check if session has orders
    const sessionOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.sessionId, sessionId))
      .limit(1);

    if (sessionOrders.length === 0) {
      return NextResponse.json(
        { error: "Cannot rate without orders" },
        { status: 400 }
      );
    }

    // Check if already rated
    const existingRating = await db
      .select()
      .from(ratings)
      .where(eq(ratings.sessionId, sessionId))
      .limit(1);

    if (existingRating.length > 0) {
      return NextResponse.json(
        { error: "Session already rated" },
        { status: 400 }
      );
    }

    // Create rating
    const [rating] = await db
      .insert(ratings)
      .values({
        sessionId,
        establishmentId: session.establishmentId,
        foodRating,
        serviceRating,
        attentionRating,
        comment,
        photos,
        approved: false, // Requires moderation
      })
      .returning();

    return NextResponse.json(rating);
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const establishmentId = searchParams.get("establishmentId");

    if (!establishmentId) {
      return NextResponse.json(
        { error: "establishmentId is required" },
        { status: 400 }
      );
    }

    const approvedRatings = await db
      .select()
      .from(ratings)
      .where(
        and(
          eq(ratings.establishmentId, parseInt(establishmentId)),
          eq(ratings.approved, true)
        )
      )
      .orderBy(ratings.createdAt);

    return NextResponse.json(approvedRatings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
