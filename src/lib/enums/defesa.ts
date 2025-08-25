export const BonusDefesa = {
  I: 2,
  II: 4,
  III: 6,
  IV: 8,
  V: 10,
} as const;

export const Reducao = BonusDefesa;

export const TipoArmadura = {
  nenhuma: 'nenhuma',
  media: 'media',
  pesada: 'pesada',
} as const;

export type BonusDefesa = (typeof BonusDefesa)[keyof typeof BonusDefesa];
export type TipoArmadura = (typeof TipoArmadura)[keyof typeof TipoArmadura];
export type Reducao = BonusDefesa;
