export const System = {
  dnd5: 'dnd5',
  op: 'op',
  pf2: 'pf2',
  nimble: 'nimble',
  own: 'own',
} as const;

export type System = (typeof System)[keyof typeof System];
