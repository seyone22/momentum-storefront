import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "shipping_enabled" boolean DEFAULT false;
    ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "colombo_shipping_lkr" numeric DEFAULT 350;
    ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "outstation_shipping_lkr" numeric DEFAULT 550;
    ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "free_shipping_threshold_lkr" numeric DEFAULT 0;
    ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "extra_piece_threshold" numeric DEFAULT 2;
    ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "extra_piece_surcharge_lkr" numeric DEFAULT 150;

    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "subtotal_lkr" numeric;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_lkr" numeric DEFAULT 0;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_audit_logs_entity_type" AS ENUM(
        'order', 'product', 'return', 'customer', 'user', 'store-settings', 'media', 'webhook', 'tracking'
      );
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_audit_logs_actor_type" AS ENUM(
        'admin', 'customer', 'system', 'webhook', 'guest'
      );
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_audit_logs_status" AS ENUM(
        'success', 'failure', 'skipped'
      );
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE IF NOT EXISTS "audit_logs" (
      "id" serial PRIMARY KEY NOT NULL,
      "action" varchar NOT NULL,
      "entity_type" "public"."enum_audit_logs_entity_type" NOT NULL,
      "entity_id" varchar,
      "entity_ref" varchar,
      "actor_type" "public"."enum_audit_logs_actor_type" DEFAULT 'system',
      "actor_id" varchar,
      "actor_email" varchar,
      "ip_address" varchar,
      "user_agent" varchar,
      "status" "public"."enum_audit_logs_status" DEFAULT 'success',
      "summary" varchar NOT NULL,
      "metadata" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs" USING btree ("action");
    CREATE INDEX IF NOT EXISTS "audit_logs_entity_type_idx" ON "audit_logs" USING btree ("entity_type");
    CREATE INDEX IF NOT EXISTS "audit_logs_entity_ref_idx" ON "audit_logs" USING btree ("entity_ref");
    CREATE INDEX IF NOT EXISTS "audit_logs_actor_email_idx" ON "audit_logs" USING btree ("actor_email");
    CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "audit_logs" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_audit_logs_entity_type";
    DROP TYPE IF EXISTS "public"."enum_audit_logs_actor_type";
    DROP TYPE IF EXISTS "public"."enum_audit_logs_status";

    ALTER TABLE "orders" DROP COLUMN IF EXISTS "subtotal_lkr";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_lkr";

    ALTER TABLE "store_settings" DROP COLUMN IF EXISTS "shipping_enabled";
    ALTER TABLE "store_settings" DROP COLUMN IF EXISTS "colombo_shipping_lkr";
    ALTER TABLE "store_settings" DROP COLUMN IF EXISTS "outstation_shipping_lkr";
    ALTER TABLE "store_settings" DROP COLUMN IF EXISTS "free_shipping_threshold_lkr";
    ALTER TABLE "store_settings" DROP COLUMN IF EXISTS "extra_piece_threshold";
    ALTER TABLE "store_settings" DROP COLUMN IF EXISTS "extra_piece_surcharge_lkr";
  `);
}
