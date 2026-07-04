import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { establishments } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Obtener un establecimiento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const establishment = await db
      .select()
      .from(establishments)
      .where(eq(establishments.id, parseInt(params.id)))
      .limit(1);
    
    if (!establishment.length) {
      return NextResponse.json(
        { success: false, error: 'Establecimiento no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: establishment[0],
    });
  } catch (error) {
    console.error('Error fetching establishment:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener establecimiento' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar establecimiento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updated = await db
      .update(establishments)
      .set({
        name: body.name,
        description: body.description,
        address: body.address,
        phone: body.phone,
        email: body.email,
        latitude: body.latitude,
        longitude: body.longitude,
        maxDeliveryDistance: body.maxDeliveryDistance,
        geoFenceEnabled: body.geoFenceEnabled,
        currency: body.currency,
        timezone: body.timezone,
        features: body.features,
        active: body.active,
        updatedAt: new Date(),
      })
      .where(eq(establishments.id, parseInt(params.id)))
      .returning();
    
    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('Error updating establishment:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar establecimiento' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar establecimiento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db
      .delete(establishments)
      .where(eq(establishments.id, parseInt(params.id)));
    
    return NextResponse.json({
      success: true,
      message: 'Establecimiento eliminado correctamente',
    });
  } catch (error) {
    console.error('Error deleting establishment:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar establecimiento' },
      { status: 500 }
    );
  }
}