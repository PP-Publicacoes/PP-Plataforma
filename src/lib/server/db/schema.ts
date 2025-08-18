import { relations } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
  slug: text('slug').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const passwordResetToken = sqliteTable('password_reset_token', {
  id: text('id').primaryKey(),                 // ex: base32 ou uuid
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),     // sha256(token) em base64url
  createdAt: integer('created_at').notNull(),  // Date.now()
  expiresAt: integer('expires_at').notNull(),  // Date.now() + 15*60*1000
  usedAt: integer('used_at'),                  // null até usar
  ip: text('ip'),
  userAgent: text('user_agent')
});

export const passwordResetTokenRelations = relations(passwordResetToken, ({ one }) => ({
  user: one(user, { fields: [passwordResetToken.userId], references: [user.id] })
}));

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type UserInsert = typeof user.$inferInsert;
export type SessionInsert = typeof session.$inferInsert;
