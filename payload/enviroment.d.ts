export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URI: string;
      PAYLOAD_SECRET: string;
      PORT: number;
      PATREON_NAME: string;
      PATREON_CID: string;
      KEY: string;
      PYTHON_SERVER: string;
    }
  }
}
