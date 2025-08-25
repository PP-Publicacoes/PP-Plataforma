export const TipoRolagem = {
  dano: 'dano',
  pericia: 'pericia',
  save: 'save',
} as const;

export type TipoRolagem = (typeof TipoRolagem)[keyof typeof TipoRolagem];
