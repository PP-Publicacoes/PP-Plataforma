import type { Eixo } from './eixo';

export const Manifestacao = {
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
export type Manifestacao = (typeof Manifestacao)[keyof typeof Manifestacao];
// export const ManifestacaoPorEixo: Record<Eixo, Manifestacao> = {
//   [Eixo.corpo]: Manifestacao.carne,
//   [Eixo.espirito]: Manifestacao.apatia,
//   ...
// }
