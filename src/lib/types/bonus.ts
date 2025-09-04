import type { GrauTreinamento } from '$lib/enums/character/skills';
import type { TipoEquipamento } from '$lib/enums/equipment/equipment';

export type Bonus = {
  [TipoEquipamento.vestimenta]: number;
  [TipoEquipamento.utensilio]: number;
  treinamento: GrauTreinamento;
  outro: number;
};
