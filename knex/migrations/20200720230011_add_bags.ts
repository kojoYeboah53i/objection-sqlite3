import { Knex } from 'knex';
import { Bag } from '../../src/models';

export const up = (knex: Knex): Promise<void> =>
  knex.schema.createTable(Bag.tableName, (table: Knex.TableBuilder) => {
    table.increments();
    table.timestamps();
    table.integer('volume');
    table.integer('payloadVolume');
    table.integer('availableVolume');
    table.string('title');
  });

export const down = (knex: Knex): Promise<void> =>
  knex.schema.dropTable(Bag.tableName);
