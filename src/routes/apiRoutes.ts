/**
 * Auth paths appended to `getApiRoot()` (origin + `VITE_API_PREFIX`, default `/api/v1`).
 */
export const AuthApiPaths = {
  register: '/auth/register',
  login: '/auth/login',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  me: '/auth/me',
} as const;
