import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { communities, tags } from '../social';
import { tables } from '../table';

export const communityToTags = sqliteTable(
  'community_to_tags',
  {
    communityId: text('community_id')
      .notNull()
      .references(() => communities.id),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id),
  },
  t => [primaryKey({ columns: [t.communityId, t.tagId], name: 'community_tags_pk' })],
);

export const tableToTags = sqliteTable(
  'table_to_tags',
  {
    tableId: text('table_id')
      .notNull()
      .references(() => tables.id),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id),
  },
  t => [primaryKey({ columns: [t.tableId, t.tagId], name: 'table_tags_pk' })],
);
