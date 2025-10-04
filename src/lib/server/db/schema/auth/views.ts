import { sqliteView } from 'drizzle-orm/sqlite-core';
import { users } from './tables';

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
