import "dotenv/config";
import { db } from "../src/db";
import {
  establishments,
  tables,
  menus,
  menuSchedules,
  categories,
  products,
  modifiers,
  areas,
  pointsOfSale,
} from "../src/db/schema";
import { generateQRToken } from "../src/lib/utils";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create establishment
  const [establishment] = await db
    .insert(establishments)
    .values({
      name: "Demo Restaurant & Hotel",
      slug: "demo-restaurant",
      description: "A beautiful restaurant and hotel by the beach",
      address: "123 Beach Road, Barcelona, Spain",
      phone: "+34 600 000 000",
      email: "info@demo-restaurant.com",
      latitude: "41.3851",
      longitude: "2.1734",
      maxDeliveryDistance: 100,
      geoFenceEnabled: true,
      currency: "EUR",
      timezone: "Europe/Madrid",
      features: {
        geolocation: true,
        onlinePayment: true,
        splitBill: true,
        ratings: true,
        loyalty: true,
        reservations: false,
        callWaiter: true,
      },
      active: true,
    })
    .returning();

  console.log("✅ Created establishment:", establishment.name);

  // Create areas
  const [poolArea] = await db
    .insert(areas)
    .values({
      establishmentId: establishment.id,
      name: "Pool Area",
      description: "Outdoor pool with sun loungers",
      latitude: "41.3852",
      longitude: "2.1735",
      radius: 50,
      active: true,
    })
    .returning();

  const [terrace] = await db
    .insert(areas)
    .values({
      establishmentId: establishment.id,
      name: "Terrace",
      description: "Rooftop terrace with sea views",
      latitude: "41.3850",
      longitude: "2.1733",
      radius: 30,
      active: true,
    })
    .returning();

  console.log("✅ Created areas");

  // Create tables
  const tablesData = [
    { code: "A1", areaId: poolArea.id },
    { code: "A2", areaId: poolArea.id },
    { code: "A3", areaId: poolArea.id },
    { code: "T1", areaId: terrace.id },
    { code: "T2", areaId: terrace.id },
    { code: "INDOOR-1", areaId: null },
    { code: "INDOOR-2", areaId: null },
  ];

  for (const tableData of tablesData) {
    await db.insert(tables).values({
      establishmentId: establishment.id,
      areaId: tableData.areaId,
      code: tableData.code,
      qrCode: generateQRToken(),
      capacity: 4,
      status: "available",
      active: true,
    });
  }

  console.log("✅ Created tables");

  // Create menus
  const [snacksMenu] = await db
    .insert(menus)
    .values({
      establishmentId: establishment.id,
      name: {
        es: "Snacks",
        en: "Snacks",
        de: "Snacks",
        fr: "Snacks",
      },
      description: {
        es: "Aperitivos ligeros para disfrutar junto a la piscina",
        en: "Light snacks to enjoy by the pool",
        de: "Leichte Snacks zum Genießen am Pool",
      },
      type: "snacks",
      displayOrder: 1,
      active: true,
    })
    .returning();

  const [restaurantMenu] = await db
    .insert(menus)
    .values({
      establishmentId: establishment.id,
      name: {
        es: "Restaurante",
        en: "Restaurant",
        de: "Restaurant",
        fr: "Restaurant",
      },
      description: {
        es: "Nuestra carta completa de comidas",
        en: "Our full dining menu",
        de: "Unsere vollständige Speisekarte",
      },
      type: "restaurant",
      displayOrder: 2,
      active: true,
    })
    .returning();

  const [cocktailsMenu] = await db
    .insert(menus)
    .values({
      establishmentId: establishment.id,
      name: {
        es: "Cócteles",
        en: "Cocktails",
        de: "Cocktails",
        fr: "Cocktails",
      },
      description: {
        es: "Cócteles clásicos y de autor",
        en: "Classic and signature cocktails",
        de: "Klassische und Signature-Cocktails",
      },
      type: "cocktails",
      displayOrder: 3,
      active: true,
    })
    .returning();

  console.log("✅ Created menus");

  // Create menu schedules
  // Snacks: 11:30-13:00 and 16:00-19:30 every day
  for (let day = 0; day < 7; day++) {
    await db.insert(menuSchedules).values([
      {
        menuId: snacksMenu.id,
        dayOfWeek: day,
        openTime: "11:30",
        closeTime: "13:00",
        active: true,
      },
      {
        menuId: snacksMenu.id,
        dayOfWeek: day,
        openTime: "16:00",
        closeTime: "19:30",
        active: true,
      },
    ]);
  }

  // Restaurant: 14:00-16:00 and 20:30-23:00 every day
  for (let day = 0; day < 7; day++) {
    await db.insert(menuSchedules).values([
      {
        menuId: restaurantMenu.id,
        dayOfWeek: day,
        openTime: "14:00",
        closeTime: "16:00",
        active: true,
      },
      {
        menuId: restaurantMenu.id,
        dayOfWeek: day,
        openTime: "20:30",
        closeTime: "23:00",
        active: true,
      },
    ]);
  }

  // Cocktails: 11:30-23:45 every day
  for (let day = 0; day < 7; day++) {
    await db.insert(menuSchedules).values({
      menuId: cocktailsMenu.id,
      dayOfWeek: day,
      openTime: "11:30",
      closeTime: "23:45",
      active: true,
    });
  }

  console.log("✅ Created menu schedules");

  // Create categories
  const [snacksCategory] = await db
    .insert(categories)
    .values({
      menuId: snacksMenu.id,
      name: {
        es: "Snacks",
        en: "Snacks",
        de: "Snacks",
      },
      displayOrder: 1,
      active: true,
    })
    .returning();

  const [startersCategory] = await db
    .insert(categories)
    .values({
      menuId: restaurantMenu.id,
      name: {
        es: "Entrantes",
        en: "Starters",
        de: "Vorspeisen",
      },
      displayOrder: 1,
      active: true,
    })
    .returning();

  const [mainCategory] = await db
    .insert(categories)
    .values({
      menuId: restaurantMenu.id,
      name: {
        es: "Platos Principales",
        en: "Main Courses",
        de: "Hauptgerichte",
      },
      displayOrder: 2,
      active: true,
    })
    .returning();

  const [cocktailsCategory] = await db
    .insert(categories)
    .values({
      menuId: cocktailsMenu.id,
      name: {
        es: "Cócteles Clásicos",
        en: "Classic Cocktails",
        de: "Klassische Cocktails",
      },
      displayOrder: 1,
      active: true,
    })
    .returning();

  console.log("✅ Created categories");

  // Create products
  const productsData = [
    // Snacks
    {
      categoryId: snacksCategory.id,
      name: {
        es: "Patatas Fritas",
        en: "French Fries",
        de: "Pommes Frites",
      },
      description: {
        es: "Patatas fritas crujientes con sal marina",
        en: "Crispy french fries with sea salt",
        de: "Knusprige Pommes Frites mit Meersalz",
      },
      price: "4.50",
      allergens: [],
      dietary: ["vegan", "vegetarian"],
      available: true,
      preparationTime: 10,
      featured: false,
    },
    {
      categoryId: snacksCategory.id,
      name: {
        es: "Nachos con Guacamole",
        en: "Nachos with Guacamole",
        de: "Nachos mit Guacamole",
      },
      description: {
        es: "Nachos crujientes servidos con guacamole casero",
        en: "Crispy nachos served with homemade guacamole",
        de: "Knusprige Nachos mit hausgemachter Guacamole",
      },
      price: "7.90",
      allergens: [],
      dietary: ["vegan", "vegetarian"],
      available: true,
      preparationTime: 8,
      featured: true,
    },
    // Starters
    {
      categoryId: startersCategory.id,
      name: {
        es: "Ensalada César",
        en: "Caesar Salad",
        de: "Caesar Salat",
      },
      description: {
        es: "Lechuga romana, parmesano, croutons y salsa césar",
        en: "Romaine lettuce, parmesan, croutons and caesar dressing",
        de: "Römersalat, Parmesan, Croutons und Caesar-Dressing",
      },
      price: "8.50",
      allergens: ["gluten", "dairy", "eggs"],
      dietary: ["vegetarian"],
      available: true,
      preparationTime: 12,
      featured: false,
    },
    // Main courses
    {
      categoryId: mainCategory.id,
      name: {
        es: "Hamburguesa Clásica",
        en: "Classic Burger",
        de: "Klassischer Burger",
      },
      description: {
        es: "Carne de ternera 200g, lechuga, tomate, cebolla, pepinillos y patatas fritas",
        en: "200g beef patty, lettuce, tomato, onion, pickles and french fries",
        de: "200g Rindfleisch-Patty, Salat, Tomate, Zwiebel, Gurken und Pommes Frites",
      },
      price: "14.90",
      allergens: ["gluten"],
      dietary: [],
      available: true,
      preparationTime: 20,
      featured: true,
      dailySpecial: false,
    },
    {
      categoryId: mainCategory.id,
      name: {
        es: "Paella Valenciana",
        en: "Valencian Paella",
        de: "Valencianische Paella",
      },
      description: {
        es: "Arroz, pollo, conejo, judías verdes y garrofón",
        en: "Rice, chicken, rabbit, green beans and butter beans",
        de: "Reis, Hähnchen, Kaninchen, grüne Bohnen und Butterbohnen",
      },
      price: "18.50",
      allergens: [],
      dietary: [],
      available: true,
      preparationTime: 30,
      featured: true,
      dailySpecial: true,
    },
    // Cocktails
    {
      categoryId: cocktailsCategory.id,
      name: {
        es: "Mojito",
        en: "Mojito",
        de: "Mojito",
      },
      description: {
        es: "Ron blanco, menta fresca, lima, azúcar y soda",
        en: "White rum, fresh mint, lime, sugar and soda",
        de: "Weißer Rum, frische Minze, Limette, Zucker und Soda",
      },
      price: "9.50",
      allergens: [],
      dietary: ["vegan"],
      available: true,
      preparationTime: 5,
      featured: true,
    },
    {
      categoryId: cocktailsCategory.id,
      name: {
        es: "Piña Colada",
        en: "Piña Colada",
        de: "Piña Colada",
      },
      description: {
        es: "Ron blanco, crema de coco, zumo de piña",
        en: "White rum, coconut cream, pineapple juice",
        de: "Weißer Rum, Kokosnusscreme, Ananassaft",
      },
      price: "10.00",
      allergens: [],
      dietary: ["vegetarian"],
      available: true,
      preparationTime: 5,
      featured: false,
    },
  ];

  for (const productData of productsData) {
    await db.insert(products).values({
      ...productData,
      establishmentId: establishment.id,
      displayOrder: 0,
      active: true,
    });
  }

  console.log("✅ Created products");

  // Create points of sale
  await db.insert(pointsOfSale).values([
    {
      establishmentId: establishment.id,
      name: {
        es: "Bar de la Piscina",
        en: "Pool Bar",
        de: "Pool Bar",
      },
      description: {
        es: "Bar junto a la piscina",
        en: "Bar by the pool",
        de: "Bar am Pool",
      },
      latitude: "41.3852",
      longitude: "2.1735",
      radius: 50,
      menus: [snacksMenu.id, cocktailsMenu.id],
      active: true,
    },
    {
      establishmentId: establishment.id,
      name: {
        es: "Restaurante Principal",
        en: "Main Restaurant",
        de: "Hauptrestaurant",
      },
      description: {
        es: "Restaurante principal con vistas al mar",
        en: "Main restaurant with sea views",
        de: "Hauptrestaurant mit Meerblick",
      },
      latitude: "41.3850",
      longitude: "2.1733",
      radius: 40,
      menus: [restaurantMenu.id, cocktailsMenu.id],
      active: true,
    },
  ]);

  console.log("✅ Created points of sale");

  console.log("🎉 Database seeded successfully!");
  console.log("\n📋 Summary:");
  console.log(`- Establishment: ${establishment.name}`);
  console.log(`- Tables: ${tablesData.length}`);
  console.log(`- Menus: 3 (Snacks, Restaurant, Cocktails)`);
  console.log(`- Products: ${productsData.length}`);
  console.log("\n🔗 Access the application:");
  console.log(`- Scan QR code or visit: /client/[qrCode]`);
  console.log(`- Admin panel: /admin (coming soon)`);
}

seed()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
