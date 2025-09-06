import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { forgotSchema, type ForgotInput } from '$lib/schemas/auth';
import { createPasswordResetToken } from '$lib/server/reset';
import { sendPasswordResetEmail } from '$lib/server/email';
import { users } from '$lib/server/db/schema/auth';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(forgotSchema)),
  };
};

export const actions: Actions = {
  request: async (event: RequestEvent) => {
    const form = await superValidate(event, zod4(forgotSchema));
    if (!form.valid) return fail(400, { form });

    const { email } = form.data as ForgotInput;

    // Não revelar se e-mail existe: resposta sempre 200
    const correspondingUsers = await db.select().from(users).where(eq(users.email, email));
    const user = correspondingUsers.at(0);

    if (user) {
      const { token, expiresAt } = await createPasswordResetToken(user.id, {
        ip: event.getClientAddress?.() ?? undefined,
        userAgent: event.request.headers.get('user-agent') ?? undefined,
      });

      // Constrói URL absoluta
      const origin = event.url.origin; // SvelteKit 2: confiável
      const resetUrl = `${origin}/auth/reset/${token}`;
      await sendPasswordResetEmail(email, resetUrl);

      // Opcional: log/telemetria do expiresAt
      void expiresAt;
    }

    // Sempre aparentar sucesso
    return { form, sent: true as const };
  },
};
