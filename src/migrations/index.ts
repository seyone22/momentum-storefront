import * as migration_20261115_122423_init from './20261115_122423_init';

export const migrations = [
  {
    up: migration_20261115_122423_init.up,
    down: migration_20261115_122423_init.down,
    name: '20261115_122423_init'
  },
];
