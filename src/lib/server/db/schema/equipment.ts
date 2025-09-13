import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { dices } from './roll';

// -------------------- tables --------------------

export const weapons = sqliteTable('weapons', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  die: text('die').notNull(),
  diceCount: integer('dice_count').notNull().default(1),
  criticalMargin: integer('critical_margin').notNull().default(0),
  threat: integer('threat').notNull().default(2),
  damageType: text('damage_type').notNull(),
  proficiency: text('proficiency').notNull(),
});

export const weaponsExtras = sqliteTable('weapons_extras', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  attackBonus: integer('attack_bonus'),
  damageBonus: integer('damage_bonus'),
  criticalMargin: integer('critical_margin'),
  threat: integer('threat'),
});

export const damageTypes = sqliteTable('damage_types', {
  name: text('name').primaryKey().notNull(),
  description: text('description').notNull(),
});

export const proficiencies = sqliteTable('proficiencies', {
  name: text('name').primaryKey().notNull(),
  description: text('description').notNull(),
  credits: integer('credits'),
});

export const weaponsToWeaponsExtras = sqliteTable(
  'weapons_to_weapons_extras',
  {
    weaponsId: text('weapons_id')
      .notNull()
      .references(() => weapons.id),
    weaponsExtrasId: text('weapons_extras_id')
      .notNull()
      .references(() => weaponsExtras.id),
  },
  t => [primaryKey({ columns: [t.weaponsId, t.weaponsExtrasId] })],
);

// -------------------- relations --------------------

export const weaponsRelations = relations(weapons, ({ many, one }) => ({
  weaponsToWeaponsExtras: many(weaponsToWeaponsExtras),
  damageType: one(damageTypes, {
    fields: [weapons.damageType],
    references: [damageTypes.name],
  }),
  die: one(dices, {
    fields: [weapons.die],
    references: [dices.name],
  }),
  proficiency: one(proficiencies, {
    fields: [weapons.proficiency],
    references: [proficiencies.name],
  }),
}));

export const weaponsExtrasRelations = relations(weaponsExtras, ({ many }) => ({
  weaponsToWeaponsExtras: many(weaponsToWeaponsExtras),
}));

export const damageTypesRelations = relations(damageTypes, ({ many }) => ({
  weapons: many(weapons),
}));

export const proficienciesRelations = relations(proficiencies, ({ many }) => ({
  weapons: many(weapons),
}));
