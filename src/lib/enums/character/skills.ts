// TODO: Fazer o resto

export const Pericia = {
  gremio: 'gremio',
} as const;

export type Pericia = (typeof Pericia)[keyof typeof Pericia];

export const GrauTreinamento = {
  parcial: 'parcial',
  normal: 'normal',
  veterano: 'veterano',
  expert: 'expert',
} as const;

export type GrauTreinamento = (typeof GrauTreinamento)[keyof typeof GrauTreinamento];
