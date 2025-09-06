import type { Dado } from '$lib/enums/roll/dice';
import { relations } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const weapons = sqliteTable('weapons', {
  dado: text('dado').$type<Dado>().notNull(),
  numeroDados: integer('numero_dados').notNull().default(1),
  margemCritico: integer('margem_critico').notNull().default(0),
  ameaca: integer('ameaca').notNull().default(1),
});
