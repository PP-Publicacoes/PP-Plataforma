import { sqliteView } from 'drizzle-orm/sqlite-core';
import { eq } from 'drizzle-orm';
import { communities, members } from '../schema/social';

export const communitiesMembersView = sqliteView('communities_members_view').as(qb =>
  qb
    .select({ community: communities, member: members })
    .from(communities)
    .innerJoin(members, eq(communities.id, members.communityId)),
);

export type CommunityMember = typeof communitiesMembersView.$inferSelect;
export type SidebarCommunity = {
  name: CommunityMember['community']['name'];
  slug: CommunityMember['community']['slug'];
  nickname: CommunityMember['member']['nickname'];
};
