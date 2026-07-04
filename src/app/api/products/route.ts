import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories, menus } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const establishmentId = searchParams.get('establishmentId');
    const menuId = searchParams.get('menuId');
    
    let query = db
      .select({
        product: products,
        category: categories,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));
    
    if (categoryId) {
      query = query.where(eq(products.categoryId, parseInt(categoryId))) as any;
    }
    
    if (establishmentId) {
      query = query.where(eq(products.establishmentId, parseInt(establishmentId))) as any;
    }
    
    if (menuId) {
      query = query.where(eq(products.menuId, parseInt(menuId))) as any;
    }
    
    const result = await query;
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newProduct = await db
      .insert(products)
      .values({
        establishmentId: body.establishmentId,
        categoryId: body.categoryId,
        menuId: body.menuId || null,
        name: body.name,
        description: body.description || '',
        price: parseFloat(body.price),
        image: body.image || null,
        calories: body.calories || null,
        allergens: body.allergens || [],
        modifiers: body.modifiers || [],
        isVegetarian: body.isVegetarian || false,
        isVegan: body.isVegan || false,
        isSpicy: body.isSpicy || false,
        available: body.available !== undefined ? body.available : true,
        preparationTime: body.preparationTime || 15,
        sortOrder: body.sortOrder || 0,
      })
      .returning();
    
    return NextResponse.json({
      success: true,
      data: newProduct[0],
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}