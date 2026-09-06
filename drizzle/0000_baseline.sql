CREATE TYPE "public"."menu_type" AS ENUM('snacks', 'restaurant', 'cocktails', 'coffee', 'breakfast', 'desserts', 'custom');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'accepted', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('card', 'cash', 'transfer', 'paypal', 'apple_pay', 'google_pay');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'partial', 'paid', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."table_status" AS ENUM('available', 'occupied', 'reserved', 'cleaning');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'manager', 'waiter', 'kitchen', 'bar', 'cashier');--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"establishment_id" integer NOT NULL,
	"event_type" text NOT NULL,
	"event_data" jsonb,
	"session_id" uuid,
	"user_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"establishment_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"radius" integer DEFAULT 20,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bill_splits" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"split_type" text NOT NULL,
	"splits" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"menu_id" integer NOT NULL,
	"name" jsonb NOT NULL,
	"description" jsonb,
	"display_order" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_vouchers" (
	"id" serial PRIMARY KEY NOT NULL,
	"voucher_id" integer NOT NULL,
	"customer_email" text,
	"room_number" text,
	"credits_used" numeric(10, 2) DEFAULT '0',
	"credits_remaining" numeric(10, 2) NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "establishments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"address" text,
	"phone" text,
	"email" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"max_delivery_distance" integer DEFAULT 100,
	"geo_fence_enabled" boolean DEFAULT false,
	"logo" text,
	"primary_color" text DEFAULT '#000000',
	"secondary_color" text DEFAULT '#ffffff',
	"currency" text DEFAULT 'EUR',
	"timezone" text DEFAULT 'Europe/Madrid',
	"default_language" text DEFAULT 'es' NOT NULL,
	"enabled_languages" jsonb DEFAULT '["es","en","de","fr","it","pt"]'::jsonb NOT NULL,
	"features" jsonb DEFAULT '{"geolocation":true,"onlinePayment":true,"splitBill":true,"ratings":true,"loyalty":false,"reservations":false,"callWaiter":true}'::jsonb,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "establishments_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "loyalty_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"establishment_id" integer NOT NULL,
	"session_id" uuid NOT NULL,
	"customer_email" text NOT NULL,
	"points" integer DEFAULT 0,
	"total_spent" numeric(10, 2) DEFAULT '0',
	"last_visit" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal_vouchers" (
	"id" serial PRIMARY KEY NOT NULL,
	"establishment_id" integer NOT NULL,
	"name" jsonb NOT NULL,
	"type" text NOT NULL,
	"credits_per_day" numeric(10, 2) NOT NULL,
	"valid_menus" jsonb DEFAULT '[]'::jsonb,
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"menu_id" integer NOT NULL,
	"day_of_week" integer NOT NULL,
	"open_time" text NOT NULL,
	"close_time" text NOT NULL,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "menus" (
	"id" serial PRIMARY KEY NOT NULL,
	"establishment_id" integer NOT NULL,
	"name" jsonb NOT NULL,
	"description" jsonb,
	"type" "menu_type" NOT NULL,
	"icon" text,
	"display_order" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modifiers" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"name" jsonb NOT NULL,
	"type" text NOT NULL,
	"price" numeric(10, 2) DEFAULT '0',
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"establishment_id" integer NOT NULL,
	"user_id" integer,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"data" jsonb,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"modifiers" jsonb DEFAULT '[]'::jsonb,
	"notes" text,
	"status" "order_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"table_id" integer NOT NULL,
	"establishment_id" integer NOT NULL,
	"order_number" text NOT NULL,
	"status" "order_status" DEFAULT 'pending',
	"subtotal" numeric(10, 2) NOT NULL,
	"tax" numeric(10, 2) DEFAULT '0',
	"tip" numeric(10, 2) DEFAULT '0',
	"total" numeric(10, 2) NOT NULL,
	"notes" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"estimated_time" integer,
	"accepted_by" integer,
	"accepted_at" timestamp,
	"delivered_by" integer,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"establishment_id" integer NOT NULL,
	"method" "payment_method" NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"display_name" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"establishment_id" integer NOT NULL,
	"bill_split_id" integer,
	"amount" numeric(10, 2) NOT NULL,
	"method" "payment_method" NOT NULL,
	"status" "payment_status" DEFAULT 'pending',
	"stripe_payment_intent_id" text,
	"transaction_id" text,
	"receipt_url" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "points_of_sale" (
	"id" serial PRIMARY KEY NOT NULL,
	"establishment_id" integer NOT NULL,
	"name" jsonb NOT NULL,
	"description" jsonb,
	"latitude" numeric(10, 7) NOT NULL,
	"longitude" numeric(10, 7) NOT NULL,
	"radius" integer DEFAULT 50,
	"menus" jsonb DEFAULT '[]'::jsonb,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"establishment_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"name" jsonb NOT NULL,
	"description" jsonb,
	"price" numeric(10, 2) NOT NULL,
	"image" text,
	"allergens" jsonb DEFAULT '[]'::jsonb,
	"dietary" jsonb DEFAULT '[]'::jsonb,
	"available" boolean DEFAULT true,
	"stock" integer,
	"preparation_time" integer DEFAULT 10,
	"display_order" integer DEFAULT 0,
	"featured" boolean DEFAULT false,
	"daily_special" boolean DEFAULT false,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"establishment_id" integer NOT NULL,
	"name" jsonb NOT NULL,
	"description" jsonb,
	"code" text,
	"discount_type" text NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"conditions" jsonb,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"usage_limit" integer,
	"usage_count" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"establishment_id" integer NOT NULL,
	"food_rating" integer NOT NULL,
	"service_rating" integer NOT NULL,
	"attention_rating" integer NOT NULL,
	"comment" text,
	"photos" jsonb DEFAULT '[]'::jsonb,
	"approved" boolean DEFAULT false,
	"moderated_by" integer,
	"moderated_at" timestamp,
	"response" text,
	"responded_by" integer,
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receipts" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"establishment_id" integer NOT NULL,
	"receipt_number" text NOT NULL,
	"pdf_url" text,
	"email_sent" boolean DEFAULT false,
	"total" numeric(10, 2) NOT NULL,
	"items" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "receipts_session_id_unique" UNIQUE("session_id"),
	CONSTRAINT "receipts_receipt_number_unique" UNIQUE("receipt_number")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_id" integer NOT NULL,
	"establishment_id" integer NOT NULL,
	"customer_name" text,
	"customer_email" text,
	"customer_phone" text,
	"room_number" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"device_id" text,
	"language" text DEFAULT 'es',
	"active" boolean DEFAULT true,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tables" (
	"id" serial PRIMARY KEY NOT NULL,
	"establishment_id" integer NOT NULL,
	"area_id" integer,
	"code" text NOT NULL,
	"qr_code" text,
	"capacity" integer DEFAULT 4,
	"status" "table_status" DEFAULT 'available',
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"floor" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tables_qr_code_unique" UNIQUE("qr_code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"establishment_id" integer NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"role" "user_role" NOT NULL,
	"phone" text,
	"avatar" text,
	"active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "waiter_calls" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"table_id" integer NOT NULL,
	"establishment_id" integer NOT NULL,
	"type" text NOT NULL,
	"message" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"status" text DEFAULT 'pending',
	"acknowledged_by" integer,
	"acknowledged_at" timestamp,
	"resolved_by" integer,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bill_splits" ADD CONSTRAINT "bill_splits_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_vouchers" ADD CONSTRAINT "customer_vouchers_voucher_id_meal_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."meal_vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_points" ADD CONSTRAINT "loyalty_points_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_points" ADD CONSTRAINT "loyalty_points_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_vouchers" ADD CONSTRAINT "meal_vouchers_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_schedules" ADD CONSTRAINT "menu_schedules_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menus" ADD CONSTRAINT "menus_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modifiers" ADD CONSTRAINT "modifiers_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_accepted_by_users_id_fk" FOREIGN KEY ("accepted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivered_by_users_id_fk" FOREIGN KEY ("delivered_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_bill_split_id_bill_splits_id_fk" FOREIGN KEY ("bill_split_id") REFERENCES "public"."bill_splits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_of_sale" ADD CONSTRAINT "points_of_sale_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_moderated_by_users_id_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_responded_by_users_id_fk" FOREIGN KEY ("responded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tables" ADD CONSTRAINT "tables_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tables" ADD CONSTRAINT "tables_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiter_calls" ADD CONSTRAINT "waiter_calls_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiter_calls" ADD CONSTRAINT "waiter_calls_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiter_calls" ADD CONSTRAINT "waiter_calls_establishment_id_establishments_id_fk" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiter_calls" ADD CONSTRAINT "waiter_calls_acknowledged_by_users_id_fk" FOREIGN KEY ("acknowledged_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiter_calls" ADD CONSTRAINT "waiter_calls_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "payment_methods_establishment_method_unique" ON "payment_methods" USING btree ("establishment_id","method");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_active_table_unique" ON "sessions" USING btree ("establishment_id","table_id") WHERE "sessions"."active" = true AND "sessions"."closed_at" IS NULL;