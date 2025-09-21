export const TagScope = {
  community: 'community',
  table: 'table',
} as const;

export type TagScope = (typeof TagScope)[keyof typeof TagScope];
