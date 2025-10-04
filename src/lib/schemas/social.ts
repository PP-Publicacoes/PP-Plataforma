import { m } from '$lib/paraglide/messages';
import { z } from 'zod/v4';

export const communitySchema = z.object({
  name: z
    .string()
    .nonempty({ message: m['errors.forms.name.required']() })
    .min(2, { message: m['errors.forms.name.min']({ min: 2 }) })
    .max(20, { message: m['errors.forms.name.max']({ max: 20 }) }),
  description: z.string().max(500, { message: m['errors.forms.description.max']({ max: 500 }) }),
  public: z.boolean().optional().default(true),
});

export type CommunitySchema = typeof communitySchema;
export type CommunityInput = z.infer<typeof communitySchema>;
