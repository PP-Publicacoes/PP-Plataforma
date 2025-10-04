import { authService } from '$lib/server/services/auth';
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async (event: RequestEvent) => {
  authService.requireLogin(event);
  // agora o usuário existe em event.locals.user
};
