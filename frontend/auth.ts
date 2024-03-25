import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Patreon from "next-auth/providers/patreon";

const cId = process.env.PATREON_CID;
async function getUser(accessToken: string) {
  const res = await fetch(
    "https://www.patreon.com/api/oauth2/v2/identity?include=memberships,memberships.currently_entitled_tiers,memberships.campaign&fields%5Bmember%5D=currently_entitled_amount_cents,patron_status",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data: PatreonUserProps = await res.json();
  const pledges = data.included;
  return pledges.filter(
    (p) =>
      p &&
      p.attributes &&
      p.attributes.currently_entitled_amount_cents > 10 &&
      p.attributes.patron_status === "active_patron" &&
      p.relationships.campaign.data.id === cId,
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
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
    // @ts-ignore
    async session({ session, token }) {
      try {
        const { accessToken, id } = token;
        session.user!.id = id;
        session.accessToken = accessToken;

        try {
          const pledges = await getUser(accessToken);
          if (pledges.length) {
            session.is_pledged = true;
            session.pledge_amount =
              pledges[0].attributes.currently_entitled_amount_cents;
          } else {
            throw new Error("No pledge found");
          }
        } catch (err) {
          session.err = JSON.stringify(err);
          session.is_pledged = false;
          session.pledge_amount = 0;
        }

        return session;
      } catch {
        return session;
      }
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

export interface PatreonUserProps {
  included: {
    attributes: {
      currently_entitled_amount_cents: number;
      patron_status: string | null;
    };
    relationships: {
      campaign: {
        data: {
          id: string;
        };
      };
    };
  }[];
}
