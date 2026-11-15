import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "district" varchar;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "postal_code" varchar;
    ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "marketing_email_opt_in" boolean DEFAULT false;

    ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "default_district" varchar;
    ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "default_postal_code" varchar;
    ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "marketing_email_opt_in" boolean DEFAULT false;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "district";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "postal_code";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "marketing_email_opt_in";

    ALTER TABLE "customers" DROP COLUMN IF EXISTS "default_district";
    ALTER TABLE "customers" DROP COLUMN IF EXISTS "default_postal_code";
    ALTER TABLE "customers" DROP COLUMN IF EXISTS "marketing_email_opt_in";
  `);
}
