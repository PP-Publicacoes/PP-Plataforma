import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { powerAffinityRequirements } from './power';

export const hauntings = sqliteTable('hauntings', {
  name: text('name').primaryKey(),
  description: text('description').notNull(),
});

export const affinityLevels = sqliteTable('affinity_levels', {
  level: text('level').primaryKey(),
  value: integer('value'),
});

export const hauntingsRelations = relations(hauntings, ({ many }) => ({
  powerAffinityRequirements: many(powerAffinityRequirements),
}));

export const affinityLevelsRelations = relations(affinityLevels, ({ many }) => ({
  powerAffinityRequirements: many(powerAffinityRequirements),
}));
