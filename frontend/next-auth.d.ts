import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    is_pledged: boolean;
    pledge_amount: number;
    err?: string;
  }
}
