import { relations, sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { personagens } from './character';
import { usersToMembers } from './table';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  age: integer('age'),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  slug: text('slug').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

export const passwordResetTokens = sqliteTable('password_reset_tokens', {
  id: text('id').primaryKey(), // ex: base32 ou uuid
  userId: text('user_id').notNull(),
  tokenHash: text('token_hash').notNull(), // sha256(token) em base64url
  createdAt: integer('created_at').notNull(), // Date.now()
  expiresAt: integer('expires_at').notNull(), // Date.now() + 15*60*1000
  usedAt: integer('used_at'), // null até usar
  ip: text('ip'),
  userAgent: text('user_agent'),
});

export const usersRelations = relations(users, ({ many }) => ({
  passwordResetTokens: many(passwordResetTokens),
  personagens: many(personagens),
  sessions: many(sessions),
  usersToMembers: many(usersToMembers),
}));

export const passwordResetTokenRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, { fields: [passwordResetTokens.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type SessionInsert = typeof sessions.$inferInsert;
