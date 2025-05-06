import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Patreon from "next-auth/providers/patreon";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Define types for your JWT token
interface CustomToken extends JWT {
  id: string;
  accessToken: string;
}

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
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          });

          const user = await res.json();
          
          if (!res.ok) {
            return null;
          }

          return user;
        } catch (error) {
          return null;
        }
      }
    }),
    Patreon({
      clientId: process.env.PATREON_CLIENT_ID,
      clientSecret: process.env.PATREON_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identity.memberships identity[email] identity",
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name || `${profile.name}`,
          email: profile.email,
          image: null,
        };
      },
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identify email guilds",
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
          discriminator: profile.discriminator,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      try {
        // Cast token to our custom type
        const customToken = token as CustomToken;
        const { accessToken, id } = customToken;
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
