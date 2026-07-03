import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, sessions, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      items,
      notes,
      latitude,
      longitude,
    } = body;

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

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in order" },
        { status: 400 }
      );
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (!product || !product.available) {
        return NextResponse.json(
          { error: `Product ${item.productId} not available` },
          { status: 400 }
        );
      }

      // Check stock
      if (product.stock !== null && product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product ${product.name}` },
          { status: 400 }
        );
      }

      // Calculate item subtotal
      let itemPrice = parseFloat(product.price);
      
      // Add modifiers
      if (item.modifiers && item.modifiers.length > 0) {
        for (const mod of item.modifiers) {
          itemPrice += parseFloat(mod.price);
        }
      }

      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: itemPrice.toFixed(2),
        subtotal: itemSubtotal.toFixed(2),
        modifiers: item.modifiers || [],
        notes: item.notes,
      });
    }

    // Calculate tax (10% for example)
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // Create order
    const orderNumber = generateOrderNumber();

    const [newOrder] = await db
      .insert(orders)
      .values({
        sessionId,
        tableId: session.tableId,
        establishmentId: session.establishmentId,
        orderNumber,
        status: "pending",
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        tip: "0",
        total: total.toFixed(2),
        notes,
        latitude: latitude || session.latitude,
        longitude: longitude || session.longitude,
        estimatedTime: 15, // Default 15 minutes
      })
      .returning();

    // Create order items
    for (const item of validatedItems) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        modifiers: item.modifiers,
        notes: item.notes,
        status: "pending",
      });

      // Update product stock
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (product.stock !== null) {
        await db
          .update(products)
          .set({ stock: product.stock - item.quantity })
          .where(eq(products.id, item.productId));
      }
    }

    // Fetch complete order with items
    const completeOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, newOrder.id))
      .limit(1);

    const items_result = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, newOrder.id));

    return NextResponse.json({
      ...completeOrder[0],
      items: items_result,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
