import { createContext } from 'react';
import type { RegisterPayload } from '@/features/auth/api';
import type { AuthUser } from '@/shared/types/auth';

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True while validating a stored token against `GET /auth/me` on first load. */
  bootstrapping: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
