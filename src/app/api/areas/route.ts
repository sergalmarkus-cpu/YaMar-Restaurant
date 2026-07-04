import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { areas } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Obtener todas las áreas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const establishmentId = searchParams.get('establishmentId');
    
    let query = db.select().from(areas);
    
    if (establishmentId) {
      query = query.where(eq(areas.establishmentId, parseInt(establishmentId))) as any;
    }
    
    const allAreas = await query;
    
    return NextResponse.json({
      success: true,
      data: allAreas,
    });
  } catch (error) {
    console.error('Error fetching areas:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener áreas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva área
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newArea = await db
      .insert(areas)
      .values({
        establishmentId: body.establishmentId,
        name: body.name,
        description: body.description,
        active: body.active !== undefined ? body.active : true,
      })
      .returning();
    
    return NextResponse.json({
      success: true,
      data: newArea[0],
    });
  } catch (error) {
    console.error('Error creating area:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear área' },
      { status: 500 }
    );
  }
}