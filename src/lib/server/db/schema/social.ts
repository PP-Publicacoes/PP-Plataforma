import { integer, primaryKey, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { users } from './auth';
import { relations } from 'drizzle-orm';
import { tables } from './table';
import { TagScope } from '$lib/enums/social/tags';
import { valuesToTuple } from '$lib/utils/enum-utils';

export const communities = sqliteTable('communities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  slug: text('slug').notNull().unique(),
  creatorId: text('creator_id')
    .notNull()
    .references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const tags = sqliteTable(
  'tags',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    // se null -> tag global; se preenchido -> tag pertence a uma community específica
    communityId: text('community_id').references(() => communities.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  t => [
    // garante unicidade do nome dentro da comunidade (ou global quando communityId IS NULL)
    unique().on(t.communityId, t.name),
  ],
);

// define quais recursos a tag pode ser usada
export const tagScopes = sqliteTable(
  'tag_scopes',
  {
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id),
    scope: text('scope', { enum: valuesToTuple(TagScope) }).notNull(),
  },
  t => [primaryKey({ columns: [t.tagId, t.scope], name: 'tag_scopes_pk' })],
);

export const members = sqliteTable(
  'members',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    communityId: text('community_id')
      .notNull()
      .references(() => communities.id),
    nickname: text('nickname').notNull(),
    roleId: text('role_id')
      .notNull()
      .references(() => roles.id),
    joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
  },
  t => [primaryKey({ columns: [t.userId, t.communityId], name: 'member_pk' })],
);

export const roles = sqliteTable(
  'roles',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    communityId: text('community_id')
      .notNull()
      .references(() => communities.id),
  },
  t => [unique().on(t.communityId, t.name)],
);

export const communityToTags = sqliteTable(
  'community_to_tags',
  {
    communityId: text('community_id')
      .notNull()
      .references(() => communities.id),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id),
  },
  t => [primaryKey({ columns: [t.communityId, t.tagId], name: 'community_tags_pk' })],
);

export const tableToTags = sqliteTable(
  'table_to_tags',
  {
    tableId: text('table_id')
      .notNull()
      .references(() => tables.id),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id),
  },
  t => [primaryKey({ columns: [t.tableId, t.tagId], name: 'table_tags_pk' })],
);

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

export type Community = typeof communities.$inferSelect;
export type CommunityInsert = typeof communities.$inferSelect;
