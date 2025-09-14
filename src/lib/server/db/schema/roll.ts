import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const dices = sqliteTable('dices', {
  name: text('name').primaryKey(),
  faces: integer('faces').notNull(),
});
