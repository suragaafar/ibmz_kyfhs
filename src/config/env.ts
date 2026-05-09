/**
 * Application environment from `.env` in the EcoSense project root.
 *
 * Vite loads these files (in order, later overrides earlier): `.env`, `.env.local`,
 * `.env.[mode]`, `.env.[mode].local` — see https://vite.dev/guide/env-and-mode.html
 *
 * Only variables prefixed with `VITE_` are exposed here. Values are inlined at build
 * time; restart `npm run dev` after changing `.env`.
 *
 * Do not put secrets you cannot leak in the client bundle.
 */
export function getGeminiApiKey(): string | undefined {
  const v = import.meta.env.VITE_GEMINI_API_KEY;
  return v && v.trim() !== '' ? v : undefined;
}

/** REST API origin (no trailing slash). Empty if `VITE_API_URL` is unset. */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (!raw || raw.trim() === '') return '';
  return raw.replace(/\/+$/, '');
}

/**
 * API path prefix after origin (e.g. `/api/v1`). Backend serves both `/api/v1/...` and `/api/...`.
 */
export function getApiPathPrefix(): string {
  let p = import.meta.env.VITE_API_PREFIX?.trim();
  if (!p) p = '/api/v1';
  p = p.replace(/\/+$/, '');
  return p.startsWith('/') ? p : `/${p}`;
}

/** Origin + version prefix, e.g. `http://localhost:8080/api/v1`. No trailing slash. */
export function getApiRoot(): string {
  const base = getApiBaseUrl();
  if (!base) return '';
  return `${base}${getApiPathPrefix()}`;
}
