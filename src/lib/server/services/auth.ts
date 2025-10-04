// src/lib/services/authService.ts
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { error, type RequestEvent } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { m } from '$lib/paraglide/messages';
import { randomBytes } from '$lib/utils/random';
import {
  sessions,
  userInsertSchema,
  users,
  usersView,
  type PublicUser,
  type Session,
  type SessionInsert,
  type UserInsert,
} from '../db/schema';
import { verifyPassword } from '../password';

export class AuthService {
  sessionCookieName = 'auth-session'; // mantive export para compatibilidade
  // constantes internas
  private readonly DAY_IN_MS = 1000 * 60 * 60 * 24;

  // --- helpers privados ---
  private hashToken(token: string): string {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  }

  // --- API pública ---
  generateSessionToken(): string {
    const bytes = randomBytes(18);
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
  ): Promise<{ session: Session | null; user: PublicUser | null }> {
    const sessionId = this.hashToken(token);

    const [result] = await db
      .select()
      .from(sessions)
      .innerJoin(usersView, eq(usersView.id, sessions.userId))
      .where(eq(sessions.id, sessionId));

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
    event.cookies.set(this.sessionCookieName, token, {
      expires: expiresAt,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  deleteSessionTokenCookie(event: RequestEvent) {
    event.cookies.delete(this.sessionCookieName, { path: '/' });
  }

  async validatePassword(username: string, password: string) {
    const row = (
      await db
        .select({ passwordHash: users.passwordHash })
        .from(users)
        .where(eq(users.username, username))
    ).at(0);

    if (!row) return false;

    return await verifyPassword(row.passwordHash, password);
  }

  async invalidateUserSessions(userId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
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
  async getUserByUsername(username: string): Promise<PublicUser | null> {
    return await db
      .select()
      .from(usersView)
      .where(eq(usersView.username, username))
      .then(res => res[0]);
  }

  async getUserByEmail(email: string): Promise<PublicUser | null> {
    return await db
      .select()
      .from(usersView)
      .where(eq(usersView.email, email))
      .then(res => res[0]);
  }

  async getUserById(id: string): Promise<PublicUser | null> {
    return await db
      .select()
      .from(usersView)
      .where(eq(usersView.id, id))
      .then(res => res[0]);
  }

  getUserFromLocals(event: RequestEvent): PublicUser | null {
    return (event.locals.user as PublicUser) ?? null;
  }

  requireLogin(event: RequestEvent, redirectTo = '/auth?t=login'): PublicUser | null {
    const user = this.getUserFromLocals(event);
    if (!user) {
      throw redirect(
        redirectTo,
        { type: 'warning', message: m['errors.auth.required_login']() },
        event.cookies,
      );
    }

    return user;
    // return this.serializeUser(user);
  }

  requireAuthOrThrow(event: RequestEvent): PublicUser | null {
    const user = this.getUserFromLocals(event);
    if (!user) {
      setFlash({ type: 'error', message: m['errors.auth.required_login']() }, event.cookies);
      throw error(401, 'Unauthorized');
    }

    return user;
    // return this.serializeUser(user);
  }

  // serializeUser(user: PublicUser): PublicUser {
  //   const u = { ...user, createdAt: user?.createdAt.toISOString() } as Omit<
  //     PublicUser,
  //     'createdAt'
  //   > & { createdAt: string };
  //
  //   return u as PublicUser;
  // }
}

// Exporte um singleton pronto para uso
export const authService = new AuthService();
