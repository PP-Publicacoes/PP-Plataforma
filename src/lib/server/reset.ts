import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { encodeBase32LowerCase } from '@oslojs/encoding';

function base64url(bytes: Uint8Array) {
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function sha256base64url(input: string) {
  const cryptoObj = crypto.subtle ?? (globalThis as any).crypto?.subtle;
  if (!cryptoObj) throw new Error('WebCrypto indisponível');
  const enc = new TextEncoder().encode(input);
  // OBS: WebCrypto é assíncrono; embrulhamos num helper
  return cryptoObj.digest('SHA-256', enc).then((buf: ArrayBuffer) => {
    return base64url(new Uint8Array(buf));
  });
}

export async function createPasswordResetToken(
  userId: string,
  meta?: { ip?: string; userAgent?: string },
) {
  // token bruto (não armazenar)
  const raw = crypto.getRandomValues(new Uint8Array(32));
  const token = base64url(raw); // curto e URL-safe
  const tokenHash = await sha256base64url(token);

  const now = Date.now();
  const expiresAt = now + 15 * 60 * 1000; // 15 min

  const idBytes = crypto.getRandomValues(new Uint8Array(10));
  const id = encodeBase32LowerCase(idBytes);

  await db.insert(table.passwordResetToken).values({
    id,
    userId,
    tokenHash,
    createdAt: now,
    expiresAt,
    usedAt: null,
    ip: meta?.ip,
    userAgent: meta?.userAgent,
  });

  return { token, expiresAt };
}

export async function consumePasswordResetToken(token: string) {
  const tokenHash = await sha256base64url(token);
  const now = Date.now();

  const rows = await db
    .select()
    .from(table.passwordResetToken)
    .where(
      and(
        eq(table.passwordResetToken.tokenHash, tokenHash),
        isNull(table.passwordResetToken.usedAt),
      ),
    );

  const rec = rows.at(0);
  if (!rec) return { ok: false as const, reason: 'INVALID' };
  if (rec.expiresAt < now) return { ok: false as const, reason: 'EXPIRED', record: rec };

  // marca como usado (single-use)
  await db
    .update(table.passwordResetToken)
    .set({ usedAt: now })
    .where(eq(table.passwordResetToken.id, rec.id));

  return { ok: true as const, record: rec };
}
