import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import {
  communities,
  communityInsertSchema,
  members,
  roles,
  type CommunityInsert,
} from '../db/schema/';
import { ROLE_PRESETS, type RoleName } from '$lib/utils/permissions';
import { generateId } from '$lib/utils/random';

export class SocialService {
  async getAllCommunities() {
    return db.select().from(communities);
  }

  async getUserCommunities(userId: string) {
    return await db
      .select({
        name: communities.name,
        slug: communities.slug,
        nickname: members.nickname,
      })
      .from(members)
      .innerJoin(communities, eq(communities.id, members.communityId))
      .where(eq(members.userId, userId));
  }

  async newCommunity(community: CommunityInsert) {
    const safeCommunity = {
      ...community,
      description: community.description.trim(),
      name: community.name.trim(),
    } satisfies CommunityInsert;

    const parsed = communityInsertSchema.parse(safeCommunity);
    return await db.insert(communities).values(parsed);
  }

  async getCommunityBySlug(slug: string) {
    return db
      .select()
      .from(communities)
      .where(eq(communities.slug, slug))
      .then(res => res[0]);
  }

  async getCommunityMembers(communityId: string) {
    return db.select().from(members).where(eq(members.communityId, communityId));
  }

  async addMemberToCommunity(communityId: string, userId: string, name: string, asAdmin = true) {
    // garante que os papéis existem e obtém o roleId desejado
    const roleMap = await this.createDefaultRoles(communityId);
    const roleId = asAdmin ? roleMap.Admin : roleMap.Member;

    return await db
      .insert(members)
      .values({
        communityId,
        userId,
        roleId,
        nickname: name,
        joinedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [members.communityId, members.userId],
        set: {
          roleId,
          nickname: name,
        },
      });
  }

  async createDefaultRoles(communityId: string) {
    await db.insert(roles).values(
      (Object.keys(ROLE_PRESETS) as RoleName[]).map(name => ({
        id: generateId(),
        communityId,
        name,
        description: `${name} role`,
        permissions: ROLE_PRESETS[name],
      })),
    );

    const rows = await db
      .select({ id: roles.id, name: roles.name })
      .from(roles)
      .where(
        and(
          eq(roles.communityId, communityId),
          inArray(roles.name, Object.keys(ROLE_PRESETS) as RoleName[]),
        ),
      );

    const map = Object.fromEntries(rows.map(r => [r.name as RoleName, r.id])) as Record<
      RoleName,
      string
    >;

    return map;
  }
}

export const socialService = new SocialService();
