import { StatusModificavel, StatusReferenciavel } from '$lib/enums/character/status';
import { relations } from 'drizzle-orm';
import { valuesToTuple } from '../../../utils/enum-utils';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { attributes, skills } from './character';
import { damageTypes, proficiencies } from './equipment';
import { hauntings } from './fear';

// -------------------- tables --------------------

export const powers = sqliteTable('powers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(),
  staticId: text('static_id'),
  scalableId: text('scalable_id'),
  requirementId: text('requirement_id'),
});

export const powerRequirements = sqliteTable('power_requirements', {
  id: text('id').primaryKey().notNull(),
  powerAttributeRequirementId: text('power_requirement_attribute_id'),
  powerSkillRequirementId: text('power_requirement_skill_id'),
  powerAffinityRequirementId: text('power_requirement_affinity_id'),
  powerProficiencyRequirementId: text('power_requirement_proficiency_id'),
  powerPowerRequirementId: text('power_requirement_power_id'),
});

export const powerAttributeRequirements = sqliteTable(
  'power_attribute_requirements',
  {
    powerRequirementId: text('power_requirement_id').notNull(),
    attribute: text('attribute').notNull(),
    value: integer('value').notNull(),
  },
  t => [primaryKey({ columns: [t.powerRequirementId, t.attribute] })],
);

export const powerSkillRequirements = sqliteTable(
  'power_skill_requirements',
  {
    powerRequirementId: text('power_requirement_id').notNull(),
    skill: text('skill').notNull(),
    level: text('level').notNull(),
  },
  t => [primaryKey({ columns: [t.powerRequirementId, t.skill] })],
);

export const powerAffinityRequirements = sqliteTable(
  'power_affinity_requirements',
  {
    powerRequirementId: text('power_requirement_id').notNull(),
    haunting: text('haunting').notNull(),
    level: text('level').notNull(),
  },
  t => [primaryKey({ columns: [t.powerRequirementId, t.haunting] })],
);

export const powerProficiencyRequirements = sqliteTable(
  'power_proficiency_requirements',
  {
    powerRequirementId: text('power_requirement_id').notNull(),
    proficiency: text('proficiency').notNull(),
    level: text('level').notNull(),
  },
  t => [primaryKey({ columns: [t.powerRequirementId, t.proficiency] })],
);

export const powerPowerRequirements = sqliteTable(
  'power_power_requirements',
  {
    powerRequirementId: text('power_requirement_id').notNull(),
    powerId: text('power_id').notNull(),
  },
  t => [primaryKey({ columns: [t.powerRequirementId, t.powerId] })],
);

export const powerTypes = sqliteTable('power_types', {
  type: text('type').primaryKey().notNull(),
});

export const defenseBonus = sqliteTable('defense_bonus', {
  level: text('level').primaryKey().notNull(),
  bonus: integer().notNull(),
});

export const scalablePowers = sqliteTable('scalable_powers', {
  id: text('id').primaryKey(),
  interval: integer('interval').notNull(), // was "cada"
  referencable: text('referencable', { enum: valuesToTuple(StatusReferenciavel) }).notNull(),
  value: integer('value').notNull(), // was "valor"
  modifiable: text('modifiable', { enum: valuesToTuple(StatusModificavel) }).notNull(), // was "modificavel"
});

export const staticPowers = sqliteTable('static_powers', {
  id: text('id').primaryKey(),
  staticSkill: text('static_skill'),
  defense: text('defense'),
  reduction: text('reduction'),
  staticDamage: text('static_damage'),
});

export const staticSkills = sqliteTable('static_skills', {
  id: text('id').primaryKey(),
  bonus: integer('bonus', { mode: 'boolean' }),
  dice: integer('dice'),
});

export const reductionLevels = sqliteTable('reduction_levels', {
  level: text('level').primaryKey().notNull(),
  value: integer().notNull(),
});

export const damageReductions = sqliteTable('damage_reductions', {
  id: text('id').primaryKey().notNull(),
  damageType: text('damage_type').notNull(),
  reductionLevel: text('reduction_level').notNull(),
});

// -------------------- relations --------------------

export const powersRelations = relations(powers, ({ one }) => ({
  type: one(powerTypes, {
    fields: [powers.type],
    references: [powerTypes.type],
  }),
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
      fields: [powerAttributeRequirements.attribute],
      references: [attributes.name],
    }),
  }),
);

export const powerSkillRequirementsRelations = relations(powerSkillRequirements, ({ one }) => ({
  powerRequirement: one(powerRequirements, {
    fields: [powerSkillRequirements.powerRequirementId],
    references: [powerRequirements.id],
  }),
  skill: one(skills, { fields: [powerSkillRequirements.skill], references: [skills.name] }),
}));

export const powerAffinityRequirementsRelations = relations(
  powerAffinityRequirements,
  ({ one }) => ({
    powerRequirement: one(powerRequirements, {
      fields: [powerAffinityRequirements.powerRequirementId],
      references: [powerRequirements.id],
    }),
    haunting: one(hauntings, {
      fields: [powerAffinityRequirements.haunting],
      references: [hauntings.name],
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
      fields: [powerProficiencyRequirements.powerRequirementId],
      references: [proficiencies.name],
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

export const powerTypesRelations = relations(powerTypes, ({ many }) => ({
  powers: many(powers),
}));

export const scalablePowersRelations = relations(scalablePowers, ({ many }) => ({
  powers: many(powers),
}));

export const staticPowersRelations = relations(staticPowers, ({ many, one }) => ({
  powers: many(powers),
  staticSkill: one(staticSkills, {
    fields: [staticPowers.staticSkill],
    references: [staticSkills.id],
  }),
  reduction: one(reductionLevels, {
    fields: [staticPowers.reduction],
    references: [reductionLevels.level],
  }),
  staticDamage: one(damageReductions, {
    fields: [staticPowers.staticDamage],
    references: [damageReductions.id],
  }),
  defense: one(defenseBonus, {
    fields: [staticPowers.defense],
    references: [defenseBonus.level],
  })
}));

export const staticSkillsRelations = relations(staticSkills, ({ many }) => ({
  staticPowers: many(staticPowers),
}));

export const reductionLevelsRelations = relations(reductionLevels, ({ many }) => ({
  damageReductions: many(damageReductions),
  staticPowers: many(staticPowers),
}));

export const damageReductionsRelations = relations(damageReductions, ({ one }) => ({
  reductionLevel: one(reductionLevels, {
    fields: [damageReductions.reductionLevel],
    references: [reductionLevels.level],
  }),
  damageType: one(damageTypes, {
    fields: [damageReductions.damageType],
    references: [damageTypes.name],
  }),
}));
