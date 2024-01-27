import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Patreon from "next-auth/providers/patreon";
import { IsPlegdedProps } from "./auth-types";

const store = process.env.PATREON_NAME;

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
      session.accessToken = accessToken;

      try {
        const pledeRes = await fetch(
          "https://www.patreon.com/api/oauth2/api/current_user",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const pledges: IsPlegdedProps = await pledeRes.json();
        const isPledged = pledges.included.find((e) =>
          e.attributes.url?.includes(store),
        );

        if (isPledged && isPledged.attributes.amount) {
          const amount = isPledged.attributes.amount;
          session.is_pledged = amount > 299 ? true : false;
          session.pledge_amount = amount;
        } else {
          session.is_pledged = false;
          session.pledge_amount = 0;
        }
      } catch (err) {
        session.err = JSON.stringify(err);
        session.is_pledged = false;
        session.pledge_amount = 0;
      }

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
