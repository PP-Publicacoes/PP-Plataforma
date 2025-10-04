import type { RequestEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { loadFlash } from 'sveltekit-flash-message/server';
import { authService } from '$lib/server/services/auth';
import { socialService } from '$lib/server/services/social';

export const load: LayoutServerLoad = loadFlash(async (event: RequestEvent) => {
  const user = authService.getUserFromLocals(event);
  const communities = user ? await socialService.getUserCommunities(user.id) : [];
  return { user, communities };
});
