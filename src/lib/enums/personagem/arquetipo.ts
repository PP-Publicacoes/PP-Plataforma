export const Arquetipo = {
  combatente: 'combatente',
  especialista: 'especialista',
  conjurador: 'conjurador',
  monstruoso: 'monstruoso',
} as const;

export type Arquetipo = (typeof Arquetipo)[keyof typeof Arquetipo];
