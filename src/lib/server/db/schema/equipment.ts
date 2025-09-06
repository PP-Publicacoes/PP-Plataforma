import { TipoDano } from '$lib/enums/roll/damage';
import { Dado } from '$lib/enums/roll/dice';
import type { ExtrasArmas } from '$lib/types/equipment';
import { valuesToTuple } from '$lib/utils/enum-utils';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const poderes = sqliteTable('weapons', {
  nome: text('nome').notNull(),
  dado: text('dado', { enum: valuesToTuple(Dado) }).notNull(),
  numeroDados: integer('numero_dados').notNull().default(1),
  margemCritico: integer('margem_critico').notNull().default(0),
  ameaca: integer('ameaca').notNull().default(1),
  tipoDano: text('tipo_dano', { enum: valuesToTuple(TipoDano) }).notNull(),
  extras: text('extras',  { mode: 'json' }).$type<ExtrasArmas>().notNull(),
});
