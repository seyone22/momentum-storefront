import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "capi_purchase_sent" boolean DEFAULT false;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "capi_purchase_event_id" varchar;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_store_settings_catalog_availability_mode" AS ENUM('in stock', 'available for order');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "store_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "catalog_availability_mode" "enum_store_settings_catalog_availability_mode" DEFAULT 'in stock' NOT NULL,
      "meta_pixel_id" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "store_settings" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_store_settings_catalog_availability_mode";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "capi_purchase_event_id";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "capi_purchase_sent";
  `)
}
