export const Status = {
  vida: 'vida',
  esperanca: 'esperanca',
  medo: 'medo',
  nivel: 'nivel',
  patente: 'patente',
} as const;

export const StatusModificavel = {
  vida: Status.vida,
  esperanca: Status.esperanca,
} as const;

export const StatusReferenciavel = {
  medo: Status.medo,
  nivel: Status.nivel,
  patente: Status.patente,
} as const;

export type Status = (typeof Status)[keyof typeof Status];
export type StatusModificavel = (typeof StatusModificavel)[keyof typeof StatusModificavel];
export type StatusReferenciavel = (typeof StatusReferenciavel)[keyof typeof StatusReferenciavel];
