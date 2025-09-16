// src/lib/services/authService.ts
import { userInsertSchema } from '$lib/schemas/auth';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import {
  sessions,
  users,
  type PublicUser,
  type Session,
  type SessionInsert,
  type UserInsert,
} from '../db/schema/auth';
import { userSessionsView, usersView } from '../db/views/auth';
import { encodeBase32LowerCase, encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import type { RequestEvent } from '@sveltejs/kit';

export const sessionCookieName = 'auth-session'; // mantive export para compatibilidade

export class AuthService {
  // constantes internas
  private readonly DAY_IN_MS = 1000 * 60 * 60 * 24;

  // --- helpers privados ---
  private randomBytes(length: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  private hashToken(token: string): string {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  }

  // --- API pública ---
  generateSessionToken(): string {
    const bytes = this.randomBytes(18);
    return encodeBase64url(bytes);
  }

  async createSession(token: string, userId: string): Promise<Session> {
    const sessionId = this.hashToken(token);

    const session: SessionInsert = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + this.DAY_IN_MS * 30),
    };

    await db.insert(sessions).values(session);
    return session as Session;
  }

  async validateSessionToken(
    token: string,
  ): Promise<{ session: Session | null; user: PublicUser }> {
    const sessionId = this.hashToken(token);

    const [result] = await db.select().from(userSessionsView).where(eq(sessions.id, sessionId));

    if (!result) {
      return { session: null, user: null };
    }

    const { sessions: session, users_view: user } = result;
    const sessionExpired = Date.now() >= session.expiresAt.getTime();

    if (sessionExpired) {
      // remove sessão expirada
      await db.delete(sessions).where(eq(sessions.id, session.id));
      return { session: null, user: null };
    }

    // renova automaticamente se estiver perto do vencimento
    const renewSession = Date.now() >= session.expiresAt.getTime() - this.DAY_IN_MS * 15;
    if (renewSession) {
      session.expiresAt = new Date(Date.now() + this.DAY_IN_MS * 30);
      await db
        .update(sessions)
        .set({ expiresAt: session.expiresAt })
        .where(eq(sessions.id, session.id));
    }

    return { session, user };
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
    event.cookies.set(sessionCookieName, token, {
      expires: expiresAt,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  deleteSessionTokenCookie(event: RequestEvent) {
    event.cookies.delete(sessionCookieName, { path: '/' });
  }

  async validatePassword(username: string, password: string) {
    return (
      (
        await db
          .select({ passwordHash: users.passwordHash })
          .from(users)
          .where(eq(users.username, username))
      ).at(0)?.passwordHash === password
    );
  }

  async invalidateUserSessions(userId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  }

  generateUserId(): string {
    const bytes = this.randomBytes(15);
    return encodeBase32LowerCase(bytes);
  }

  async newUser(user: UserInsert) {
    const safeUser = {
      ...user,
      username: user.username.trim(),
      email: user.email.toLocaleLowerCase(),
    } satisfies UserInsert;

    const parsed = userInsertSchema.parse(safeUser);
    return db.insert(users).values(parsed);
  }

  async setUpSessionAndCookies(event: RequestEvent, userId: string) {
      const sessionToken = this.generateSessionToken();
      const session = await this.createSession(sessionToken, userId);

      this.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  }

  // Métodos para obter usuário (em vez do objeto aninhado)
  async getUserByUsername(username: string) {
    return await db.select().from(usersView).where(eq(usersView.username, username));
  }

  async getUserByEmail(email: string) {
    return await db.select().from(usersView).where(eq(usersView.email, email));
  }

  getUserFromLocals(event: RequestEvent): PublicUser {
    return (event.locals.user ?? null) as PublicUser;
  }
}

// Exporte um singleton pronto para uso
export const authService = new AuthService();
