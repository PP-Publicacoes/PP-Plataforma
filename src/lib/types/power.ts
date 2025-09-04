import type { BonusDefesa, Reducao } from '$lib/enums/equipment/defense';
import type { TipoArma } from '$lib/enums/equipment/weapon';
import type { TipoDano } from '$lib/enums/roll/damage';
import type { StatusModificavel, StatusReferenciavel } from '$lib/enums/character/status';
import type { Proficiencia } from '$lib/enums/equipment/proficiency';
import type { Assombracao, GrauAfinidade } from '$lib/enums/fear/haunting';
import type { GrauTreinamento, Pericia } from '$lib/enums/character/skills';
import type { Atributo } from '$lib/enums/character/atribute';

export type Estatico = {
  pericia?: {
    pericias: Pericia[];
    bonus?: GrauTreinamento;
    dados?: number;
  };
  defesa?: BonusDefesa;
  reducao?: {
    dano: TipoDano[];
    reducao: Reducao;
  };
  dano?: {
    armas: TipoArma[];
    bonus?: number;
    dados?: number;
  };
};

export type Escalavel = {
  cada: number;
  referenciavel: StatusReferenciavel;
  valor: number;
  modificavel: StatusModificavel;
};

export type RequerimentoPoder = {
  atributo?: {
    atributos: Atributo[];
    valor: number;
  };
  pericia?: {
    pericias: Pericia[];
    grau: GrauTreinamento;
  };
  proficiencia?: Proficiencia[];
  afinidade?: {
    assombracao: Assombracao;
    grau: GrauAfinidade;
  };
  poder?: string[];
};
