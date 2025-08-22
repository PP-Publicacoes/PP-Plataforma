// +page.server.ts
import * as auth from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {
	loginSchema,
	registerSchema,
	type LoginInput,
	type RegisterInput
} from '$lib/schemas/auth';
import { m } from '$lib/paraglide/messages';
import { generateDeterministicSlug } from '$lib/utils/random';
import { AuthTab } from '$lib/enums/auth-tab';
import { hashPassword, verifyPassword } from '$lib/server/password';
import { redirect, setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event: RequestEvent) => {
	// Retorna o usuário quando houver sessão ativa, caso contrário retorna {}.
	// A página que usa esse arquivo pode renderizar formulários de login/register
	// quando `user` for null/undefined, ou mostrar informações/ação de logout quando existir.
	const t = event.url.searchParams.get('t');
	return {
		tab: (t as AuthTab) ?? AuthTab.login,
		loginForm: await superValidate(zod4(loginSchema)),
		registerForm: await superValidate(zod4(registerSchema))
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
		const results = await db.select().from(table.user).where(eq(table.user.username, username));
		const existingUser = results.at(0);

		if (!existingUser) {
			// marca erro genérico (não vaze info) e retorna o form
			form.valid = false;
			form.errors?.username?.push(m['errors.form.auth.invalid_credentials']());

      setFlash({ type: 'error', message: m['toast.login.error']() }, event.cookies);
			return fail(400, { form });
		}

		// verifica senha
		const validPassword = await verifyPassword(existingUser.passwordHash, password);

		if (!validPassword) {
			form.valid = false;
			form.errors?.password?.push(m['errors.form.auth.invalid_credentials']());

      setFlash({ type: 'error', message: m['toast.login.error']() }, event.cookies);
			return fail(400, { form });
		}

		// criado sessao e cookie
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		// sucesso -> redireciona
		redirect('/', { type: 'success', message: m['toast.login.success']() }, event.cookies);
	},

	// register: valida dados, verifica unicidade, hash e insere
	register: async (event: RequestEvent) => {
		const form = await superValidate(event, zod4(registerSchema));

		if (!form.valid) {
      setFlash({ type: 'error', message: m['toast.register.error']() }, event.cookies);
			return fail(400, { form });
		}

		const { username, password, email } = form.data as RegisterInput;

		// verifica se username ou email já existem
		const byUsername = await db.select().from(table.user).where(eq(table.user.username, username));
		if (byUsername.length > 0) {
			form.valid = false;
			form.errors?.username?.push(m['errors.form.username.exists']());

      setFlash({ type: 'error', message: m['toast.register.error']() }, event.cookies);
			return fail(400, { form });
		}

		const byEmail = await db.select().from(table.user).where(eq(table.user.email, email));
		if (byEmail.length > 0) {
			form.valid = false;
			form.errors?.email?.push(m['errors.form.email.exists']());

      setFlash({ type: 'error', message: m['toast.register.error']() }, event.cookies);
			return fail(400, { form });
		}

		// hash da senha
		const passwordHash = await hashPassword(password);

		// gera id do usuário (usa sua função generateUserId)
		const userId = auth.generateUserId();

		try {
			await db.insert(table.user).values({
				id: userId,
				username,
				email,
				passwordHash,
				slug: generateDeterministicSlug(userId)
			});

			// cria sessão e seta cookie
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);

			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (err) {
			console.error('Register error:', err);

			// retorna o form com erro genérico (evite vazar detalhes de erro do DB)
			form.valid = false;
			form.errors?._errors?.push(m['errors.form.default.error']());

      setFlash({ type: 'error', message: m['toast.default.error']() }, event.cookies);
			return fail(500, { form });
		}

		redirect('/', { type: 'success', message: m['toast.register.success']() }, event.cookies);
	},

	// logout (mantive sua implementação original)
	logout: async (event: RequestEvent) => {
		if (!event.locals.session) {
			return fail(401);
		}

		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		redirect('/', { type: 'success', message: m['toast.logout.success']() }, event.cookies);
	}
};
