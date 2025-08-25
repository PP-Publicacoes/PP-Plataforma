export const AuthTab = {
  login: 'login',
  register: 'register',
} as const;

export type AuthTab = (typeof AuthTab)[keyof typeof AuthTab];
