import {
  NextRequest,
} from "next/server";

import {
  and,
  asc,
  eq,
  inArray,
} from "drizzle-orm";

import {
  z,
} from "zod";

import {
  db,
} from "@/db";

import {
  categories,
  establishments,
  menus,
  modifiers,
  products,
  sessions,
} from "@/db/schema";

import {
  MenuAvailabilityService,
} from "@/services/menu-availability.service";

import {
  ApiResponse,
} from "@/lib/api/ApiResponse";

const SessionIdSchema =
  z.uuid();

export async function GET(
  request: NextRequest
) {
  try {
    /*
     * ==========================================================
     * 1. SESIÓN QR
     * ==========================================================
     *
     * El cliente NO envía establishmentId.
     *
     * El establecimiento se deriva exclusivamente
     * de la sesión QR activa.
     */

    const {
      searchParams,
    } =
      new URL(
        request.url
      );

    const sessionId =
      searchParams.get(
        "sessionId"
      );

    const parsedSessionId =
      SessionIdSchema.safeParse(
        sessionId
      );

    if (
      !parsedSessionId.success
    ) {
      return ApiResponse.error(
        "La sesión no es válida.",
        400
      );
    }

    const [
      session,
    ] =
      await db
        .select({
          id:
            sessions.id,

          tableId:
            sessions.tableId,

          establishmentId:
            sessions.establishmentId,

          active:
            sessions.active,

          closedAt:
            sessions.closedAt,
        })
        .from(
          sessions
        )
        .where(
          and(
            eq(
              sessions.id,
              parsedSessionId.data
            ),

            eq(
              sessions.active,
              true
            )
          )
        )
        .limit(
          1
        );

    if (
      !session ||
      session.closedAt
    ) {
      return ApiResponse.error(
        "La sesión no existe o ya no está activa.",
        404
      );
    }

    /*
     * ==========================================================
     * 2. ESTABLECIMIENTO
     * ==========================================================
     */

    const [
      establishment,
    ] =
      await db
        .select({
          id:
            establishments.id,

          active:
            establishments.active,
        })
        .from(
          establishments
        )
        .where(
          eq(
            establishments.id,
            session.establishmentId
          )
        )
        .limit(
          1
        );

    if (
      !establishment ||
      !establishment.active
    ) {
      return ApiResponse.error(
        "El establecimiento no está disponible.",
        404
      );
    }

    /*
     * ==========================================================
     * 3. MENÚS ACTIVOS DEL TENANT
     * ==========================================================
     */

    const menuRows =
      await db
        .select({
          id:
            menus.id,

          establishmentId:
            menus.establishmentId,

          name:
            menus.name,

          description:
            menus.description,

          type:
            menus.type,

          icon:
            menus.icon,

          displayOrder:
            menus.displayOrder,
        })
        .from(
          menus
        )
        .where(
          and(
            eq(
              menus.establishmentId,
              establishment.id
            ),

            eq(
              menus.active,
              true
            )
          )
        )
        .orderBy(
          asc(
            menus.displayOrder
          ),

          asc(
            menus.id
          )
        );

    if (
      menuRows.length ===
      0
    ) {
      return ApiResponse.success(
        [],
        "No hay menús públicos disponibles."
      );
    }

    const menuIds =
      menuRows.map(
        (
          menu
        ) =>
          menu.id
      );

    /*
     * ==========================================================
     * 4. CATEGORÍAS ACTIVAS
     * ==========================================================
     */

    const categoryRows =
      await db
        .select({
          id:
            categories.id,

          menuId:
            categories.menuId,

          name:
            categories.name,

          description:
            categories.description,

          displayOrder:
            categories.displayOrder,
        })
        .from(
          categories
        )
        .where(
          and(
            inArray(
              categories.menuId,
              menuIds
            ),

            eq(
              categories.active,
              true
            )
          )
        )
        .orderBy(
          asc(
            categories.displayOrder
          ),

          asc(
            categories.id
          )
        );

    const categoryIds =
      categoryRows.map(
        (
          category
        ) =>
          category.id
      );

    /*
     * ==========================================================
     * 5. PRODUCTOS PÚBLICOS
     * ==========================================================
     *
     * Mostramos productos activos aunque temporalmente
     * no estén disponibles.
     *
     * Así el cliente puede ver "agotado" en lugar de
     * hacer desaparecer el producto de la carta.
     */

    const productRows =
      categoryIds.length >
      0
        ? await db
            .select({
              id:
                products.id,

              establishmentId:
                products.establishmentId,

              categoryId:
                products.categoryId,

              name:
                products.name,

              description:
                products.description,

              price:
                products.price,

              image:
                products.image,

              allergens:
                products.allergens,

              dietary:
                products.dietary,

              available:
                products.available,

              stock:
                products.stock,

              preparationTime:
                products.preparationTime,

              displayOrder:
                products.displayOrder,

              featured:
                products.featured,

              dailySpecial:
                products.dailySpecial,
            })
            .from(
              products
            )
            .where(
              and(
                eq(
                  products.establishmentId,
                  establishment.id
                ),

                inArray(
                  products.categoryId,
                  categoryIds
                ),

                eq(
                  products.active,
                  true
                )
              )
            )
            .orderBy(
              asc(
                products.displayOrder
              ),

              asc(
                products.id
              )
            )
        : [];

    const productIds =
      productRows.map(
        (
          product
        ) =>
          product.id
      );

    /*
     * ==========================================================
     * 6. MODIFICADORES ACTIVOS
     * ==========================================================
     */

    const modifierRows =
      productIds.length >
      0
        ? await db
            .select({
              id:
                modifiers.id,

              productId:
                modifiers.productId,

              name:
                modifiers.name,

              type:
                modifiers.type,

              price:
                modifiers.price,

              active:
                modifiers.active,
            })
            .from(
              modifiers
            )
            .where(
              and(
                inArray(
                  modifiers.productId,
                  productIds
                ),

                eq(
                  modifiers.active,
                  true
                )
              )
            )
            .orderBy(
              asc(
                modifiers.id
              )
            )
        : [];

    /*
     * ==========================================================
     * 7. DISPONIBILIDAD HORARIA
     * ==========================================================
     */

    const availabilityResults =
      await Promise.all(
        menuRows.map(
          async (
            menu
          ) => {
            const availability =
              await MenuAvailabilityService.check(
                menu.id
              );

            return [
              menu.id,
              availability,
            ] as const;
          }
        )
      );

    const availabilityByMenu =
      new Map(
        availabilityResults
      );

    /*
     * ==========================================================
     * 8. CONSTRUIR ÁRBOL PÚBLICO
     * ==========================================================
     *
     * Menu
     *   -> Category
     *       -> Product
     *           -> Modifier
     */

    const publicMenus =
      menuRows.map(
        (
          menu
        ) => {
          const availability =
            availabilityByMenu.get(
              menu.id
            );

          const menuCategories =
            categoryRows
              .filter(
                (
                  category
                ) =>
                  category.menuId ===
                  menu.id
              )
              .map(
                (
                  category
                ) => {
                  const categoryProducts =
                    productRows
                      .filter(
                        (
                          product
                        ) =>
                          product.categoryId ===
                          category.id
                      )
                      .map(
                        (
                          product
                        ) => ({
                          id:
                            product.id,

                          categoryId:
                            product.categoryId,

                          name:
                            product.name,

                          description:
                            product.description,

                          price:
                            product.price,

                          image:
                            product.image,

                          allergens:
                            product.allergens ??
                            [],

                          dietary:
                            product.dietary ??
                            [],

                          available:
                            product.available,

                          stock:
                            product.stock,

                          preparationTime:
                            product.preparationTime,

                          featured:
                            product.featured,

                          dailySpecial:
                            product.dailySpecial,

                          modifiers:
                            modifierRows.filter(
                              (
                                modifier
                              ) =>
                                modifier.productId ===
                                product.id
                            ),
                        })
                      );

                  return {
                    id:
                      category.id,

                    menuId:
                      category.menuId,

                    name:
                      category.name,

                    description:
                      category.description,

                    displayOrder:
                      category.displayOrder,

                    products:
                      categoryProducts,
                  };
                }
              );

          return {
            id:
              menu.id,

            establishmentId:
              menu.establishmentId,

            name:
              menu.name,

            description:
              menu.description,

            type:
              menu.type,

            icon:
              menu.icon,

            categories:
              menuCategories,

            isOpen:
              availability?.isOpen ??
              false,

            currentSchedule:
              availability?.currentSchedule ??
              null,

            nextOpening:
              availability?.nextOpening ??
              null,
          };
        }
      );

    return ApiResponse.success(
      publicMenus,
      "Carta pública obtenida correctamente."
    );
  } catch (
    error
  ) {
    console.error(
      "Error obteniendo carta pública:",
      error
    );

    return ApiResponse.error(
      "No se pudo obtener la carta.",
      500
    );
  }
}