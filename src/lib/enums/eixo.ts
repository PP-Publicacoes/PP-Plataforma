export const Eixo = {
  corpo: 'corpo',
  mente: 'mente',
  espirito: 'espirito',
} as const;

export type Eixo = (typeof Eixo)[keyof typeof Eixo];
