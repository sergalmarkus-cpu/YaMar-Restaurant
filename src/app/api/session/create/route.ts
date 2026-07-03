import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sessions, tables, establishments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { isWithinGeofence } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      qrCode,
      customerName,
      customerEmail,
      customerPhone,
      roomNumber,
      latitude,
      longitude,
      deviceId,
      language = "es",
    } = body;

    // Validate QR code
    const [table] = await db
      .select()
      .from(tables)
      .where(eq(tables.qrCode, qrCode))
      .limit(1);

    if (!table) {
      return NextResponse.json(
        { error: "Invalid QR code" },
        { status: 400 }
      );
    }

    // Get establishment
    const [establishment] = await db
      .select()
      .from(establishments)
      .where(eq(establishments.id, table.establishmentId))
      .limit(1);

    if (!establishment || !establishment.active) {
      return NextResponse.json(
        { error: "Establishment not available" },
        { status: 400 }
      );
    }

    // Check geofence if enabled and location provided
    if (
      establishment.geoFenceEnabled &&
      latitude &&
      longitude &&
      establishment.latitude &&
      establishment.longitude
    ) {
      const isWithinArea = isWithinGeofence(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(establishment.latitude),
        parseFloat(establishment.longitude),
        establishment.maxDeliveryDistance || 100
      );

      if (!isWithinArea) {
        return NextResponse.json(
          { error: "You are too far from the establishment" },
          { status: 400 }
        );
      }
    }

    // Check for existing active session with same device
    if (deviceId) {
      const existingSessions = await db
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.deviceId, deviceId),
            eq(sessions.tableId, table.id),
            eq(sessions.active, true)
          )
        );

      if (existingSessions.length > 0) {
        // Return existing session
        return NextResponse.json(existingSessions[0]);
      }
    }

    // Create new session
    const [newSession] = await db
      .insert(sessions)
      .values({
        tableId: table.id,
        establishmentId: table.establishmentId,
        customerName,
        customerEmail,
        customerPhone,
        roomNumber,
        latitude,
        longitude,
        deviceId,
        language,
        active: true,
      })
      .returning();

    // Update table status
    await db
      .update(tables)
      .set({ status: "occupied", updatedAt: new Date() })
      .where(eq(tables.id, table.id));

    return NextResponse.json(newSession);
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
