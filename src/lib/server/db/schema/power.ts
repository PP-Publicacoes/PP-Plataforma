import { TipoPoder } from '$lib/enums/power/power';
import type { Escalavel, Estatico, RequerimentoPoder } from '$lib/types/power';
import { valuesToTuple } from '$lib/utils/enum-utils';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const poderes = sqliteTable('poderes', {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  descricao: text('descricao').notNull(),
  tipo: text('tipo', { enum: valuesToTuple(TipoPoder) }).notNull(),
  escalavel: text('escalavel', { mode: 'json' }).$type<Escalavel>(),
  estatico: text('estatico', { mode: 'json' }).$type<Estatico>(),
  requerimentos: text('requerimentos', { mode: 'json' }).$type<RequerimentoPoder>(),
});
