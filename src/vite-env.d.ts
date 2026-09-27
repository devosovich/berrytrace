/// <reference types="vite/client" />

/** Build-time settings, read from the environment (see src/app/site-config.ts). */
interface ImportMetaEnv {
  readonly VITE_SUBSCRIBE_ENDPOINT?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_PRIVACY_POLICY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
