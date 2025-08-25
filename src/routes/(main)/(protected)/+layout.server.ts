// src/routes/(protected)/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { requireLogin } from '$lib/server/auth';

export const load: LayoutServerLoad = async event => {
  const user = requireLogin(event);
  return { user };
};
