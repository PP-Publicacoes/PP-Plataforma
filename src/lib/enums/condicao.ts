export const Condicao = {
  gremio: 'gremio',
} as const;

export type Condicao = (typeof Condicao)[keyof typeof Condicao];
