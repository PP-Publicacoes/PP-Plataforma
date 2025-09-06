// TODO: outros tipos de dano

export const TipoDano = {
  fisico: 'fisico',
  mental: 'mental',
  medo: 'medo',
  perigo: 'perigo',
} as const;

export type TipoDano = (typeof TipoDano)[keyof typeof TipoDano];
