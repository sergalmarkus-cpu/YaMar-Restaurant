import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pointsOfSale } from "@/db/schema";
import { eq } from "drizzle-orm";
import { findNearestPOS } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const establishmentId = searchParams.get("establishmentId");
    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");

    if (!establishmentId || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const allPOS = await db
      .select()
      .from(pointsOfSale)
      .where(eq(pointsOfSale.establishmentId, parseInt(establishmentId)));

    const nearbyPOS = findNearestPOS(
      parseFloat(latitude),
      parseFloat(longitude),
      allPOS
    );

    return NextResponse.json(nearbyPOS);
  } catch (error) {
    console.error("Error fetching nearby POS:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
