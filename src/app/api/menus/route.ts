import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { menus, menuSchedules, categories, products, modifiers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { isMenuOpen, getNextOpeningTime } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const establishmentId = searchParams.get("establishmentId");

    if (!establishmentId) {
      return NextResponse.json(
        { error: "establishmentId is required" },
        { status: 400 }
      );
    }

    // Get menus
    const allMenus = await db
      .select()
      .from(menus)
      .where(
        and(
          eq(menus.establishmentId, parseInt(establishmentId)),
          eq(menus.active, true)
        )
      )
      .orderBy(menus.displayOrder);

    // Get schedules for all menus
    const menuIds = allMenus.map((m) => m.id);
    const schedules = await db
      .select()
      .from(menuSchedules)
      .where(eq(menuSchedules.active, true));

    // Get categories and products
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.active, true))
      .orderBy(categories.displayOrder);

    const allProducts = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.establishmentId, parseInt(establishmentId)),
          eq(products.active, true)
        )
      )
      .orderBy(products.displayOrder);

    const allModifiers = await db
      .select()
      .from(modifiers)
      .where(eq(modifiers.active, true));

    // Build menu structure
    const menusWithData = allMenus.map((menu) => {
      const menuSchedulesList = schedules.filter((s) => s.menuId === menu.id);
      const isOpen = isMenuOpen(menuSchedulesList);
      const nextOpeningTime = !isOpen ? getNextOpeningTime(menuSchedulesList) : null;

      const menuCategories = allCategories
        .filter((c) => c.menuId === menu.id)
        .map((category) => {
          const categoryProducts = allProducts
            .filter((p) => p.categoryId === category.id)
            .map((product) => ({
              ...product,
              modifiers: allModifiers.filter((m) => m.productId === product.id),
            }));

          return {
            ...category,
            products: categoryProducts,
          };
        });

      return {
        ...menu,
        schedules: menuSchedulesList,
        categories: menuCategories,
        isOpen,
        nextOpeningTime,
      };
    });

    return NextResponse.json(menusWithData);
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
