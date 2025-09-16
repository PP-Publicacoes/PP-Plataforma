import { db } from '../db';
import { communities } from '../db/schema/table';

export class CommunityService {
  async getAllCommunities() {
    return db.select().from(communities);
  }

  async newCommunity(community) {
    return db.insert(communities).values(community);
  }
}
