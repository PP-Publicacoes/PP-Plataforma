export const Contexts = {
	user: 'userContext',
} as const;

export type Contexts = typeof Contexts[keyof typeof Contexts];
