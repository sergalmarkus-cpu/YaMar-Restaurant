import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { establishments } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Obtener todos los establecimientos
export async function GET() {
  try {
    const allEstablishments = await db.select().from(establishments);
    
    return NextResponse.json({
      success: true,
      data: allEstablishments,
    });
  } catch (error) {
    console.error('Error fetching establishments:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener establecimientos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo establecimiento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newEstablishment = await db
      .insert(establishments)
      .values({
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        address: body.address,
        phone: body.phone,
        email: body.email,
        latitude: body.latitude,
        longitude: body.longitude,
        maxDeliveryDistance: body.maxDeliveryDistance || 100,
        geoFenceEnabled: body.geoFenceEnabled || false,
        currency: body.currency || 'EUR',
        timezone: body.timezone || 'Europe/Madrid',
        features: body.features || {},
        active: body.active !== undefined ? body.active : true,
      })
      .returning();
    
    return NextResponse.json({
      success: true,
      data: newEstablishment[0],
    });
  } catch (error) {
    console.error('Error creating establishment:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear establecimiento' },
      { status: 500 }
    );
  }
}