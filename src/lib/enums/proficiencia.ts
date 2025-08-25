import { CategoriaArma, CategoriaProtecao, TipoEquipamento } from './equipamento';

export const Proficiencia = {
  armasLeves: CategoriaArma.leve,
  armasPesadas: CategoriaArma.pesada,
  armasTaticas: CategoriaArma.tatica,
  explosivos: TipoEquipamento.explosivos,
  ritualisticos: TipoEquipamento.ritualistico,
  protecoesLeves: CategoriaProtecao.leve,
  protecoesPesadas: CategoriaProtecao.pesada,
};

export type Proficiencia = (typeof Proficiencia)[keyof typeof Proficiencia];
