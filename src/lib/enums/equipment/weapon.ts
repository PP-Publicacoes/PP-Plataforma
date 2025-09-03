export const CategoriaArma = {
  simples: 'armaSimples',
  tatica: 'armaTatica',
  pesada: 'armaPesada',
} as const;

export type CategoriaArma = (typeof CategoriaArma)[keyof typeof CategoriaArma];

export const TipoArma = {
  leve: 'armaLeve',
  agil: 'armaAgil',
  umaMao: 'armaUmaMao',
  duasMaos: 'armaDuasMaos',
  fogo: 'armaFogo',
  disparo: 'armaDisparo',
} as const;

export type TipoArma = (typeof TipoArma)[keyof typeof TipoArma];
