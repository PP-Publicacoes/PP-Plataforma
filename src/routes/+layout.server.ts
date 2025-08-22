import { getUser } from '$lib/server/auth';
import type { RequestEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = loadFlash(async (event: RequestEvent) => {
  const user = getUser(event);
  return { user };
});
