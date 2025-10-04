import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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

export const genres = sqliteTable('genres', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});
