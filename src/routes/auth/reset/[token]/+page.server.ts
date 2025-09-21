import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect, error } from '@sveltejs/kit';
import { resetPasswordSchema, type ResetPasswordInput } from '$lib/schemas/auth';
import { consumePasswordResetToken } from '$lib/server/reset';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { hashPassword } from '$lib/server/password';
import { users } from '$lib/server/db/schema/auth';
import { authService } from '$lib/server/services/auth';

export const load: PageServerLoad = async event => {
  const token = event.params.token;
  // Não consome aqui; apenas mostra formulário
  if (!token) throw error(400, 'Token ausente');

  return {
    form: await superValidate(zod4(resetPasswordSchema)),
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

    await db.update(users).set({ passwordHash }).where(eq(users.id, userId));

    // Segurança extra: invalida todas as sessões anteriores desse usuário
    await authService.invalidateUserSessions(userId);
    await authService.setUpSessionAndCookies(event, userId);

    // Redireciona para home (ou /auth?t=login) com flash
    throw redirect(302, '/');
  },
};
