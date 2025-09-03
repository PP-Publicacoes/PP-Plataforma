export const TipoPoder = {
  passivo: 'passivo',
  ativo: 'ativo',
} as const;

export type TipoPoder = (typeof TipoPoder)[keyof typeof TipoPoder];
