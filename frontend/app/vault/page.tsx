import { auth } from "@/auth";
import { LogoutButton } from ".";

import { Metadata } from "next";
import Link from "next/link";
import { UserSubscriptionDetails } from "@/vault-types";
import { Button } from "@/components/button";
import { Downloads } from "./downloads";
export const metadata = async (): Promise<Metadata> => {
  const session = await auth();
  return {
    title: `${session!.user!.name}'s Vault | SummitMC`,
  };
};

const getMyDownloads = async (session: Session) => {
  const body = {
    access_token: session.accessToken,
    patreon_id: session.user.id,
    is_pledged: session.is_pledged,
    pledge_amount: session.pledge_amount,
  };

  const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/my-downloads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error(
      "Failed to fetch your subscription details. " + (await res.text()),
    );
  }

  return res.json();
};

export default async function Vault() {
  // @ts-ignore
  const session: Session = await auth();

  if (!session.is_pledged) {
    return (
      <main className="flex flex-col items-center justify-center gap-16 pt-16">
        <section className="w-full">
          <div className="flex flex-col gap-4">
            <LogoutButton />
            <h1 className="text-[clamp(3rem,4vw,8rem)] leading-[clamp(3rem,4vw,8rem)]">
              Hello, {session?.user!.name}
            </h1>
          </div>
          <div className="mt-4 bg-zinc-700/50 p-4">
            <h2 className="text-xl">User Subscription Details:</h2>
            <p className="text-lg text-white">
              You are not subscribed to SummitMC. Please check out our{" "}
              <Link href="/pricing" className="text-yellow-400 underline">
                Pricing
              </Link>{" "}
              and pick a plan to access latest downloads!
            </p>
          </div>
        </section>
      </main>
    );
  }

  const details: UserSubscriptionDetails = await getMyDownloads(session);
  const { tier, packs, downloads } = details;

  const packList = () => {
    if (packs.length === 1) {
      return packs[0].title;
    }

    return packs.map((pack) => pack.title).join(", ");
  };

  // const

  return (
    <main className="flex flex-col items-center justify-center gap-16 pt-16">
      <section className="grid w-full grid-cols-1 items-end gap-4 xl:grid-cols-[1.3fr,0.7fr]">
        <div className="flex flex-col gap-4">
          <LogoutButton />
          <h1 className="text-[clamp(3rem,4vw,8rem)] leading-[clamp(3rem,4vw,8rem)]">
            Hello, {session?.user!.name}
          </h1>
        </div>
        <div className="bg-zinc-700/50 p-4 sm:w-max xl:w-full">
          <h2 className="text-xl">User Subscription Details:</h2>
          <ul className="flex list-disc flex-col pl-4 text-lg text-white">
            <li>
              <span className="text-yellow-400">Tier:</span> {tier.name}, $
              {tier.price}/m
            </li>
            <li>
              <span className="text-yellow-400">Your packs:</span> {packList()}
            </li>
          </ul>
        </div>
      </section>

      <section className="w-full">
        <h1 className="text-4xl">Downloads</h1>
        <Downloads downloads={downloads} session={session} />
      </section>
    </main>
  );
}

export interface Session {
  user: User;
  expires: string;
  accessToken: string;
  is_pledged: boolean;
  pledge_amount: number;
}

export interface User {
  name: string;
  email: string;
  image: string;
  id: string;
}
