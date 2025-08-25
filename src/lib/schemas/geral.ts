import { Pericia } from '$lib/enums/pericias';
import { z } from 'zod/v4';

export const preRequisitoSchema = z.object({
  pericia: z.enum(Pericia).array().optional(),
  kit: z.boolean().default(false),
  poder: z.string().optional(),
});
