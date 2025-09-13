import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { users } from './auth';

export const communities = sqliteTable('communities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  slug: text('slug').unique(),
  creatorId: text('creator_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const members = sqliteTable(
  'members',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    communityId: text('community_id').notNull(),
    nickname: text('nickname').notNull(),
    roleId: text('role_id').notNull(),
    joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
  },
  t => [unique().on(t.communityId, t.userId)],
);

export const roles = sqliteTable(
  'roles',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    communityId: text('community_id').notNull(),
  },
  t => [unique().on(t.communityId, t.name)],
);

export const tables = sqliteTable('tables', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  systemId: text('system_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const systems = sqliteTable('systems', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
});

export const systemsRelations = relations(systems, ({ many }) => ({
  tables: many(tables),
}));

export const tablesRelations = relations(tables, ({ many, one }) => ({
  tablesToGenres: many(tablesToGenres),
  system: one(systems, {
    fields: [tables.systemId],
    references: [systems.id],
  }),
}));

export const genres = sqliteTable('genres', {
  id: text('id').primaryKey(),
  name: text('text').notNull(),
});

export const genresRelations = relations(genres, ({ many }) => ({
  tablesToGenres: many(tablesToGenres),
}));

export const tablesToGenres = sqliteTable(
  'tables_to_genres',
  {
    tableId: text('table_id')
      .notNull()
      .references(() => tables.id),
    genresId: text('genres_id')
      .notNull()
      .references(() => genres.id),
  },
  t => [primaryKey({ columns: [t.tableId, t.genresId] })],
);

export const rolesRelations = relations(roles, ({ many, one }) => ({
  community: one(communities, {
    fields: [roles.communityId],
    references: [communities.id],
  }),
  members: many(members),
}));

export const communitiesRelations = relations(communities, ({ many, one }) => ({
  membersToCommunities: many(membersToCommunities),
  creator: one(members, {
    fields: [communities.creatorId],
    references: [members.id],
  }),
}));

export const membersRelations = relations(members, ({ many, one }) => ({
  membersToCommunities: many(membersToCommunities),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [members.roleId],
    references: [roles.id],
  }),
}));

export const membersToCommunities = sqliteTable(
  'members_to_communities',
  {
    memberId: text('member_id')
      .notNull()
      .references(() => members.id),
    communityId: text('community_id')
      .notNull()
      .references(() => communities.id),
  },
  t => [primaryKey({ columns: [t.memberId, t.communityId] })],
);
