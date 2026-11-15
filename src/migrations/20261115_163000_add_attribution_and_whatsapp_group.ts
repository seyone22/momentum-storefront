import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "utm_source" varchar;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "utm_medium" varchar;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "utm_campaign" varchar;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "utm_content" varchar;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "utm_term" varchar;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "fbclid" varchar;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "fbp" varchar;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "fbc" varchar;

    ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "whatsapp_group_invite_url" varchar;
    ALTER TABLE "store_settings" ADD COLUMN IF NOT EXISTS "whatsapp_group_cta_text" varchar DEFAULT 'Join Momentum Drop Updates on WhatsApp';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "utm_source";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "utm_medium";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "utm_campaign";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "utm_content";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "utm_term";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "fbclid";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "fbp";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "fbc";

    ALTER TABLE "store_settings" DROP COLUMN IF EXISTS "whatsapp_group_invite_url";
    ALTER TABLE "store_settings" DROP COLUMN IF EXISTS "whatsapp_group_cta_text";
  `);
}
