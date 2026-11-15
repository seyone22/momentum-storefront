import * as migration_20261115_122423_init from './20261115_122423_init';
import * as migration_20261115_123643_add_media_and_product_fields from './20261115_123643_add_media_and_product_fields';
import * as migration_20261115_124439_add_order_items from './20261115_124439_add_order_items';
import * as migration_20261115_131200_add_media_s3_objectkey from './20261115_131200_add_media_s3_objectkey';
import * as migration_20261115_133000_add_returns_and_refunds from './20261115_133000_add_returns_and_refunds';
import * as migration_20261115_135000_add_order_payment_link from './20261115_135000_add_order_payment_link';
import * as migration_20261115_141000_add_order_capi_and_store_settings from './20261115_141000_add_order_capi_and_store_settings';
import * as migration_20261115_163000_add_attribution_and_whatsapp_group from './20261115_163000_add_attribution_and_whatsapp_group';
import * as migration_20261115_170000_add_customers_collection from './20261115_170000_add_customers_collection';
import * as migration_20261115_173000_add_district_zip_marketing from './20261115_173000_add_district_zip_marketing';
import * as migration_20261115_180000_add_shipping_and_audit_logs from './20261115_180000_add_shipping_and_audit_logs';
import * as migration_20261115_182000_add_audit_logs_locked_rel from './20261115_182000_add_audit_logs_locked_rel';
import * as migration_20261115_183000_add_customers_preferences_rel from './20261115_183000_add_customers_preferences_rel';

export const migrations = [
  {
    up: migration_20261115_122423_init.up,
    down: migration_20261115_122423_init.down,
    name: '20261115_122423_init',
  },
  {
    up: migration_20261115_123643_add_media_and_product_fields.up,
    down: migration_20261115_123643_add_media_and_product_fields.down,
    name: '20261115_123643_add_media_and_product_fields',
  },
  {
    up: migration_20261115_124439_add_order_items.up,
    down: migration_20261115_124439_add_order_items.down,
    name: '20261115_124439_add_order_items'
  },
  {
    up: migration_20261115_131200_add_media_s3_objectkey.up,
    down: migration_20261115_131200_add_media_s3_objectkey.down,
    name: '20261115_131200_add_media_s3_objectkey',
  },
  {
    up: migration_20261115_133000_add_returns_and_refunds.up,
    down: migration_20261115_133000_add_returns_and_refunds.down,
    name: '20261115_133000_add_returns_and_refunds',
  },
  {
    up: migration_20261115_135000_add_order_payment_link.up,
    down: migration_20261115_135000_add_order_payment_link.down,
    name: '20261115_135000_add_order_payment_link',
  },
  {
    up: migration_20261115_141000_add_order_capi_and_store_settings.up,
    down: migration_20261115_141000_add_order_capi_and_store_settings.down,
    name: '20261115_141000_add_order_capi_and_store_settings',
  },
  {
    up: migration_20261115_163000_add_attribution_and_whatsapp_group.up,
    down: migration_20261115_163000_add_attribution_and_whatsapp_group.down,
    name: '20261115_163000_add_attribution_and_whatsapp_group',
  },
  {
    up: migration_20261115_170000_add_customers_collection.up,
    down: migration_20261115_170000_add_customers_collection.down,
    name: '20261115_170000_add_customers_collection',
  },
  {
    up: migration_20261115_173000_add_district_zip_marketing.up,
    down: migration_20261115_173000_add_district_zip_marketing.down,
    name: '20261115_173000_add_district_zip_marketing',
  },
  {
    up: migration_20261115_180000_add_shipping_and_audit_logs.up,
    down: migration_20261115_180000_add_shipping_and_audit_logs.down,
    name: '20261115_180000_add_shipping_and_audit_logs',
  },
  {
    up: migration_20261115_182000_add_audit_logs_locked_rel.up,
    down: migration_20261115_182000_add_audit_logs_locked_rel.down,
    name: '20261115_182000_add_audit_logs_locked_rel',
  },
  {
    up: migration_20261115_183000_add_customers_preferences_rel.up,
    down: migration_20261115_183000_add_customers_preferences_rel.down,
    name: '20261115_183000_add_customers_preferences_rel',
  },
];
