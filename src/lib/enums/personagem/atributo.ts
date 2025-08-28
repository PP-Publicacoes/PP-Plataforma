export const Atributo = {
  fisico: 'fisico',
  destreza: 'destreza',
  raciocinio: 'raciocinio',
  erudicao: 'erudicao',
  sabedoria: 'sabedoria',
  carisma: 'carisma',
} as const;

export type Atributo = (typeof Atributo)[keyof typeof Atributo];

