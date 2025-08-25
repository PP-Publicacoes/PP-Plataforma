import { z } from 'zod/v4';
import { TipoPoder } from '$lib/enums/poder';
import { preRequisitoSchema } from './geral';
import { GrauTreinamento, Pericia } from '$lib/enums/pericias';
import { StatusReferencia, StatusModificavel } from '$lib/enums/status';
import { BonusDefesa, Reducao } from '$lib/enums/defesa';
import { TipoRolagem } from '$lib/enums/rolagem';
import { Dado } from '$lib/enums/dado';
import { Atributo } from '$lib/enums/atributo';
import { TipoEquipamento } from '$lib/enums/equipamento';
import { Proficiencia } from '$lib/enums/proficiencia';
import { GrauAfinidade, Manifestacao } from '$lib/enums/manifestacao';

export const escalavelSchema = z.object({
  cada: z.number(),
  referencia: z.enum(StatusReferencia),
  status: z
    .object({
      valor: z.number(),
      modificavel: z.enum(StatusModificavel),
    })
    .optional(),
  rolagem: z.object({
    dado: z.enum(Dado),
    quantidade: z.number(),
  }),
});

export const estaticoSchema = z.object({
  pericia: z
    .object({
      pericias: z.enum(Pericia).array(),
      bonus: z.enum(GrauTreinamento),
    })
    .optional(),
  defesa: z.enum(BonusDefesa).optional(),
  reducao: z.enum(Reducao).optional(),
  rolagem: z
    .object({
      tipo: z.enum(TipoRolagem),
      pericia: z
        .object({
          pericias: z.enum(Pericia).array(),
          bonus: z.enum(GrauTreinamento).optional(),
          dado: z
            .object({
              dado: z.enum(Dado),
              quantidade: z.number(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

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
  item: z.object({
    tipo: z.enum(TipoEquipamento),
    proficiencia: z.enum(Proficiencia).array(),
    afinidade: z.object({
      manifestacao: z.enum(Manifestacao),
      grau: z.enum(GrauAfinidade),
    }),
  }),
});

export const poderSchema = z.object({
  tipo: z.enum(TipoPoder),
  nome: z.string(),
  descrição: z.string(),
  preRequisito: preRequisitoSchema,
  escalavel: escalavelSchema.optional(),
  estatico: estaticoSchema.optional(),
  custo: z.object({
    valor: z.number().optional(),
    quantidadeDados: z.number().optional(),
    status: z.enum(StatusModificavel).optional(),
    pericia: z.enum(Pericia).array().optional(),
  }),
  requerimentos: requerimentosSchema.optional(),
});
