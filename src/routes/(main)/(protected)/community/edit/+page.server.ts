import type { Actions} from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { communitySchema } from '$lib/schemas/social';

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

export const actions: Actions = {};
