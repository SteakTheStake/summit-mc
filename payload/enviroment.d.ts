export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URI: string;
      PAYLOAD_SECRET: string;
      PORT: number;
    }
  }
}
