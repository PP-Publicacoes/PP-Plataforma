import { getUser } from '$lib/server/auth';
import type { RequestEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event: RequestEvent) => {
	const user = getUser(event);
	return { user };
};
