import * as migration_20261115_122423_init from './20261115_122423_init';
import * as migration_20261115_123643_add_media_and_product_fields from './20261115_123643_add_media_and_product_fields';

export const migrations = [
  {
    up: migration_20261115_122423_init.up,
    down: migration_20261115_122423_init.down,
    name: '20261115_122423_init',
  },
  {
    up: migration_20261115_123643_add_media_and_product_fields.up,
    down: migration_20261115_123643_add_media_and_product_fields.down,
    name: '20261115_123643_add_media_and_product_fields'
  },
];
