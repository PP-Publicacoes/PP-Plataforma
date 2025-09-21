// src/routes/(protected)/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { authService } from '$lib/server/services/auth';

export const load: LayoutServerLoad = async event => {
  const user = authService.requireLogin(event);
  return { user };
};
