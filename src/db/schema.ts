import { pgTable, text, serial, integer, timestamp, boolean, decimal, jsonb, varchar, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'manager', 'waiter', 'kitchen', 'bar', 'cashier']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'accepted', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'partial', 'paid', 'refunded']);
export const paymentMethodEnum = pgEnum('payment_method', ['card', 'cash', 'transfer', 'paypal', 'apple_pay', 'google_pay']);
export const tableStatusEnum = pgEnum('table_status', ['available', 'occupied', 'reserved', 'cleaning']);
export const menuTypeEnum = pgEnum('menu_type', ['snacks', 'restaurant', 'cocktails', 'coffee', 'breakfast', 'desserts', 'custom']);

// Establishments (multi-tenant)
export const establishments = pgTable("establishments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  maxDeliveryDistance: integer("max_delivery_distance").default(100), // meters
  geoFenceEnabled: boolean("geo_fence_enabled").default(false),
  logo: text("logo"),
  primaryColor: text("primary_color").default("#000000"),
  secondaryColor: text("secondary_color").default("#ffffff"),
  currency: text("currency").default("EUR"),
  timezone: text("timezone").default("Europe/Madrid"),
  features: jsonb("features").default({
    geolocation: true,
    onlinePayment: true,
    splitBill: true,
    ratings: true,
    loyalty: false,
    reservations: false,
    callWaiter: true
  }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users (staff)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull(),
  phone: text("phone"),
  avatar: text("avatar"),
  active: boolean("active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Areas/Zones (for large establishments)
export const areas = pgTable("areas", {
  id: serial("id").primaryKey(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  radius: integer("radius").default(20), // meters
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tables
export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  areaId: integer("area_id").references(() => areas.id),
  code: text("code").notNull(), // e.g., "A12", "POOL-15"
  qrCode: text("qr_code").unique(), // QR token
  capacity: integer("capacity").default(4),
  status: tableStatusEnum("status").default('available'),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  floor: integer("floor").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Menus (Cartas)
export const menus = pgTable("menus", {
  id: serial("id").primaryKey(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  name: jsonb("name").notNull(), // {"es": "Snacks", "en": "Snacks", "de": "Snacks"}
  description: jsonb("description"),
  type: menuTypeEnum("type").notNull(),
  icon: text("icon"),
  displayOrder: integer("display_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Menu Schedules
export const menuSchedules = pgTable("menu_schedules", {
  id: serial("id").primaryKey(),
  menuId: integer("menu_id").references(() => menus.id).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  openTime: text("open_time").notNull(), // "11:30"
  closeTime: text("close_time").notNull(), // "13:00"
  active: boolean("active").default(true),
});

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  menuId: integer("menu_id").references(() => menus.id).notNull(),
  name: jsonb("name").notNull(),
  description: jsonb("description"),
  displayOrder: integer("display_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  name: jsonb("name").notNull(),
  description: jsonb("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image"),
  allergens: jsonb("allergens").default([]), // ["gluten", "lactose", ...]
  dietary: jsonb("dietary").default([]), // ["vegan", "vegetarian", "gluten-free"]
  available: boolean("available").default(true),
  stock: integer("stock"), // null = unlimited
  preparationTime: integer("preparation_time").default(10), // minutes
  displayOrder: integer("display_order").default(0),
  featured: boolean("featured").default(false),
  dailySpecial: boolean("daily_special").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Product Modifiers (extras, options)
export const modifiers = pgTable("modifiers", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  name: jsonb("name").notNull(),
  type: text("type").notNull(), // "add", "remove", "replace"
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  active: boolean("active").default(true),
});

// Sessions (guest sessions via QR)
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  tableId: integer("table_id").references(() => tables.id).notNull(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  roomNumber: text("room_number"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  deviceId: text("device_id"),
  language: text("language").default("es"),
  active: boolean("active").default(true),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  sessionId: uuid("session_id").references(() => sessions.id).notNull(),
  tableId: integer("table_id").references(() => tables.id).notNull(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  orderNumber: text("order_number").notNull().unique(),
  status: orderStatusEnum("status").default('pending'),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  tip: decimal("tip", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  estimatedTime: integer("estimated_time"), // minutes
  acceptedBy: integer("accepted_by").references(() => users.id),
  acceptedAt: timestamp("accepted_at"),
  deliveredBy: integer("delivered_by").references(() => users.id),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  modifiers: jsonb("modifiers").default([]),
  notes: text("notes"),
  status: orderStatusEnum("status").default('pending'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bill Splits
export const billSplits = pgTable("bill_splits", {
  id: serial("id").primaryKey(),
  sessionId: uuid("session_id").references(() => sessions.id).notNull(),
  splitType: text("split_type").notNull(), // "equal", "items", "percentage", "custom"
  splits: jsonb("splits").notNull(), // Array of split details
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  sessionId: uuid("session_id").references(() => sessions.id).notNull(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  billSplitId: integer("bill_split_id").references(() => billSplits.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").default('pending'),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  transactionId: text("transaction_id"),
  receiptUrl: text("receipt_url"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Receipts
export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  sessionId: uuid("session_id").references(() => sessions.id).notNull(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  receiptNumber: text("receipt_number").notNull().unique(),
  pdfUrl: text("pdf_url").notNull(),
  emailSent: boolean("email_sent").default(false),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  items: jsonb("items").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Ratings
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  sessionId: uuid("session_id").references(() => sessions.id).notNull(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  foodRating: integer("food_rating").notNull(), // 1-5
  serviceRating: integer("service_rating").notNull(), // 1-5
  attentionRating: integer("attention_rating").notNull(), // 1-5
  comment: text("comment"),
  photos: jsonb("photos").default([]),
  approved: boolean("approved").default(false),
  moderatedBy: integer("moderated_by").references(() => users.id),
  moderatedAt: timestamp("moderated_at"),
  response: text("response"),
  respondedBy: integer("responded_by").references(() => users.id),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Waiter Calls
export const waiterCalls = pgTable("waiter_calls", {
  id: serial("id").primaryKey(),
  sessionId: uuid("session_id").references(() => sessions.id).notNull(),
  tableId: integer("table_id").references(() => tables.id).notNull(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  type: text("type").notNull(), // "waiter", "water", "cutlery", "napkins", "ice", "help", "bill"
  message: text("message"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  status: text("status").default('pending'), // "pending", "acknowledged", "resolved"
  acknowledgedBy: integer("acknowledged_by").references(() => users.id),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedBy: integer("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Promotions
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  name: jsonb("name").notNull(),
  description: jsonb("description"),
  code: text("code"),
  discountType: text("discount_type").notNull(), // "percentage", "fixed", "free_item"
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  conditions: jsonb("conditions"), // min amount, specific products, etc.
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Loyalty Program
export const loyaltyPoints = pgTable("loyalty_points", {
  id: serial("id").primaryKey(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  sessionId: uuid("session_id").references(() => sessions.id).notNull(),
  customerEmail: text("customer_email").notNull(),
  points: integer("points").default(0),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  lastVisit: timestamp("last_visit"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // "new_order", "waiter_call", "payment_received", etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Analytics Events
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  eventType: text("event_type").notNull(),
  eventData: jsonb("event_data"),
  sessionId: uuid("session_id"),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Meal Vouchers (pensión, media pensión, etc.)
export const mealVouchers = pgTable("meal_vouchers", {
  id: serial("id").primaryKey(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  name: jsonb("name").notNull(),
  type: text("type").notNull(), // "full_board", "half_board", "all_inclusive", "custom"
  creditsPerDay: decimal("credits_per_day", { precision: 10, scale: 2 }).notNull(),
  validMenus: jsonb("valid_menus").default([]), // menu IDs
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Customer Voucher Assignments
export const customerVouchers = pgTable("customer_vouchers", {
  id: serial("id").primaryKey(),
  voucherId: integer("voucher_id").references(() => mealVouchers.id).notNull(),
  customerEmail: text("customer_email"),
  roomNumber: text("room_number"),
  creditsUsed: decimal("credits_used", { precision: 10, scale: 2 }).default("0"),
  creditsRemaining: decimal("credits_remaining", { precision: 10, scale: 2 }).notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Point of Sale (for multi-vendor in same establishment)
export const pointsOfSale = pgTable("points_of_sale", {
  id: serial("id").primaryKey(),
  establishmentId: integer("establishment_id").references(() => establishments.id).notNull(),
  name: jsonb("name").notNull(),
  description: jsonb("description"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  radius: integer("radius").default(50), // detection radius in meters
  menus: jsonb("menus").default([]), // menu IDs available at this POS
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const establishmentsRelations = relations(establishments, ({ many }) => ({
  users: many(users),
  areas: many(areas),
  tables: many(tables),
  menus: many(menus),
}));

export const menusRelations = relations(menus, ({ one, many }) => ({
  establishment: one(establishments, {
    fields: [menus.establishmentId],
    references: [establishments.id],
  }),
  schedules: many(menuSchedules),
  categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  menu: one(menus, {
    fields: [categories.menuId],
    references: [menus.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  modifiers: many(modifiers),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  table: one(tables, {
    fields: [sessions.tableId],
    references: [tables.id],
  }),
  orders: many(orders),
  payments: many(payments),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  session: one(sessions, {
    fields: [orders.sessionId],
    references: [sessions.id],
  }),
  items: many(orderItems),
}));
