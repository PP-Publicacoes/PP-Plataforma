import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { users } from './auth';

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

export type Community = typeof communities.$inferSelect;

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

export const tables = sqliteTable('tables', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  systemId: text('system_id')
    .notNull()
    .references(() => systems.id),
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
  name: text('name').notNull(),
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
    genreId: text('genre_id')
      .notNull()
      .references(() => genres.id),
  },
  t => [primaryKey({ columns: [t.tableId, t.genreId] })],
);

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
