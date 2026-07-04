import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { menus } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// GET - Obtener todas las cartas activas
export async function GET(request: NextRequest) {
  try {
    const allMenus = await db.select().from(menus);
    
    return NextResponse.json({
      success: true,
      data: allMenus,
    });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener menús' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva carta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Definir horarios de apertura de la carta
    const scheduleHours = body.schedule?.hours || {};
    
    const newMenu = await db
      .insert(menus)
      .values({
        establishmentId: body.establishmentId,
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description || '',
        logo: body.logo || null,
        active: body.active !== undefined ? body.active : true,
        availabilityType: body.availabilityType || 'schedule',
        schedule: body.schedule || {
          enabled: false,
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          hours: { start: '09:00', end: '23:00' },
        },
      })
      .returning();
    
    return NextResponse.json({
      success: true,
      data: newMenu[0],
    });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear menú' },
      { status: 500 }
    );
  }
}

// GET por ID
export async function GETById(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID requerido' },
        { status: 400 }
      );
    }
    
    const menu = await db
      .select()
      .from(menus)
      .where(eq(menus.id, parseInt(id)))
      .limit(1);
    
    if (!menu.length) {
      return NextResponse.json(
        { success: false, error: 'Menú no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: menu[0],
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener menú' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar carta
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    const updated = await db
      .update(menus)
      .set({
        name: body.name,
        description: body.description,
        logo: body.logo,
        active: body.active,
        availabilityType: body.availabilityType,
        schedule: body.schedule,
      })
      .where(eq(menus.id, parseInt(id)))
      .returning();
    
    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar menú' },
      { status: 500 }
    );
  }
}