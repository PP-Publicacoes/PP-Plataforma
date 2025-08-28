import { TipoEquipamento } from '$lib/enums/equipamento/equipamento';
import { GrauTreinamento } from '$lib/enums/personagem/pericias';
import { z } from 'zod/v4';
import { poderSchema } from './poderes';
import { Status } from '$lib/enums/personagem/status';
import { Patente } from '$lib/enums/personagem/patente';
import { Atributo } from '$lib/enums/personagem/atributo';
import { Proficiencia } from '$lib/enums/equipamento/proficiencia';

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
  [TipoEquipamento.vestimenta]: z.number(),
  [TipoEquipamento.utensilio]: z.number(),
  treinamento: z.enum(GrauTreinamento),
  outro: z.number(),
});

export const periciaSchema = z.object({
  atributo: z.enum(Atributo),
  bonus: bonusSchema,
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
