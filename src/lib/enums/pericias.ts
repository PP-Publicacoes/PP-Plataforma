// TODO: Fazer o resto

export const Pericia = {
  gremio: 'gremio',
} as const;

export type Pericia = (typeof Pericia)[keyof typeof Pericia];

export const GrauTreinamento = {
  parcial: 1,
  normal: 2,
  veterano: 4,
  expert: 6,
} as const;

export type GrauTreinamento = (typeof GrauTreinamento)[keyof typeof GrauTreinamento];
