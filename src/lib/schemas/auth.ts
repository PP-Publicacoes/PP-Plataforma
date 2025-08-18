import { m } from '$lib/paraglide/messages';
import z4 from 'zod/v4';

/** login */
export const loginSchema = z4.object({
	username: z4
		.string()
		.nonempty({ message: m['errors.form.username.required']() })
		.min(3, { message: m['errors.form.username.min']() })
		.max(30, { message: m['errors.form.username.max']() }),
	password: z4
		.string()
		.min(6, { message: m['errors.form.password.min']() })
		.max(30, { message: m['errors.form.password.max']() })
});

export type LoginSchema = typeof loginSchema;
export type LoginInput = z4.infer<typeof loginSchema>;

/** register */
export const registerSchema = z4
	.object({
		username: z4
			.string()
			.nonempty({ message: m['errors.form.username.required']() })
			.min(2, { message: m['errors.form.username.min']() })
			.max(20, { message: m['errors.form.username.max']() }),
		email: z4
			.email({ message: m['errors.form.email.error']() })
			.nonempty({ message: m['errors.form.email.required']() }),
		password: z4
			.string()
			.min(8, { message: m['errors.form.password.min']() })
			.max(20, { message: m['errors.form.password.max']() })
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
		confirmPassword: z4.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: m['errors.form.password.confirm_mismatch'](),
		path: ['confirmPassword']
	});

export type RegisterSchema = typeof registerSchema;
export type RegisterInput = z4.infer<typeof registerSchema>;

export const forgotSchema = z4.object({
	email: z4
		.email({ message: m['errors.form.email.error']() })
		.nonempty({ message: m['errors.form.email.required']() })
});
export type ForgotInput = z4.infer<typeof forgotSchema>;

export const resetPasswordSchema = z4
	.object({
		password: z4
			.string()
			.min(8, { message: m['errors.form.password.min']() })
			.max(20, { message: m['errors.form.password.max']() })
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
		confirmPassword: z4.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: m['errors.form.password.confirm_mismatch'](),
		path: ['confirmPassword']
	});

export type ResetPasswordInput = z4.infer<typeof resetPasswordSchema>;
