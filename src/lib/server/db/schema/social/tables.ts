import { integer, primaryKey, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { users } from '../auth';
import { createInsertSchema } from 'drizzle-zod';

export const communities = sqliteTable('communities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  slug: text('slug').notNull().unique(),
  public: integer('public', { mode: 'boolean' }).default(true).notNull(),
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
    communityId: text('community_id').references(() => communities.id),
  },
  t => [unique().on(t.communityId, t.name)],
);

export const members = sqliteTable(
  'members',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    communityId: text('community_id')
      .notNull()
      .references(() => communities.id, { onDelete: 'cascade' }),
    nickname: text('nickname').notNull(),
    roleId: text('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'restrict' }),
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
    permissions: integer('permissions').notNull().default(0),
    communityId: text('community_id')
      .notNull()
      .references(() => communities.id, { onDelete: 'cascade' }),
  },
  t => [unique('roles_community_name_idx').on(t.communityId, t.name)],
);

export type Community = typeof communities.$inferSelect;
export type CommunityInsert = typeof communities.$inferInsert;
export type Member = typeof members.$inferSelect;
export type SidebarCommunity = {
  name: Community['name'];
  slug: Community['slug'];
  nickname: Member['nickname'];
};
export const communityInsertSchema = createInsertSchema(communities);
