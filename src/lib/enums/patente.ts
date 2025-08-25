export const Patente = {
  recruta: 'recruta',
  peao: 'peao',
  operador: 'operador',
  agenteEspecial: 'agenteEspecial',
  oficialOperacoes: 'oficialOperacoes',
  agenteElite: 'agenteElite',
  lider: 'lider',
} as const;

export type Patente = (typeof Patente)[keyof typeof Patente];
