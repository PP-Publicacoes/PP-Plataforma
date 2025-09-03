import { z } from 'zod/v4';
import { GrauTreinamento, Pericia } from '$lib/enums/character/pericias';
import { StatusModificavel, StatusReferenciavel } from '$lib/enums/character/status';
import { Atributo } from '$lib/enums/character/atributo';
import { TipoPoder } from '$lib/enums/power/power';
import { BonusDefesa, Reducao } from '$lib/enums/equipment/defense';
import { TipoDano } from '$lib/enums/roll/damage';
import { TipoArma } from '$lib/enums/equipment/weapon';
import { Proficiencia } from '$lib/enums/equipment/proficiency';
import { GrauAfinidade, Assombracao } from '$lib/enums/fear/haunting';

/*
Poderes escaláveis possuem duas partes principais:
  - referencia: referencia para o calculo
    - cada: fator de constancia para calcular quantas modificacoes serão aplicadas (ex.: 1)
    - referenciavel: fator referenciavel para base do calculo (ex.: nível)
  - modificacao: aonde aplicar o resultado do calculo
    - valor: valor para apliacao das modificacoes (ex.: 1)
    - modificavel: fator modificavel que receberá as modificacoes (ex.: PV)
  -> a cada 1 nível você ganha 1 PV
*/
export const escalavelSchema = z.object({
  referencia: z.object({
    cada: z.number(),
    referenciavel: z.enum(StatusReferenciavel),
  }),
  modificacao: z.object({
    valor: z.number(),
    modificavel: z.enum(StatusModificavel),
  }),
});

/*
Poderes estáticos são mais genéricos. Os tipos de modificacoes são:
  - pericia: afetam rolagem de pericias
    - pericias: conjunto de pericias afetadas (ex.: Diplomacia, Enganação e Intimidação)
    - bonus: bonus numerico aplicado para as rolagens (ex.: +2)
    - dados: numero de dados adicionais para as rolagens (ex.: +-1)
  - defesa: valor a adicionar na defesa (ex.: +2 em defesa)
  - reducao: afetam a reducao de dano
    - dano: tipos de dano aplicavéis (ex.: perfuração, corte e balístico)
    - reducao: valor a ser reduzido (ex.: redução 4)
  - dano: afetam rolagens de dano
    - armas: tipos de armas aplicaveis (ex.: armas de fogo e de disparo / armas corpo a corpo)
    - bonus: valor a ser adicionado na rolagem (ex.: +ERU, +AGI...)
    - dados: dados adicionais na rolagem (ex.: +1 dado da arma)
  -> você ganha +2 em Diplomacia, Enganação e Intimidação
  -> você ganha +2 em Defesa
  -> você ganha 2 redução de dano perfuração, balístico
  -> você ganha +1 dado de dano com armas corpo a corpo
  -> você soma sua Erudição/Agilidade com armas de fogo e de disparo
*/
export const estaticoSchema = z.object({
  pericia: z
    .object({
      pericias: z.enum(Pericia).array(),
      bonus: z.enum(GrauTreinamento).optional(),
      dados: z.number().optional(),
    })
    .optional(),
  defesa: z.enum(BonusDefesa).optional(),
  reducao: z
    .object({
      dano: z.enum(TipoDano).array(),
      reducao: z.enum(Reducao),
    })
    .optional(),
  dano: z
    .object({
      armas: z.enum(TipoArma).array(),
      bonus: z.number().optional(),
      dados: z.number().optional(),
    })
    .optional(),
});

// TODO: colocar alguns exemplos
/*
Alguns poderes possuem pré-requisitos em forma de:
  - atributo: precisa ter uma determinada pontuação em algum atributo
    - atributo: atributo em questão (ex.: Agilidade)
    - valor: valor do atributo (ex.: 2)
  - pericia: precista possuir determinado treinamento em algumas pericias
    - pericias: conjunto de pericias (ex.: Pontaria / Diplomacia e Engação)
    - treinamento: grau de treinamento necessário (ex.: expert)
  - proficiencia: precisa de algumas proficiencias (ex.: Protecao Pesada)
  - afinidade: precisa ter afinidade com alguma manifestacao (ex.: Caos)
  ->
  ->
*/
export const requerimentosSchema = z.object({
  atributo: z
    .object({
      atributo: z.enum(Atributo),
      valor: z.number(),
    })
    .optional(),
  pericia: z
    .object({
      pericias: z.enum(Pericia).array(),
      treinamento: z.enum(GrauTreinamento),
    })
    .optional(),
  proficiencia: z.enum(Proficiencia).array(),
  afinidade: z.object({
    manifestacao: z.enum(Assombracao),
    grau: z.enum(GrauAfinidade),
  }),
});

// TODO: documentar esse schema seguindo o padrão ou sugerindo outro
/*
 */
export const preRequisitoSchema = z.object({
  pericias: z
    .object({
      pericia: z.enum(Pericia).array(),
      treinamento: z.enum(GrauTreinamento),
    })
    .optional(),
  atributos: z
    .object({
      atributo: z.enum(Atributo),
      valor: z.number(),
    })
    .array()
    .optional(),
  poderes: z.string().array().optional(),
});

// TODO: criar esse schema
/*
Alguns poderes possuem um custo, tanto para ativar quanto geral:
  - ativacao: no caso de poderes que requerem uma ativacao
    - valor: valor do custo (ex.: 2)
    - modificavel: fator modificavel usado para a ativacao (ex.: PE)
  - passivo: no caso de poderes que possuem um custo passivo
    - rolagem: afetam a rolagem de pericias
      - valor: valor numerico do custo (ex.: -2)
      - dados: numero de dados do custo (ex.: -1)
      - pericias: pericias afetadas (ex.: Diplomacia, Enganação e Intimidação)
    - status: afetam o status do personagem
      - valor: valor numérico do custo (ex.: -4)
      - modificavel: fator modificável para aplicar o custo (ex.: PE)
*/

// TODO: documentar e usar o schema de custo criado acima
/*
 */
export const poderSchema = z.object({
  tipo: z.enum(TipoPoder).array(),
  id: z.string(),
  nome: z.string(),
  descrição: z.string(),
  preRequisito: preRequisitoSchema,
  escalavel: escalavelSchema.optional(),
  estatico: estaticoSchema.optional(),
  // custo: z.object({}),
  requerimentos: requerimentosSchema.optional(),
});
