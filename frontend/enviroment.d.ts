export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API: string;
      NEXT_PUBLIC_PY_API: string;
      AUTH_SECRET: string;
      PATREON_CLIENT_ID: string;
      PATREON_CLIENT_SECRET: string;
      PATREON_NAME: string;
      PATREON_CID: string;
    }
  }
}
