import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Patreon from "next-auth/providers/patreon";
import { IsPlegdedProps } from "./auth-types";

const store = process.env.PATREON_NAME;

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
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
  callbacks: {
    async session({ session, token }) {
      const { accessToken, id } = token;
      // @ts-ignore
      session.user.id = id;
      // @ts-ignore
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

        const isPledged = pledges.included.find(
          (e) => e.attributes.url?.includes(store),
        );

        if (isPledged && isPledged.attributes.amount) {
          const amount = isPledged.attributes.amount;
          // @ts-ignore
          session.is_pledged = amount > 299 ? true : false;
          // @ts-ignore
          session.pledge_amount = amount;
        } else {
          // @ts-ignore
          session.is_pledged = false;
          // @ts-ignore
          session.pledge_amount = 0;
        }
      } catch (err) {
        // @ts-ignore
        session.err = JSON.stringify(err);
      }

      return session;
    },
  },
});
