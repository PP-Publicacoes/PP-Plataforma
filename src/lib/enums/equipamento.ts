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

export const CategoriaArma = {
  leve: 'armaLeve',
  tatica: 'armaTatica',
  pesada: 'armaPesada',
} as const;

export type CategoriaArma = (typeof CategoriaArma)[keyof typeof CategoriaArma];

export const CategoriaProtecao = {
  leve: 'protecaoLeve',
  pesada: 'protecaoPesada',
} as const;

export type CategoriaProtecao = (typeof CategoriaProtecao)[keyof typeof CategoriaProtecao];

export const CategoriaRitualistico = {
  componente: 'componente',
  catalisador: 'catalisador',
  amplificador: 'amplificador',
} as const;

export type CategoriaRitualistico =
  (typeof CategoriaRitualistico)[keyof typeof CategoriaRitualistico];
