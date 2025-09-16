import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { dices } from './roll';
import { powerProficiencyRequirements } from './power';

// -------------------- tables --------------------

export const weapons = sqliteTable('weapons', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  dieName: text('die_name')
    .notNull()
    .references(() => dices.name),
  diceCount: integer('dice_count').notNull().default(1),
  criticalMargin: integer('critical_margin').notNull().default(0),
  threat: integer('threat').notNull().default(2),
  damageTypeName: text('damage_type_name')
    .notNull()
    .references(() => damageTypes.name),
  proficiencyName: text('proficiency_name')
    .notNull()
    .references(() => proficiencies.name),
});

export const weaponsExtras = sqliteTable('weapons_extras', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  attackBonus: integer('attack_bonus'),
  damageBonus: integer('damage_bonus'),
  criticalMargin: integer('critical_margin'),
  threat: integer('threat'),
});

export const damageTypes = sqliteTable('damage_types', {
  name: text('name').primaryKey(),
  description: text('description').notNull(),
});

export const proficiencies = sqliteTable('proficiencies', {
  name: text('name').primaryKey(),
  description: text('description').notNull(),
});

export const proficiencyLevels = sqliteTable('proficiency_levels', {
  level: text('level').primaryKey(),
  cost: integer('cost').notNull(),
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
  weaponsExtrasLinks: many(weaponsToWeaponsExtras),
  damageType: one(damageTypes, {
    fields: [weapons.damageTypeName],
    references: [damageTypes.name],
  }),
  die: one(dices, {
    fields: [weapons.dieName],
    references: [dices.name],
  }),
  proficiency: one(proficiencies, {
    fields: [weapons.proficiencyName],
    references: [proficiencies.name],
  }),
}));

export const weaponsExtrasRelations = relations(weaponsExtras, ({ many }) => ({
  weaponsLinks: many(weaponsToWeaponsExtras),
}));

export const damageTypesRelations = relations(damageTypes, ({ many }) => ({
  weapons: many(weapons),
}));

export const proficienciesRelations = relations(proficiencies, ({ many }) => ({
  weapons: many(weapons),
  powerProficiencyRequirements: many(powerProficiencyRequirements),
}));

export const proficiencyLevelsRelations = relations(proficiencyLevels, ({ many }) => ({
  powerProficiencyRequirements: many(powerProficiencyRequirements),
}));

export const weaponsToWeaponsExtrasRelations = relations(weaponsToWeaponsExtras, ({ one }) => ({
  weapon: one(weapons, {
    fields: [weaponsToWeaponsExtras.weaponsId],
    references: [weapons.id],
  }),
  weaponExtra: one(weaponsExtras, {
    fields: [weaponsToWeaponsExtras.weaponsExtrasId],
    references: [weaponsExtras.id],
  }),
}));
