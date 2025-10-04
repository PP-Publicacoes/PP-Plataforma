import type { Actions, RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { communitySchema, type CommunityInput } from '$lib/schemas/social';
import { authService } from '$lib/server/services/auth';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { m } from '$lib/paraglide/messages';
import { generateDeterministicSlug, generateId } from '$lib/utils/random';
import type { CommunityInsert } from '$lib/server/db/schema';
import { socialService } from '$lib/server/services/social';

export const load: PageServerLoad = async ({ parent }) => {
  // Retorna o usuário quando houver sessão ativa, caso contrário retorna {}.
  // A página que usa esse arquivo pode renderizar formulários de login/register
  // quando `user` for null/undefined, ou mostrar informações/ação de logout quando existir.
  const { user } = await parent();
  return {
    commnunityForm: await superValidate(zod4(communitySchema)),
    user,
  };
};

export const actions: Actions = {
  edit: async (event: RequestEvent) => {
    // exige usuário autenticado
    const user = authService.getUserFromLocals(event)!;

    // valida o formulário com zod
    const form = await superValidate(event, zod4(communitySchema));
    if (!form.valid) {
      setFlash({ type: 'error', message: m['toasts.default.error']() }, event.cookies);
      return fail(400, { form });
    }

    const id = generateId();
    const { name, description } = form.data as CommunityInput;

    const slug = generateDeterministicSlug(`${name}-${id}`);

    const payload: CommunityInsert = {
      id,
      name,
      slug,
      description: description,
      createdAt: new Date(),
      creatorId: user.id,
    };

    try {
      await socialService.newCommunity(payload);
    } catch (err) {
      console.error('Erro ao criar comunidade:', err);
      form.valid = false;
      form.errors?._errors?.push(m['errors.default.error']());

      setFlash({ type: 'error', message: m['toasts.community.edit.error']() }, event.cookies);
      return fail(500, { form });
    }

    // redirecione para a página da comunidade (ajuste a rota conforme seu app)
    redirect(
      `/communities/${slug}`,
      { type: 'success', message: m['toasts.community.edit.success']() },
      event.cookies,
    );
  },
};
