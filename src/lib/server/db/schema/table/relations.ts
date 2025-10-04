import { relations } from 'drizzle-orm';
import { genres, systems, tables } from './tables';
import { tablesToGenres } from './joins';

export const systemsRelations = relations(systems, ({ many }) => ({
  tables: many(tables),
}));

export const tablesRelations = relations(tables, ({ many, one }) => ({
  genresLinks: many(tablesToGenres),
  system: one(systems, {
    fields: [tables.systemId],
    references: [systems.id],
  }),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  tablesLinks: many(tablesToGenres),
}));

export const tablesToGenresRelations = relations(tablesToGenres, ({ one }) => ({
  table: one(tables, {
    fields: [tablesToGenres.tableId],
    references: [tables.id],
  }),
  genre: one(genres, {
    fields: [tablesToGenres.genreId],
    references: [genres.id],
  }),
}));
