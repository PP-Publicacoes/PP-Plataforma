import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { attributes, skillLevels, skills } from './character';
import { damageTypes, proficiencies, proficiencyLevels } from '../system/equipment';
import { affinityLevels, hauntings } from './fear';

// -------------------- tables --------------------

export const powers = sqliteTable('powers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  staticId: text('static_id').references(() => staticPowers.id),
  scalableId: text('scalable_id').references(() => scalablePowers.id),
  requirementId: text('requirement_id').references(() => powerRequirements.id),
});

export const powerRequirements = sqliteTable('power_requirements', {
  id: text('id').primaryKey(),
});

export const powerAttributeRequirements = sqliteTable(
  'power_attribute_requirements',
  {
    powerRequirementId: text('power_requirement_id')
      .notNull()
      .references(() => powerRequirements.id),
    attributeName: text('attribute_name')
      .notNull()
      .references(() => attributes.name),
    value: integer('value').notNull(),
  },
  t => [primaryKey({ columns: [t.powerRequirementId, t.attributeName] })],
);

export const powerSkillRequirements = sqliteTable(
  'power_skill_requirements',
  {
    powerRequirementId: text('power_requirement_id')
      .notNull()
      .references(() => powerRequirements.id),
    skillName: text('skill_name')
      .notNull()
      .references(() => skills.name),
    skillLevel: text('skill_level')
      .notNull()
      .references(() => skillLevels.level),
  },
  t => [primaryKey({ columns: [t.powerRequirementId, t.skillName] })],
);

export const powerAffinityRequirements = sqliteTable(
  'power_affinity_requirements',
  {
    powerRequirementId: text('power_requirement_id')
      .notNull()
      .references(() => powerRequirements.id),
    hauntingName: text('haunting_name')
      .notNull()
      .references(() => hauntings.name),
    affinityLevel: text('affinity_level')
      .notNull()
      .references(() => affinityLevels.level),
  },
  t => [primaryKey({ columns: [t.powerRequirementId, t.hauntingName] })],
);

export const powerProficiencyRequirements = sqliteTable(
  'power_proficiency_requirements',
  {
    powerRequirementId: text('power_requirement_id')
      .notNull()
      .references(() => powerRequirements.id),
    proficiencyName: text('proficiency_name')
      .notNull()
      .references(() => proficiencies.name),
    proficiencyLevel: text('proficiency_level')
      .notNull()
      .references(() => proficiencyLevels.level),
  },
  t => [primaryKey({ columns: [t.powerRequirementId, t.proficiencyName] })],
);

export const powerPowerRequirements = sqliteTable(
  'power_power_requirements',
  {
    powerRequirementId: text('power_requirement_id')
      .notNull()
      .references(() => powerRequirements.id),
    powerId: text('power_id')
      .notNull()
      .references(() => powers.id),
  },
  t => [primaryKey({ columns: [t.powerRequirementId, t.powerId] })],
);

export const defenseBonusLevels = sqliteTable('defense_bonus_levels', {
  level: text('level').primaryKey(),
  bonus: integer('bonus').notNull(),
});

export const scalablePowers = sqliteTable('scalable_powers', {
  id: text('id').primaryKey(),
  each: integer('each').notNull(),
  modifiesHp: integer('modifies_hp', { mode: 'boolean' }).default(false),
  modifiesHope: integer('modifies_hope', { mode: 'boolean' }).default(false),
  basedOnFear: integer('based_on_fear', { mode: 'boolean' }).default(false),
  basedOnLevel: integer('based_on_level', { mode: 'boolean' }).default(false),
  basedOnRank: integer('based_on_rank', { mode: 'boolean' }).default(false),
  modification: integer('modification').notNull(),
});

export const staticPowers = sqliteTable('static_powers', {
  id: text('id').primaryKey(),
  staticSkillId: text('static_skill_id').references(() => staticSkills.id),
  defenseBonusLevel: text('defense_bonus_level').references(() => defenseBonusLevels.level),
  staticDamageReductionId: text('static_damage_reduction_id').references(
    () => staticDamageReductions.id,
  ),
  staticBonusDamageId: text('static_damage_id').references(() => staticBonusDamages.id),
});

export const staticSkills = sqliteTable('static_skills', {
  id: text('id').primaryKey(),
  skillName: text('skill_name')
    .notNull()
    .references(() => skills.name),
  level: integer('level', { mode: 'boolean' }),
  dices: integer('dices'),
});

export const staticBonusDamages = sqliteTable('static_bonus_damages', {
  id: text('id').primaryKey(),
});

export const proficiencyDamages = sqliteTable('proficiency_damages', {
  id: text('id').primaryKey(),
  proficiencyName: text('proficiency_name')
    .notNull()
    .references(() => proficiencies.name),
  value: integer('value').notNull(),
});

export const typeDamages = sqliteTable('type_damages', {
  id: text('id').primaryKey(),
  damageTypeName: text('damage_type_name')
    .notNull()
    .references(() => damageTypes.name),
  value: integer('value').notNull(),
});

export const staticDamageReductions = sqliteTable('static_damage_reductions', {
  id: text('id').primaryKey(),
});

export const damageReductionLevels = sqliteTable('damage_reduction_levels', {
  level: text('level').primaryKey(),
  value: integer('value').notNull(),
});

export const damageReductions = sqliteTable('damage_reductions', {
  id: text('id').primaryKey(),
  damageTypeName: text('damage_type_name')
    .notNull()
    .references(() => damageTypes.name),
  damageReductionLevel: text('damage_reduction_level')
    .notNull()
    .references(() => damageReductionLevels.level),
});

export const staticBonusDamagesToProficiencyDamages = sqliteTable(
  'static_bonus_damages_to_proficiency_damages',
  {
    staticBonusDamageId: text('static_bonus_damage_id')
      .notNull()
      .references(() => staticBonusDamages.id),
    proficiencyDamageId: text('proficiency_damage_id')
      .notNull()
      .references(() => proficiencyDamages.id),
  },
  t => [primaryKey({ columns: [t.staticBonusDamageId, t.proficiencyDamageId] })],
);

export const staticBonusDamagesToTypeDamages = sqliteTable(
  'static_bonus_damages_to_type_damages',
  {
    staticBonusDamageId: text('static_bonus_damage_id')
      .notNull()
      .references(() => staticBonusDamages.id),
    typeDamageId: text('type_damage_id')
      .notNull()
      .references(() => typeDamages.id),
  },
  t => [primaryKey({ columns: [t.staticBonusDamageId, t.typeDamageId] })],
);

export const staticDamageReductionsToDamageReductions = sqliteTable(
  'static_damage_reductions_to_damage_reductions',
  {
    staticDamageReductionId: text('static_damage_reduction_id')
      .notNull()
      .references(() => staticDamageReductions.id),
    damageReductionId: text('damage_reduction_id')
      .notNull()
      .references(() => damageReductions.id),
  },
  t => [primaryKey({ columns: [t.staticDamageReductionId, t.damageReductionId] })],
);

// -------------------- relations --------------------

export const staticBonusDamagesRelations = relations(staticBonusDamages, ({ many }) => ({
  proficiencyDamagesLinks: many(staticBonusDamagesToProficiencyDamages),
  typeDamagesLinks: many(staticBonusDamagesToTypeDamages),
}));

export const proficiencyDamagesRelations = relations(proficiencyDamages, ({ many, one }) => ({
  proficiency: one(proficiencies, {
    fields: [proficiencyDamages.proficiencyName],
    references: [proficiencies.name],
  }),
  staticBonusDamagesLinks: many(staticBonusDamagesToProficiencyDamages),
}));

export const typeDamagesRelations = relations(typeDamages, ({ many, one }) => ({
  damageType: one(damageTypes, {
    fields: [typeDamages.damageTypeName],
    references: [damageTypes.name],
  }),
  staticBonusDamagesLinks: many(staticBonusDamagesToTypeDamages),
}));

export const staticDamageReductionsRelations = relations(staticDamageReductions, ({ many }) => ({
  staticDamageReductionsLinks: many(staticDamageReductionsToDamageReductions),
}));

export const damageReductionsRelations = relations(damageReductions, ({ one, many }) => ({
  reductionLevel: one(damageReductionLevels, {
    fields: [damageReductions.damageReductionLevel],
    references: [damageReductionLevels.level],
  }),
  damageType: one(damageTypes, {
    fields: [damageReductions.damageTypeName],
    references: [damageTypes.name],
  }),
  staticDamageReductionsLinks: many(staticDamageReductionsToDamageReductions),
}));

export const powersRelations = relations(powers, ({ one }) => ({
  scalable: one(scalablePowers, {
    fields: [powers.scalableId],
    references: [scalablePowers.id],
  }),
  static: one(staticPowers, {
    fields: [powers.staticId],
    references: [staticPowers.id],
  }),
  requirement: one(powerRequirements, {
    fields: [powers.requirementId],
    references: [powerRequirements.id],
  }),
}));

export const powerRequirementsRelations = relations(powerRequirements, ({ many }) => ({
  powers: many(powers),
  attributeRequirements: many(powerAttributeRequirements),
  skillRequirements: many(powerSkillRequirements),
  affinityRequirements: many(powerAffinityRequirements),
  proficiencyRequirements: many(powerProficiencyRequirements),
  powerRequirements: many(powerPowerRequirements),
}));

export const powerAttributeRequirementsRelations = relations(
  powerAttributeRequirements,
  ({ one }) => ({
    powerRequirement: one(powerRequirements, {
      fields: [powerAttributeRequirements.powerRequirementId],
      references: [powerRequirements.id],
    }),
    attribute: one(attributes, {
      fields: [powerAttributeRequirements.attributeName],
      references: [attributes.name],
    }),
  }),
);

export const powerSkillRequirementsRelations = relations(powerSkillRequirements, ({ one }) => ({
  powerRequirement: one(powerRequirements, {
    fields: [powerSkillRequirements.powerRequirementId],
    references: [powerRequirements.id],
  }),
  skill: one(skills, { fields: [powerSkillRequirements.skillName], references: [skills.name] }),
}));

export const powerAffinityRequirementsRelations = relations(
  powerAffinityRequirements,
  ({ one }) => ({
    powerRequirement: one(powerRequirements, {
      fields: [powerAffinityRequirements.powerRequirementId],
      references: [powerRequirements.id],
    }),
    haunting: one(hauntings, {
      fields: [powerAffinityRequirements.hauntingName],
      references: [hauntings.name],
    }),
    affinityLevel: one(affinityLevels, {
      fields: [powerAffinityRequirements.affinityLevel],
      references: [affinityLevels.level],
    }),
  }),
);

export const powerProficiencyRequirementsRelations = relations(
  powerProficiencyRequirements,
  ({ one }) => ({
    powerRequirement: one(powerRequirements, {
      fields: [powerProficiencyRequirements.powerRequirementId],
      references: [powerRequirements.id],
    }),
    proficiency: one(proficiencies, {
      fields: [powerProficiencyRequirements.proficiencyName],
      references: [proficiencies.name],
    }),
    proficiencyLevel: one(proficiencyLevels, {
      fields: [powerProficiencyRequirements.proficiencyLevel],
      references: [proficiencyLevels.level],
    }),
  }),
);

export const powerPowerRequirementsRelations = relations(powerPowerRequirements, ({ one }) => ({
  powerRequirement: one(powerRequirements, {
    fields: [powerPowerRequirements.powerRequirementId],
    references: [powerRequirements.id],
  }),
  power: one(powers, {
    fields: [powerPowerRequirements.powerId],
    references: [powers.id],
  }),
}));

export const scalablePowersRelations = relations(scalablePowers, ({ many }) => ({
  powers: many(powers),
}));

export const staticPowersRelations = relations(staticPowers, ({ many, one }) => ({
  powers: many(powers),
  staticSkill: one(staticSkills, {
    fields: [staticPowers.staticSkillId],
    references: [staticSkills.id],
  }),
  staticDamageReduction: one(staticDamageReductions, {
    fields: [staticPowers.staticDamageReductionId],
    references: [staticDamageReductions.id],
  }),
  staticBonusDamage: one(staticBonusDamages, {
    fields: [staticPowers.staticBonusDamageId],
    references: [staticBonusDamages.id],
  }),
  defenseBonusLevel: one(defenseBonusLevels, {
    fields: [staticPowers.defenseBonusLevel],
    references: [defenseBonusLevels.level],
  }),
}));

export const staticSkillsRelations = relations(staticSkills, ({ many }) => ({
  staticPowers: many(staticPowers),
}));

export const reductionLevelsRelations = relations(damageReductionLevels, ({ many }) => ({
  damageReductions: many(damageReductions),
  staticPowers: many(staticPowers),
}));

export const staticBonusDamagesToProficiencyDamagesRelations = relations(
  staticBonusDamagesToProficiencyDamages,
  ({ one }) => ({
    staticBonusDamage: one(staticBonusDamages, {
      fields: [staticBonusDamagesToProficiencyDamages.staticBonusDamageId],
      references: [staticBonusDamages.id],
    }),
    proficiencyDamage: one(proficiencyDamages, {
      fields: [staticBonusDamagesToProficiencyDamages.proficiencyDamageId],
      references: [proficiencyDamages.id],
    }),
  }),
);

export const staticBonusDamagesToTypeDamagesRelations = relations(
  staticBonusDamagesToTypeDamages,
  ({ one }) => ({
    staticBonusDamage: one(staticBonusDamages, {
      fields: [staticBonusDamagesToTypeDamages.staticBonusDamageId],
      references: [staticBonusDamages.id],
    }),
    typeDamage: one(typeDamages, {
      fields: [staticBonusDamagesToTypeDamages.typeDamageId],
      references: [typeDamages.id],
    }),
  }),
);

export const staticDamageReductionsToDamageReductionsRelations = relations(
  staticDamageReductionsToDamageReductions,
  ({ one }) => ({
    staticDamageReduction: one(staticDamageReductions, {
      fields: [staticDamageReductionsToDamageReductions.staticDamageReductionId],
      references: [staticDamageReductions.id],
    }),
    damageReduction: one(damageReductions, {
      fields: [staticDamageReductionsToDamageReductions.damageReductionId],
      references: [damageReductions.id],
    }),
  }),
);
