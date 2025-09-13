export const BonusDefesa = {
  I: 'I',
  II: 'II',
  III: 'III',
  IV: 'IV',
  V: 'V',
} as const;

export const Reducao = BonusDefesa;

export type BonusDefesa = (typeof BonusDefesa)[keyof typeof BonusDefesa];
export type Reducao = BonusDefesa;

export const CategoriaProtecao = {
  leve: 'protecaoLeve',
  pesada: 'protecaoPesada',
} as const;

export type CategoriaProtecao = (typeof CategoriaProtecao)[keyof typeof CategoriaProtecao];
