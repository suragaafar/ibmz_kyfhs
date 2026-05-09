/// <reference types="vite/client" />

/**
 * Variables declared here must be listed in `.env` / `.env.local` at the EcoSense
 * project root with the `VITE_` prefix. Only those keys are exposed to client code.
 */
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  /** API origin only, e.g. http://localhost:8080 */
  readonly VITE_API_URL?: string;
  /** Path prefix after origin; default /api/v1 (backend also mounts /api) */
  readonly VITE_API_PREFIX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
