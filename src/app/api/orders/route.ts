import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET - Obtener todos los pedidos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const establishmentId = searchParams.get('establishmentId');
    const tableId = searchParams.get('tableId');
    const status = searchParams.get('status');
    
    let query = db
      .select({
        order: orders,
        table: tables,
        items: orderItems,
      })
      .from(orders)
      .leftJoin(tables, eq(orders.tableId, tables.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .orderBy(desc(orders.createdAt));
    
    if (establishmentId) {
      query = query.where(eq(orders.establishmentId, parseInt(establishmentId))) as any;
    }
    
    if (tableId) {
      query = query.where(eq(orders.tableId, parseInt(tableId))) as any;
    }
    
    if (status) {
      query = query.where(eq(orders.status, status)) as any;
    }
    
    const result = await query;
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener pedidos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newOrder = await db
      .insert(orders)
      .values({
        establishmentId: body.establishmentId,
        tableId: body.tableId,
        clientId: body.clientId || null,
        status: 'pending',
        subtotal: body.subtotal,
        tax: body.tax || 0,
        total: body.total,
        notes: body.notes || '',
      })
      .returning();
    
    // Insertar items del pedido
    if (body.items && body.items.length > 0) {
      await db.insert(orderItems).values(
        body.items.map((item: any) => ({
          orderId: newOrder[0].id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          modifications: item.modifications || [],
          observations: item.observations || '',
        }))
      );
    }
    
    return NextResponse.json({
      success: true,
      data: newOrder[0],
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear pedido' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar estado del pedido
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    const updated = await db
      .update(orders)
      .set({
        status: body.status,
        estimatedTime: body.estimatedTime,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, parseInt(id)))
      .returning();
    
    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar pedido' },
      { status: 500 }
    );
  }
}