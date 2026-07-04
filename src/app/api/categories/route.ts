import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Obtener todas las categorías
export async function GET(request: NextRequest) {
  try {
    const allCategories = await db.select().from(categories);
    
    return NextResponse.json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva categoría
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newCategory = await db
      .insert(categories)
      .values({
        establishmentId: body.establishmentId,
        name: body.name,
        description: body.description || '',
        icon: body.icon || null,
        sortOrder: body.sortOrder || 0,
        active: body.active !== undefined ? body.active : true,
      })
      .returning();
    
    return NextResponse.json({
      success: true,
      data: newCategory[0],
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear categoría' },
      { status: 500 }
    );
  }
}