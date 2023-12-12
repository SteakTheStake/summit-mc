import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Patreon from "next-auth/providers/patreon";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Patreon({
      clientId: process.env.PATREON_CLIENT_ID,
      clientSecret: process.env.PATREON_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identity.memberships identity[email] identity",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token, user }) {
      const { accessToken, id } = token;
      // @ts-ignore
      session.user.id = id;
      // @ts-ignore
      session.accessToken = accessToken;

      try {
        const pledeRes = await fetch(
          "https://www.patreon.com/api/oauth2/api/current_user",
          {
            method: "get",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const pledges = await pledeRes.json();
        console.log(JSON.stringify(pledges));

        // const isPledged = pledges.
      } catch {}

      return session;
    },
    jwt({ account, token, user }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
});
