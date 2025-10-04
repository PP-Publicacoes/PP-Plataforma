import { relations } from 'drizzle-orm';
import { passwordResetTokens, sessions, users } from './tables';
import { members } from '../social';

export const usersRelations = relations(users, ({ many }) => ({
  passwordResetTokens: many(passwordResetTokens),
  // characters: many(characters),
  sessions: many(sessions),
  members: many(members),
}));

export const passwordResetTokenRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, { fields: [passwordResetTokens.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
