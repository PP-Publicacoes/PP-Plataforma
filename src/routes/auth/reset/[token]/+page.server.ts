import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect, error } from '@sveltejs/kit';
import { resetPasswordSchema, type ResetPasswordInput } from '$lib/schemas/auth';
import { consumePasswordResetToken } from '$lib/server/reset';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { hashPassword } from '$lib/server/password';

export const load: PageServerLoad = async (event) => {
  const token = event.params.token;
  // Não consome aqui; apenas mostra formulário
  if (!token) throw error(400, 'Token ausente');

  return {
    form: await superValidate(zod4(resetPasswordSchema))
  };
};

export const actions: Actions = {
  reset: async (event: RequestEvent) => {
    const token = event.params.token;
    if (!token) throw error(400, 'Token ausente');

    const form = await superValidate(event, zod4(resetPasswordSchema));
    if (!form.valid) return fail(400, { form });

    // Valida e consome token
    const res = await consumePasswordResetToken(token);
    if (!res.ok) {
      // Trate mensagens genéricas para não vazar estado
      const msg = res.reason === 'EXPIRED' ? 'O link expirou. Solicite um novo.' : 'Link inválido.';
      form.valid = false;
      form.errors?._errors?.push(msg);
      return fail(400, { form });
    }

    const userId = res.record!.userId;

    // Atualiza a senha
    const { password } = form.data as ResetPasswordInput;
    const passwordHash = await hashPassword(password);

    await db.update(table.user).set({ passwordHash }).where(eq(table.user.id, userId));

    // Segurança extra: invalida todas as sessões anteriores desse usuário
    await auth.invalidateUserSessions(userId);

    // Opcional: cria nova sessão e faz login automático
    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, userId);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    // Redireciona para home (ou /auth?t=login) com flash
    throw redirect(302, '/');
  }
};
