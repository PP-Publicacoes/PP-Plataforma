import { m } from '$lib/paraglide/messages';
import { z } from 'zod/v4';

/** login */
export const loginSchema = z.object({
	username: z
		.string()
		.nonempty({ error: m['errors.form.username.required']() })
		.min(3, { error: m['errors.form.username.min']() })
		.max(30, { error: m['errors.form.username.max']() }),
	password: z
		.string()
		.min(6, { error: m['errors.form.password.min']() })
		.max(30, { error: m['errors.form.password.max']() })
});

export type LoginSchema = typeof loginSchema;
export type LoginInput = z.infer<typeof loginSchema>;

/** register */
export const registerSchema = z
	.object({
		username: z
			.string()
			.nonempty({ error: m['errors.form.username.required']() })
			.min(2, { error: m['errors.form.username.min']() })
			.max(20, { error: m['errors.form.username.max']() }),
		email: z
			.email({ error: m['errors.form.email.error']() })
			.nonempty({ error: m['errors.form.email.required']() }),
		password: z
			.string()
			.min(8, { error: m['errors.form.password.min']() })
			.max(20, { error: m['errors.form.password.max']() })
			.refine((password) => /[A-Z]/.test(password), {
				error: m['errors.form.password.loweracse']()
			})
			.refine((password) => /[a-z]/.test(password), {
				error: m['errors.form.password.uppercase']()
			})
			.refine((password) => /[0-9]/.test(password), { error: m['errors.form.password.number']() })
			.refine((password) => /[!@#$%^&*]/.test(password), {
				error: m['errors.form.password.special']()
			}),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: m['errors.form.password.confirm_mismatch'](),
		path: ['confirmPassword']
	});

export type RegisterSchema = typeof registerSchema;
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotSchema = z.object({
	email: z
		.email({ error: m['errors.form.email.error']() })
		.nonempty({ error: m['errors.form.email.required']() })
});
export type ForgotInput = z.infer<typeof forgotSchema>;

export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, { error: m['errors.form.password.min']() })
			.max(20, { error: m['errors.form.password.max']() })
			.refine((password) => /[A-Z]/.test(password), {
				error: m['errors.form.password.loweracse']()
			})
			.refine((password) => /[a-z]/.test(password), {
				error: m['errors.form.password.uppercase']()
			})
			.refine((password) => /[0-9]/.test(password), { error: m['errors.form.password.number']() })
			.refine((password) => /[!@#$%^&*]/.test(password), {
				error: m['errors.form.password.special']()
			}),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: m['errors.form.password.confirm_mismatch'](),
		path: ['confirmPassword']
	});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
