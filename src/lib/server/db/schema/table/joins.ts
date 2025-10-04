import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { genres, tables } from './tables';

export const tablesToGenres = sqliteTable(
  'tables_to_genres',
  {
    tableId: text('table_id')
      .notNull()
      .references(() => tables.id),
    genreId: text('genre_id')
      .notNull()
      .references(() => genres.id),
  },
  t => [primaryKey({ columns: [t.tableId, t.genreId] })],
);
