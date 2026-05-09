import { getApiRoot } from '@/config/env';
import { AuthApiPaths } from '@/routes/apiRoutes';
import type { AuthUser } from '@/shared/types/auth';

interface RawUser {
  id?: string | number;
  email?: string;
  displayName?: string | null;
  createdAt?: string;
}

interface AuthSuccessBody {
  data?: {
    accessToken?: string;
    user?: RawUser;
  };
}

function mapUser(u: RawUser): AuthUser {
  const email = u.email != null ? String(u.email) : '';
  const id = u.id != null ? String(u.id) : email;
  if (!id || !email) {
    throw new Error('Server user object must include id and email.');
  }
  return {
    id,
    email,
    displayName: u.displayName === undefined || u.displayName === null ? null : String(u.displayName),
    createdAt: u.createdAt != null ? String(u.createdAt) : '',
  };
}

function extractAuthPayload(body: unknown): { token: string; user: AuthUser } {
  const { data } = body as AuthSuccessBody;
  const token = data?.accessToken;
  const u = data?.user;
  if (!token || typeof token !== 'string') {
    throw new Error('Server response missing data.accessToken.');
  }
  if (!u || typeof u !== 'object') {
    throw new Error('Server response missing data.user.');
  }
  return { token, user: mapUser(u) };
}

export async function parseApiError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as Record<string, unknown>;
    const err = body.error;
    if (err && typeof err === 'object' && err !== null) {
      const msg = (err as { message?: unknown }).message;
      if (typeof msg === 'string' && msg.trim()) return msg;
      const code = (err as { code?: unknown }).code;
      if (typeof code === 'string' && code.trim()) return code;
    }
    const msg = body.message ?? body.detail;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) return msg.map(String).join(', ');
  } catch {
    /* ignore */
  }
  return `Request failed (${res.status})`;
}

function authHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function requireApiRoot(): string {
  const root = getApiRoot();
  if (!root) {
    throw new Error('API is not configured. Set VITE_API_URL in your .env file.');
  }
  return root;
}

export async function loginRequest(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  const root = requireApiRoot();
  const res = await fetch(`${root}${AuthApiPaths.login}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error(await parseApiError(res));
  const data: unknown = await res.json();
  return extractAuthPayload(data);
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName?: string | null;
}

export async function registerRequest(payload: RegisterPayload): Promise<{ token: string; user: AuthUser }> {
  const root = requireApiRoot();
  const body: RegisterPayload = {
    email: payload.email,
    password: payload.password,
  };
  if (payload.displayName !== undefined && payload.displayName !== null && payload.displayName !== '') {
    body.displayName = payload.displayName;
  }

  const res = await fetch(`${root}${AuthApiPaths.register}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(await parseApiError(res));
  const data: unknown = await res.json();
  return extractAuthPayload(data);
}

export async function fetchMeRequest(token: string): Promise<AuthUser> {
  const root = requireApiRoot();
  const res = await fetch(`${root}${AuthApiPaths.me}`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  if (!res.ok) throw new Error(await parseApiError(res));
  const json = (await res.json()) as AuthSuccessBody;
  const u = json.data?.user;
  if (!u || typeof u !== 'object') {
    throw new Error('Server response missing data.user.');
  }
  return mapUser(u);
}

export async function forgotPasswordRequest(email: string): Promise<string> {
  const root = requireApiRoot();
  const res = await fetch(`${root}${AuthApiPaths.forgotPassword}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error(await parseApiError(res));
  const json = (await res.json()) as { data?: { message?: string } };
  const msg = json.data?.message;
  return typeof msg === 'string' && msg.trim() ? msg : 'If an account exists for that email, you will receive reset instructions.';
}

export async function resetPasswordRequest(token: string, newPassword: string): Promise<string> {
  const root = requireApiRoot();
  const res = await fetch(`${root}${AuthApiPaths.resetPassword}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ token, newPassword }),
  });

  if (!res.ok) throw new Error(await parseApiError(res));
  const json = (await res.json()) as { data?: { message?: string } };
  const msg = json.data?.message;
  return typeof msg === 'string' && msg.trim() ? msg : 'Your password has been updated.';
}
