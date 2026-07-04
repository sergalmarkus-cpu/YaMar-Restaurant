import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tables } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

// GET - Obtener todas las mesas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const areaId = searchParams.get('areaId');
    const establishmentId = searchParams.get('establishmentId');
    
    let query = db.select().from(tables);
    
    if (areaId) {
      query = query.where(eq(tables.areaId, parseInt(areaId))) as any;
    }
    
    if (establishmentId) {
      query = query.where(eq(tables.establishmentId, parseInt(establishmentId))) as any;
    }
    
    const allTables = await query;
    
    return NextResponse.json({
      success: true,
      data: allTables,
    });
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener mesas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva mesa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generar código QR único
    const qrCode = randomBytes(16).toString('hex');
    
    const newTable = await db
      .insert(tables)
      .values({
        establishmentId: body.establishmentId,
        areaId: body.areaId,
        tableNumber: body.tableNumber,
        capacity: body.capacity || 4,
        qrCode: qrCode,
        status: 'available',
        active: body.active !== undefined ? body.active : true,
      })
      .returning();
    
    return NextResponse.json({
      success: true,
      data: newTable[0],
    });
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear mesa' },
      { status: 500 }
    );
  }
}