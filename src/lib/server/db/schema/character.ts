import type { GrauTreinamento } from '$lib/enums/character/skills';
import type { TipoEquipamento } from '$lib/enums/equipment/equipment';
import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { createSelectSchema } from 'drizzle-zod';
import { users } from './auth';
import { valuesToTuple } from '$lib/utils/enum-utils';
import { Patente } from '$lib/enums/character/patent';
import { Atributo } from '$lib/enums/character/atribute';
import type { Bonus } from '$lib/types/bonus';
import { poderes } from './power';

export const personagens = sqliteTable('personagens', {
  id: text('id').primaryKey(),
  userId: text('user_id'),

  vida: integer('vida').notNull(), // Status.vida : z.number().min(0)
  esperanca: integer('esperanca').notNull(),
  nivel: integer('nivel').notNull(),
  medo: integer('medo').notNull(),
  patente: text('patente', { enum: valuesToTuple(Patente) }).notNull(), // armazenar string do enum (valide com Zod)

  carga: integer('carga').notNull(), // z.number().min(1)
  defesa: integer('defesa').notNull(),

  fisico: integer('fisico').notNull(),
  destreza: integer('destreza').notNull(),
  carisma: integer('carisma').notNull(),
  erudicao: integer('erudicao').notNull(),
  raciocinio: integer('raciocinio').notNull(),
  sabedoria: integer('sabedoria').notNull(),
});

export const pericias = sqliteTable('pericias', {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  descricao: text('descricao').notNull(),
  atributo: text('atributo', { enum: valuesToTuple(Atributo) }).notNull(), // string do enum Atributo (valide com Zod)
  bonus: text('bonus', { mode: 'json' }).$type<Bonus>().notNull(), // { vestimenta, utensilio, treinamento, outro }
  penalidadeCarga: integer('penalidade_carga', { mode: 'boolean' }).notNull().default(false),
  somenteTreinado: integer('somente_treinado', { mode: 'boolean' }).notNull().default(false),
});

export const personagensRelations = relations(personagens, ({ many, one }) => ({
  user: one(users, {
    fields: [personagens.userId],
    references: [users.id],
  }),
  personagensParaPericias: many(personagemParaPericias),
  personagemParaPoderes: many(personagemParaPoderes),
}));

export const periciasRelations = relations(pericias, ({ many }) => ({
  personagensParaPericias: many(personagemParaPericias),
}));

export const personagemParaPericias = sqliteTable(
  'personagens_para_pericias',
  {
    personagemId: text('personagem_id')
      .notNull()
      .references(() => personagens.id),
    periciaId: text('pericia_id')
      .notNull()
      .references(() => pericias.id),
  },
  t => [primaryKey({ columns: [t.personagemId, t.periciaId] })],
);

export const personagemParaPoderes = sqliteTable(
  'personagem_para_poderes',
  {
    personagemId: text('personagem_id')
      .notNull()
      .references(() => personagens.id),
    poderId: text('poder_id')
      .notNull()
      .references(() => poderes.id),
  },
  t => [primaryKey({ columns: [t.personagemId, t.poderId] })],
);
