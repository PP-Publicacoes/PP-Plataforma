export const Eixo = {
  corpo: 'corpo',
  mente: 'mente',
  espirito: 'espirito',
} as const;

export type Eixo = (typeof Eixo)[keyof typeof Eixo];

export const Fonte = {
  medo: 'medo',
  esperanca: 'esperanca',
} as const;

export type Fonte = (typeof Fonte)[keyof typeof Fonte];

export const Assombracao = {
  apatia: 'apatia',
  caos: 'caos',
  carne: 'carne',
  conhecimento: 'conhecimento',
  eter: 'eter',
  morte: 'morte',
  neurose: 'neurose',
  odio: 'odio',
  radiancia: 'radiancia',
  sangue: 'sangue',
  plasma: 'plasma',
  vazio: 'vazio',
} as const;

export const GrauAfinidade = {
  I: 'I',
  II: 'II',
  III: 'III',
  IV: 'IV',
} as const;

export type GrauAfinidade = (typeof GrauAfinidade)[keyof typeof GrauAfinidade];
export type Assombracao = (typeof Assombracao)[keyof typeof Assombracao];

// export const AssombracaoPorEixo: Record<Eixo, Manifestacao> = {
//   [Eixo.corpo]: Manifestacao.carne,
//   [Eixo.espirito]: Manifestacao.apatia,
//   ...
// }
