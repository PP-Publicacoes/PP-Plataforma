export const BonusDefesa = {
  I: 2,
  II: 4,
  III: 6,
  IV: 8,
  V: 10,
} as const;

export const Reducao = BonusDefesa;

export type BonusDefesa = (typeof BonusDefesa)[keyof typeof BonusDefesa];
export type Reducao = BonusDefesa;

export const CategoriaProtecao = {
  leve: 'protecaoLeve',
  pesada: 'protecaoPesada',
} as const;

export type CategoriaProtecao = (typeof CategoriaProtecao)[keyof typeof CategoriaProtecao];

