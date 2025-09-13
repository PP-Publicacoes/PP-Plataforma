import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const hauntings = sqliteTable('hauntings', {
  name: text('name').primaryKey().notNull(),
  description: text('description').notNull(),
});
