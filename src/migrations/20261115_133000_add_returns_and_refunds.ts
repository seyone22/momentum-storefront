import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_orders_payment_status" ADD VALUE IF NOT EXISTS 'partially_refunded';

    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "payments_lk_checkout_id" varchar;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "payments_lk_payment_id" varchar;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "refunded_lkr" numeric DEFAULT 0;

    CREATE TYPE "public"."enum_returns_type" AS ENUM('size_exchange', 'defective_replacement', 'refund_claim');
    CREATE TYPE "public"."enum_returns_status" AS ENUM('requested', 'approved', 'pickup_scheduled', 'received_inspecting', 'completed', 'rejected');
    CREATE TYPE "public"."enum_returns_refund_status" AS ENUM('none', 'pending', 'succeeded', 'failed', 'canceled', 'manual_bank_transfer');

    CREATE TABLE "returns" (
      "id" serial PRIMARY KEY NOT NULL,
      "rma_number" varchar NOT NULL,
      "order_id" integer NOT NULL,
      "type" "enum_returns_type" DEFAULT 'size_exchange' NOT NULL,
      "status" "enum_returns_status" DEFAULT 'requested' NOT NULL,
      "customer_name" varchar NOT NULL,
      "customer_phone" varchar NOT NULL,
      "customer_email" varchar,
      "reason" varchar,
      "pickup_tracking_number" varchar,
      "inspection_notes" varchar,
      "restock_on_complete" boolean DEFAULT false,
      "restocked" boolean DEFAULT false,
      "refund_amount_lkr" numeric DEFAULT 0,
      "refund_status" "enum_returns_refund_status" DEFAULT 'none',
      "payments_lk_refund_id" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "returns_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "product_id" varchar,
      "product_name" varchar NOT NULL,
      "size" varchar NOT NULL,
      "exchange_size" varchar,
      "quantity" numeric DEFAULT 1 NOT NULL,
      "unit_price_lkr" numeric NOT NULL
    );

    CREATE TABLE "returns_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "media_id" integer
    );

    ALTER TABLE "returns" ADD CONSTRAINT "returns_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "returns_items" ADD CONSTRAINT "returns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "returns_rels" ADD CONSTRAINT "returns_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "returns_rels" ADD CONSTRAINT "returns_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX "returns_rma_number_idx" ON "returns" USING btree ("rma_number");
    CREATE INDEX "returns_order_idx" ON "returns" USING btree ("order_id");
    CREATE INDEX "returns_updated_at_idx" ON "returns" USING btree ("updated_at");
    CREATE INDEX "returns_created_at_idx" ON "returns" USING btree ("created_at");

    CREATE INDEX "returns_items_order_idx" ON "returns_items" USING btree ("_order");
    CREATE INDEX "returns_items_parent_id_idx" ON "returns_items" USING btree ("_parent_id");

    CREATE INDEX "returns_rels_order_idx" ON "returns_rels" USING btree ("order");
    CREATE INDEX "returns_rels_parent_idx" ON "returns_rels" USING btree ("parent_id");
    CREATE INDEX "returns_rels_path_idx" ON "returns_rels" USING btree ("path");
    CREATE INDEX "returns_rels_media_id_idx" ON "returns_rels" USING btree ("media_id");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "returns_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_returns_fk" FOREIGN KEY ("returns_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_returns_id_idx" ON "payload_locked_documents_rels" USING btree ("returns_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_returns_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_returns_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "returns_id";

    DROP TABLE IF EXISTS "returns_rels" CASCADE;
    DROP TABLE IF EXISTS "returns_items" CASCADE;
    DROP TABLE IF EXISTS "returns" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_returns_refund_status";
    DROP TYPE IF EXISTS "public"."enum_returns_status";
    DROP TYPE IF EXISTS "public"."enum_returns_type";

    ALTER TABLE "orders" DROP COLUMN IF EXISTS "refunded_lkr";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "payments_lk_payment_id";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "payments_lk_checkout_id";
  `)
}
