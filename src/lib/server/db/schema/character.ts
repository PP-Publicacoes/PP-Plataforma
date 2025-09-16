import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { users } from './auth';
import { powers } from './power';

// -------------------- tables --------------------

export const attributes = sqliteTable('attributes', {
  name: text('name').primaryKey(),
  description: text('description').notNull(),
});

export const statuses = sqliteTable('statuses', {
  name: text('name').primaryKey(),
  description: text('description').notNull(),
});

export const skillLevels = sqliteTable('skill_levels', {
  level: text('level').primaryKey(),
  bonus: integer('bonus').notNull(),
});

export const ranks = sqliteTable('ranks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  proficiencyCredits: integer('proficiency_credits').notNull(),
});

export const characters = sqliteTable('characters', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),

  rankId: text('rank_id')
    .notNull()
    .references(() => ranks.id),

  loadCapacity: integer('load_capacity').notNull(),
  defense: integer('defense').notNull(),
});

// yes, we use rigid fields because, although there is an attribute dedicated table, it'll make things easier
export const attributesSheet = sqliteTable('attributes_sheet', {
  id: text('id').primaryKey(),
  characterId: text('character_id')
    .notNull()
    .references(() => characters.id),
  strength: integer('strength').notNull(),
  dexterity: integer('dexterity').notNull(),
  attention: integer('attention').notNull(),
  study: integer('study').notNull(),
  spirit: integer('spirit').notNull(),
  charisma: integer('charisma').notNull(),
});

// same
export const statusSheet = sqliteTable('status_sheet', {
  id: text('id').primaryKey(),
  characterId: text('character_id')
    .notNull()
    .references(() => characters.id),
  hp: integer('hp').notNull(),
  hope: integer('hope').notNull(),
  level: integer('level').notNull(),
  fear: integer('fear').notNull(),
});

export const skills = sqliteTable('skills', {
  name: text('name').primaryKey(),
  description: text('description').notNull(),
  attributeName: text('attribute_name')
    .notNull()
    .references(() => attributes.name),
  loadPenalty: integer('load_penalty', { mode: 'boolean' }).notNull().default(false),
  trainedOnly: integer('trained_only', { mode: 'boolean' }).notNull().default(false),
});

export const skillBonuses = sqliteTable('skill_bonuses', {
  id: text('id').primaryKey(),
  skillName: text('skill_name')
    .notNull()
    .references(() => skills.name),
  skillLevel: text('skill_level').references(() => skillLevels.level),
  other: integer('other'),
});

// -------------------- join tables --------------------

export const charactersToSkillBonuses = sqliteTable(
  'characters_to_skill_bonus',
  {
    characterId: text('character_id')
      .notNull()
      .references(() => characters.id),
    skillBonusId: text('skill_bonus_id')
      .notNull()
      .references(() => skillBonuses.id),
  },
  t => [primaryKey({ columns: [t.characterId, t.skillBonusId] })],
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

export const skillLevelsRelations = relations(skillLevels, ({ many }) => ({
  skillBonuses: many(skillBonuses),
}));

export const attributesSheetRelations = relations(attributesSheet, ({ one }) => ({
  character: one(characters, {
    fields: [attributesSheet.characterId],
    references: [characters.id],
  }),
}));

export const statusSheetRelations = relations(statusSheet, ({ one }) => ({
  character: one(characters, {
    fields: [statusSheet.characterId],
    references: [characters.id],
  }),
}));

export const ranksRelations = relations(ranks, ({ many }) => ({
  characters: many(characters),
}));

export const charactersRelations = relations(characters, ({ many, one }) => ({
  user: one(users, {
    fields: [characters.userId],
    references: [users.id],
  }),
  attributesSheet: one(attributesSheet),
  statusSheet: one(statusSheet),
  rank: one(ranks, {
    fields: [characters.rankId],
    references: [ranks.id],
  }),
  skillBonusesLinks: many(charactersToSkillBonuses),
  powersLinks: many(charactersToPowers),
}));

export const skillsRelations = relations(skills, ({ many, one }) => ({
  charactersLinks: many(charactersToSkillBonuses),
  skillBonuses: many(skillBonuses),
  attribute: one(attributes, {
    fields: [skills.attributeName],
    references: [attributes.name],
  }),
}));

export const skillBonusesRelations = relations(skillBonuses, ({ many, one }) => ({
  skill: one(skills, {
    fields: [skillBonuses.skillName],
    references: [skills.name],
  }),
  skillLevel: one(skillLevels, {
    fields: [skillBonuses.skillLevel],
    references: [skillLevels.level],
  }),
  charactersLinks: many(charactersToSkillBonuses),
}));

export const charactersToSkillBonusRelations = relations(charactersToSkillBonuses, ({ one }) => ({
  character: one(characters, {
    fields: [charactersToSkillBonuses.characterId],
    references: [characters.id],
  }),
  skillBonus: one(skillBonuses, {
    fields: [charactersToSkillBonuses.skillBonusId],
    references: [skillBonuses.id],
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
