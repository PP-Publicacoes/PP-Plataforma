export const Fonte = {
  medo: 'medo',
  esperanca: 'esperanca',
} as const;

export type Fonte = (typeof Fonte)[keyof typeof Fonte];
