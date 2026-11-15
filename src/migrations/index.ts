import * as migration_20261115_122423_init from './20261115_122423_init';
import * as migration_20261115_123643_add_media_and_product_fields from './20261115_123643_add_media_and_product_fields';
import * as migration_20261115_124439_add_order_items from './20261115_124439_add_order_items';
import * as migration_20261115_131200_add_media_s3_objectkey from './20261115_131200_add_media_s3_objectkey';

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
];
