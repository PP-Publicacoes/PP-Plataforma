export const TipoEquipamento = {
  arma: 'arma',
  protecao: 'protecao',
  explosivos: 'explosivos',
  ritualistico: 'ritualistico',
  vestimenta: 'vestimenta',
  utensilio: 'utensilio',
  kits: 'kits',
  geral: 'geral',
} as const;

export type TipoEquipamento = (typeof TipoEquipamento)[keyof typeof TipoEquipamento];
export const CategoriaRitualistico = {
  componente: 'componente',
  catalisador: 'catalisador',
  amplificador: 'amplificador',
} as const;

export type CategoriaRitualistico =
  (typeof CategoriaRitualistico)[keyof typeof CategoriaRitualistico];

