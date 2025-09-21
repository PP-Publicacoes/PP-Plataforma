import { eq } from 'drizzle-orm';
import { db } from '../db';
import { communitiesMembersView } from '../db/views/social';
import { communities, type CommunityInsert } from '../db/schema/social';

export class SocialService {
  async getAllCommunities() {
    return db.select().from(communities);
  }

  async getUserCommunities(userId: string) {
    return (
      await db
        .select()
        .from(communitiesMembersView)
        .where(eq(communitiesMembersView.member.userId, userId))
    ).map(cm => ({
      name: cm.community.name,
      slug: cm.community.slug,
      nickname: cm.member.nickname,
    }));
  }

  async newCommunity(community: CommunityInsert) {
    return db.insert(communities).values(community);
  }
}

export const socialService = new SocialService();
