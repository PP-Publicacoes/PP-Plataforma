import { relations } from 'drizzle-orm';
import { communityToTags, tableToTags } from './joins';
import { communities, members, roles, tags } from './tables';
import { tables } from '../table';
import { users } from '../auth';

export const communityToTagsRelations = relations(communityToTags, ({ one }) => ({
  community: one(communities, {
    fields: [communityToTags.communityId],
    references: [communities.id],
  }),
  tag: one(tags, {
    fields: [communityToTags.tagId],
    references: [tags.id],
  }),
}));

export const tableToTagsRelations = relations(tableToTags, ({ one }) => ({
  table: one(tables, {
    fields: [tableToTags.tableId],
    references: [tables.id],
  }),
  tag: one(tags, {
    fields: [tableToTags.tagId],
    references: [tags.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many, one }) => ({
  community: one(communities, {
    fields: [roles.communityId],
    references: [communities.id],
  }),
  members: many(members),
}));

export const communitiesRelations = relations(communities, ({ many, one }) => ({
  creator: one(users, {
    fields: [communities.creatorId],
    references: [users.id],
  }),
  members: many(members),
}));

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  community: one(communities, {
    fields: [members.communityId],
    references: [communities.id],
  }),
  role: one(roles, {
    fields: [members.roleId],
    references: [roles.id],
  }),
}));
