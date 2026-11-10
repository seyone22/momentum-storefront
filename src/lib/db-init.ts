import { Pool } from 'pg';

let initialized = false;

export async function ensurePayloadTables() {
  if (initialized) return;

  const connectionString = process.env.DATABASE_URI || process.env.POSTGRES_URL;
  if (!connectionString) {
    console.warn("No DATABASE_URI provided for table initialization.");
    return;
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    try {
      // 1. Users Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" serial PRIMARY KEY,
          "name" varchar,
          "email" varchar NOT NULL UNIQUE,
          "reset_password_token" varchar,
          "reset_password_expiration" timestamp with time zone,
          "salt" varchar,
          "hash" varchar,
          "login_attempts" numeric DEFAULT 0,
          "lock_until" timestamp with time zone,
          "created_at" timestamp with time zone DEFAULT now() NOT NULL,
          "updated_at" timestamp with time zone DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "users_sessions" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
          "id" varchar PRIMARY KEY,
          "created_at" timestamp with time zone DEFAULT now(),
          "expires_at" timestamp with time zone
        );

        -- 2. Products Table
        CREATE TABLE IF NOT EXISTS "products" (
          "id" serial PRIMARY KEY,
          "name" varchar NOT NULL,
          "slug" varchar NOT NULL UNIQUE,
          "category" varchar DEFAULT 'Specialty Denim',
          "price_lkr" numeric NOT NULL,
          "pre_order_batch_cap" numeric DEFAULT 100,
          "description" text,
          "fabric" varchar,
          "created_at" timestamp with time zone DEFAULT now() NOT NULL,
          "updated_at" timestamp with time zone DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "products_variants" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
          "id" varchar PRIMARY KEY,
          "size" varchar NOT NULL,
          "sku" varchar NOT NULL,
          "stock_cap" numeric DEFAULT 20,
          "sold" numeric DEFAULT 0
        );

        -- 3. Orders Table
        CREATE TABLE IF NOT EXISTS "orders" (
          "id" serial PRIMARY KEY,
          "order_number" varchar NOT NULL UNIQUE,
          "customer_name" varchar NOT NULL,
          "customer_phone" varchar NOT NULL,
          "customer_email" varchar,
          "shipping_address" varchar NOT NULL,
          "city" varchar NOT NULL,
          "total_lkr" numeric NOT NULL,
          "payment_rail" varchar DEFAULT 'Payments.lk',
          "payment_status" varchar DEFAULT 'pending',
          "fulfillment_status" varchar DEFAULT 'pre_order_placed',
          "prompt_tracking_number" varchar,
          "created_at" timestamp with time zone DEFAULT now() NOT NULL,
          "updated_at" timestamp with time zone DEFAULT now() NOT NULL
        );

        -- 4. Payload Internal Migrations tracking
        CREATE TABLE IF NOT EXISTS "payload_migrations" (
          "id" serial PRIMARY KEY,
          "name" varchar,
          "batch" numeric,
          "created_at" timestamp with time zone DEFAULT now() NOT NULL,
          "updated_at" timestamp with time zone DEFAULT now() NOT NULL
        );
      `);

      initialized = true;
      console.log("PostgreSQL schema tables verified and ready for Payload CMS.");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("PostgreSQL table init error:", err);
  } finally {
    await pool.end();
  }
}
