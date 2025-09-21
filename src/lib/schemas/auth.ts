import { m } from '$lib/paraglide/messages';
import { z } from 'zod/v4';

const usernameSchema = z
  .string()
  .nonempty({ message: m['errors.form.username.required']() })
  .min(2, { message: m['errors.form.username.min']({ min: 2 }) })
  .max(25, { message: m['errors.form.username.max']({ max: 25 }) });

const passwordSchema = z
  .string()
  .min(8, { message: m['errors.form.password.min']({ min: 8 }) })
  .max(20, { message: m['errors.form.password.max']({ max: 20 }) });

const passwordWithPolicySchema = passwordSchema
  .refine(p => /[A-Z]/.test(p), { message: m['errors.form.password.uppercase']() })
  .refine(p => /[a-z]/.test(p), { message: m['errors.form.password.lowercase']() })
  .refine(p => /[0-9]/.test(p), { message: m['errors.form.password.number']() })
  .refine(p => /[!@#$%^&*]/.test(p), { message: m['errors.form.password.special']() });

const emailSchema = z
  .email({ error: m['errors.form.email.error']() })
  .nonempty({ error: m['errors.form.email.required']() });

/** login */
export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type LoginSchema = typeof loginSchema;
export type LoginInput = z.infer<typeof loginSchema>;

/** register */
export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordWithPolicySchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    error: m['errors.form.password.confirm_mismatch'](),
    path: ['confirmPassword'],
  });

export type RegisterSchema = typeof registerSchema;
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotSchema = z.object({
  email: emailSchema,
});
export type ForgotInput = z.infer<typeof forgotSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordWithPolicySchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    error: m['errors.form.password.confirm_mismatch'](),
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
