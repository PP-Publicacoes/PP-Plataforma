import { CategoriaProtecao } from "./defense";
import { TipoEquipamento } from "./equipment";
import { CategoriaArma } from "./weapon";

export const Proficiencia = {
  armasSimples: CategoriaArma.simples,
  armasPesadas: CategoriaArma.pesada,
  armasTaticas: CategoriaArma.tatica,
  explosivos: TipoEquipamento.explosivos,
  ritualisticos: TipoEquipamento.ritualistico,
  protecoesLeves: CategoriaProtecao.leve,
  protecoesPesadas: CategoriaProtecao.pesada,
};

export type Proficiencia = (typeof Proficiencia)[keyof typeof Proficiencia];
