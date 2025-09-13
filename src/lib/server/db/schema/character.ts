import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { users } from './auth';
import { Patente } from '../../../enums/character/patent';
import { valuesToTuple } from '../../../utils/enum-utils';
import { powers } from './power';

// -------------------- tables --------------------

export const attributes = sqliteTable('attributes', {
  name: text('name').primaryKey().notNull(),
  description: text('description').notNull(),
});

export const skillTrainings = sqliteTable('skill_training', {
  name: text('name').primaryKey().notNull(),
  bonus: integer('bonus').notNull(),
});

export const attributesSheet = sqliteTable('attributes_sheet', {
  id: text('id').primaryKey().notNull(),
  physical: integer('physical').notNull(),
  dexterity: integer('dexterity').notNull(),
  charisma: integer('charisma').notNull(),
  lore: integer('lore').notNull(),
  reasoning: integer('reasoning').notNull(),
  wisdom: integer('wisdom').notNull(),
});

export const status = sqliteTable('status', {
  id: text('id').primaryKey().notNull(),
  hp: integer('hp').notNull(),
  hope: integer('hope').notNull(),
  level: integer('level').notNull(),
  fear: integer('fear').notNull(),
});

export const characters = sqliteTable('characters', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),

  attributesSheetId: text('attributes_sheet_id')
    .notNull()
    .references(() => attributesSheet.id),
  statusSheetId: text('status_sheet_id')
    .notNull()
    .references(() => status.id),

  rank: text('rank', { enum: valuesToTuple(Patente) }).notNull(),

  encumbrance: integer('encumbrance').notNull(),
  defense: integer('defense').notNull(),
});

export const skills = sqliteTable('skills', {
  name: text('name').primaryKey().notNull(),
  description: text('description').notNull(),
  attribute: text('attribute').notNull(),
  loadPenalty: integer('load_penalty', { mode: 'boolean' }).notNull().default(false),
  trainedOnly: integer('trained_only', { mode: 'boolean' }).notNull().default(false),
});

export const bonusSkills = sqliteTable('bonus_skills', {
  id: text('id').primaryKey(),
  skillName: text('skillName').notNull(),
  // dynamic column names from equipment enum kept as-is:
  // [TipoEquipamento.utensilio]: integer(String(TipoEquipamento.utensilio)),
  // [TipoEquipamento.vestimenta]: integer(String(TipoEquipamento.vestimenta)),
  training: text('training'),
  other: integer('other'),
});

// -------------------- join tables --------------------

export const charactersToSkills = sqliteTable(
  'characters_to_skills',
  {
    characterId: text('character_id')
      .notNull()
      .references(() => characters.id),
    skillName: text('skill_name')
      .notNull()
      .references(() => skills.name),
  },
  t => [primaryKey({ columns: [t.characterId, t.skillName] })],
);

export const charactersToPowers = sqliteTable(
  'characters_to_powers',
  {
    characterId: text('character_id')
      .notNull()
      .references(() => characters.id),
    powerId: text('power_id')
      .notNull()
      .references(() => powers.id),
  },
  t => [primaryKey({ columns: [t.characterId, t.powerId] })],
);

// -------------------- relations --------------------

export const attributesRelations = relations(attributes, ({ many }) => ({
  skills: many(skills),
}));

export const skillTrainingsRelations = relations(skillTrainings, ({ many }) => ({
  bonusSkills: many(bonusSkills),
}));

export const attributesSheetRelations = relations(attributesSheet, ({ many }) => ({
  characters: many(characters),
}));

export const statusRelations = relations(status, ({ many }) => ({
  characters: many(characters),
}));

export const charactersRelations = relations(characters, ({ many, one }) => ({
  user: one(users, {
    fields: [characters.userId],
    references: [users.id],
  }),
  attributesSheet: one(attributesSheet, {
    fields: [characters.attributesSheetId],
    references: [attributesSheet.id],
  }),
  status: one(status, {
    fields: [characters.statusSheetId],
    references: [status.id],
  }),
  charactersToSkills: many(charactersToSkills),
  charactersToPowers: many(charactersToPowers),
}));

export const skillsRelations = relations(skills, ({ many, one }) => ({
  charactersToSkills: many(charactersToSkills),
  bonus: many(bonusSkills),
  attribute: one(attributes, {
    fields: [skills.attribute],
    references: [attributes.name],
  }),
}));

export const bonusSkillsRelations = relations(bonusSkills, ({ one }) => ({
  skill: one(skills, {
    fields: [bonusSkills.skillName],
    references: [skills.name],
  }),
  trainingLevel: one(skillTrainings, {
    fields: [bonusSkills.training],
    references: [skillTrainings.name],
  }),
}));

export const charactersToSkillsRelations = relations(charactersToSkills, ({ one }) => ({
  character: one(characters, {
    fields: [charactersToSkills.characterId],
    references: [characters.id],
  }),
  skill: one(skills, {
    fields: [charactersToSkills.skillName],
    references: [skills.name],
  }),
}));

export const charactersToPowersRelations = relations(charactersToPowers, ({ one }) => ({
  character: one(characters, {
    fields: [charactersToPowers.characterId],
    references: [characters.id],
  }),
  power: one(powers, {
    fields: [charactersToPowers.powerId],
    references: [powers.id],
  }),
}));
