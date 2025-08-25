import { Atributo } from '$lib/enums/atributo';
import { TipoEquipamento } from '$lib/enums/equipamento';
import { GrauTreinamento } from '$lib/enums/pericias';
import { Proficiencia } from '$lib/enums/proficiencia';
import { z } from 'zod/v4';
import { preRequisitoSchema } from './geral';
import { Patente } from '$lib/enums/patente';
import { Status } from '$lib/enums/status';
import { poderSchema } from './poderes';

export const statusScheam = z.object({
  [Status.vida]: z.number().min(0),
  [Status.esperanca]: z.number().min(0),
  [Status.nivel]: z.number().min(0),
  [Status.medo]: z.number().min(0),
  [Status.patente]: z.enum(Patente),
});

export const atributoSchema = z.object({
  [Atributo.fisico]: z.number(),
  [Atributo.destreza]: z.number(),
  [Atributo.carisma]: z.number(),
  [Atributo.erudicao]: z.number(),
  [Atributo.raciocinio]: z.number(),
  [Atributo.sabedoria]: z.number(),
});

export const bonusSchema = z.object({
  treinamento: z.enum(GrauTreinamento),
  [TipoEquipamento.vestimenta]: z.number(),
  [TipoEquipamento.utensilio]: z.number(),
  outro: z.number(),
});

export const periciaSchema = z.object({
  atributo: z.enum(Atributo),
  bonus: bonusSchema,
  preRequisito: preRequisitoSchema,
  penalidadeCarga: z.boolean().default(false),
  somenteTreinado: z.boolean().default(false),
});

export const personagemSchema = z.object({
  status: statusScheam,
  carga: z.number().min(1),
  proficiencias: z.enum(Proficiencia).array(),
  defesa: z.number(),
  atributos: atributoSchema,
  poderes: poderSchema.array().optional(),
});
