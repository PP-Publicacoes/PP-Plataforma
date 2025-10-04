// +page.server.ts
import { AuthTab } from '$lib/enums/auth-tab';
import { m } from '$lib/paraglide/messages';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '$lib/schemas/auth';
import { type UserInsert } from '$lib/server/db/schema/';
import { hashPassword } from '$lib/server/password';
import { authService } from '$lib/server/services/auth';
import { generateDeterministicSlug, generateId } from '$lib/utils/random';
import type { RequestEvent } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
  // Retorna o usuário quando houver sessão ativa, caso contrário retorna {}.
  // A página que usa esse arquivo pode renderizar formulários de login/register
  // quando `user` for null/undefined, ou mostrar informações/ação de logout quando existir.
  const t = event.url.searchParams.get('t');
  return {
    tab: (t as AuthTab) ?? AuthTab.login,
    loginForm: await superValidate(zod4(loginSchema)),
    registerForm: await superValidate(zod4(registerSchema)),
  };
};

export const actions: Actions = {
  // login: valida credenciais via schema
  login: async (event: RequestEvent) => {
    // superValidate interpreta o body da request usando o schema
    const form = await superValidate(event, zod4(loginSchema));

    // se inválido, retorna o form com erros para o cliente
    if (!form.valid) {
      return fail(400, { form });
    }

    const { username, password } = form.data as LoginInput;

    // busca usuário
    const existingUser = await authService.getUserByUsername(username);
    // const results = await db.select().from(users).where(eq(users.username, username));
    // const existingUser = results.at(0);

    if (!existingUser) {
      // marca erro genérico (não vaze info) e retorna o form
      form.valid = false;
      form.errors?.username?.push(m['errors.auth.invalid_credentials']());

      setFlash({ type: 'error', message: m['toasts.login.error']() }, event.cookies);
      return fail(400, { form });
    }

    // verifica senha
    const validPassword = await authService.validatePassword(username, password);

    if (!validPassword) {
      console.error('Senha inválida');
      form.valid = false;
      form.errors?._errors?.push(m['errors.auth.invalid_credentials']());

      setFlash({ type: 'error', message: m['toasts.login.error']() }, event.cookies);
      return fail(400, { form });
    }

    // criado sessao e cookie
    await authService.setUpSessionAndCookies(event, existingUser.id);

    // sucesso -> redireciona
    redirect('/', { type: 'success', message: m['toasts.login.success']() }, event.cookies);
  },

  // register: valida dados, verifica unicidade, hash e insere
  register: async (event: RequestEvent) => {
    const form = await superValidate(event, zod4(registerSchema));

    if (!form.valid) {
      setFlash({ type: 'error', message: m['toasts.register.error']() }, event.cookies);
      return fail(400, { form });
    }

    const { username, password, email } = form.data as RegisterInput;

    // hash da senha
    const passwordHash = await hashPassword(password);

    // gera id do usuário (usa sua função generateUserId)
    const userId = generateId();

    try {
      const user = {
        id: userId,
        username,
        email,
        passwordHash,
        slug: generateDeterministicSlug(userId),
        createdAt: new Date(),
      } satisfies UserInsert;
      await authService.newUser(user);

      // cria sessão e seta cookie
      await authService.setUpSessionAndCookies(event, userId);
    } catch (err) {
      console.error('Register error:', err);

      // retorna o form com erro genérico (evite vazar detalhes de erro do DB)
      form.valid = false;
      form.errors?._errors?.push(m['errors.default.error']());

      setFlash({ type: 'error', message: m['toasts.default.error']() }, event.cookies);
      return fail(500, { form });
    }

    redirect('/', { type: 'success', message: m['toasts.register.success']() }, event.cookies);
  },

  // logout (mantive sua implementação original)
  logout: async (event: RequestEvent) => {
    if (!event.locals.session) {
      return fail(401);
    }

    await authService.invalidateSession(event.locals.session.id);
    authService.deleteSessionTokenCookie(event);

    redirect('/', { type: 'success', message: m['toasts.logout.success']() }, event.cookies);
  },
};
