import { m } from '$lib/paraglide/messages';
import { z } from 'zod/v4';

export const communitySchema = z.object({
  name: z
    .string()
    .nonempty({ message: m['errors.form.name.required']() })
    .min(2, { message: m['errors.form.name.min']({ min: 2 }) })
    .max(20, { message: m['errors.form.name.max']({ max: 20 }) }),
  description: z.string().max(500, { message: m['errors.form.description.max']({ max: 500 }) }),
});

export type CommunitySchema = typeof communitySchema;
export type CommunityInput = z.infer<typeof communitySchema>;
