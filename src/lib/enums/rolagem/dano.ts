// TODO: outros tipos de dano

export const TipoDano = {
  perfuracao: 'perfuracao',
  mental: 'mental'
} as const;

export type TipoDano = (typeof TipoDano)[keyof typeof TipoDano];
