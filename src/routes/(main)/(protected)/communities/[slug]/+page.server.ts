import { socialService } from '$lib/server/services/social';
import type { PageServerLoad } from './$types';
import { authService } from '$lib/server/services/auth';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  const community = await socialService.getCommunityBySlug(slug);
  const creator = await authService.getUserById(community.creatorId);
  const members = await socialService.getCommunityMembers(community.id);

  return { community, creator, members };
};
