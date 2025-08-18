import { requireLogin } from '$lib/server/auth';
import type { RequestEvent } from '@sveltejs/kit';
export const POST = async (event: RequestEvent) => {
  requireLogin(event);
  // agora o usuário existe em event.locals.user
};
