import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchMeRequest, loginRequest, registerRequest, type RegisterPayload } from '@/features/auth/api';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/features/auth/constants';
import { AuthContext, type AuthContextValue } from '@/features/auth/context/auth-context';
import type { AuthUser } from '@/shared/types/auth';

function readStoredSession(): { token: string; user: AuthUser } | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const rawUser = localStorage.getItem(AUTH_USER_KEY);
  if (!token || !rawUser) return null;
  try {
    const user = JSON.parse(rawUser) as AuthUser;
    if (!user?.id || !user?.email) return null;
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName ?? null,
        createdAt: user.createdAt ?? '',
      },
    };
  } catch {
    return null;
  }
}

function persistSession(token: string, user: AuthUser): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

function initialAuthState(): { token: string | null; user: AuthUser | null } {
  const session = readStoredSession();
  return session ?? { token: null, user: null };
}

function hasStoredToken(): boolean {
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ token, user }, setAuth] = useState(initialAuthState);
  const [bootstrapping, setBootstrapping] = useState(hasStoredToken);

  useEffect(() => {
    const session = readStoredSession();
    if (!session) {
      setBootstrapping(false);
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const u = await fetchMeRequest(session.token);
        if (cancelled) return;
        persistSession(session.token, u);
        setAuth({ token: session.token, user: u });
      } catch {
        if (cancelled) return;
        clearSession();
        setAuth({ token: null, user: null });
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    persistSession(result.token, result.user);
    setAuth({ token: result.token, user: result.user });
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const result = await registerRequest(payload);
    persistSession(result.token, result.user);
    setAuth({ token: result.token, user: result.user });
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setAuth({ token: null, user: null });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      bootstrapping,
      login,
      register,
      logout,
    }),
    [user, token, bootstrapping, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
