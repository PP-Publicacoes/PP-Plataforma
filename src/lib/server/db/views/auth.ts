import { sqliteView } from 'drizzle-orm/sqlite-core';
import { sessions, users } from '../schema/auth';
import { eq } from 'drizzle-orm';

export const usersView = sqliteView('users_view').as(qb =>
  qb
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      slug: users.slug,
      createdAt: users.createdAt,
      age: users.age,
      bio: users.bio,
    })
    .from(users),
);

export type PublicUser = typeof usersView.$inferSelect;

export const userSessionsView = sqliteView('user_sessions_view').as(qb =>
  qb.select().from(usersView).innerJoin(sessions, eq(usersView.id, sessions.userId)),
);
