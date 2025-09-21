import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tables = sqliteTable('tables', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  systemId: text('system_id')
    .notNull()
    .references(() => systems.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const systems = sqliteTable('systems', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
});

export const systemsRelations = relations(systems, ({ many }) => ({
  tables: many(tables),
}));

export const tablesRelations = relations(tables, ({ many, one }) => ({
  tablesToGenres: many(tablesToGenres),
  system: one(systems, {
    fields: [tables.systemId],
    references: [systems.id],
  }),
}));

export const genres = sqliteTable('genres', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const genresRelations = relations(genres, ({ many }) => ({
  tablesToGenres: many(tablesToGenres),
}));

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
