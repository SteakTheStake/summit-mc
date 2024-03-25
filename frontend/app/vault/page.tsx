import { auth, signOut } from "@/auth";

import { Metadata } from "next";
import Link from "next/link";
import { UserSubscriptionDetails } from "./vault-types";
import { Button } from "@/components/button";
import { Downloads } from "./downloads";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  return {
    title: `${session!.user!.name}'s Vault | SummitMC`,
  };
}

async function getUserDetails() {
  const session = await auth();

  if (session) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/my-downloads`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        access_token: session.accessToken,
        patreon_id: session.user!.id,
        is_pledged: session.is_pledged,
        pledge_amount: session.pledge_amount,
      }),
    });

    return res.json();
  }
}

export default async function Vault() {
  const session = await auth();

  async function redirectToRedeem(formData: FormData) {
    "use server";

    const code = formData.get("redeem-code");
    if (!code) {
      return;
    }

    redirect(`/vault/${code}`);
  }

  if (!session) {
    return null;
  }

  if (!session.is_pledged) {
    return (
      <main className="flex flex-col items-center justify-center gap-16 pt-16">
        <section className="w-full">
          <div className="flex flex-col gap-4">
            <form
              action={async () => {
                "use server";
                signOut();
              }}
              className="mt-2 md:mt-4"
            >
              <Button className="w-max py-1 text-2xl">Logout</Button>
            </form>
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
          <form className="mt-8" action={redirectToRedeem}>
            <label htmlFor="redeem-code" className="flex flex-col gap-2">
              <span className="text-2xl text-white">Redeem Code</span>
              <input
                id="redee-code"
                name="redeem-code"
                className="max-w-64 rounded border-2 border-white/60 bg-zinc-600 px-6 py-4 text-lg text-white hover:border-white active:border-gray-400"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(13, 0, 23, 0.6), rgba(13, 0, 23, 0.6)), url(/bgbtn.png)",
                  backgroundSize: "100% 200%",
                  backgroundRepeat: "no-repeat",
                  imageRendering: "pixelated",
                }}
              />
            </label>
            <Button type="submit" className="mt-2 py-2">
              Submit
            </Button>
          </form>
        </section>
      </main>
    );
  }

  const details: UserSubscriptionDetails = await getUserDetails();
  const { tier, packs, downloads } = details;
  const packList = () => {
    if (packs.length === 1) {
      return packs[0].title;
    }

    return packs.map((pack) => pack.title).join(", ");
  };

  return (
    <main className="flex flex-col items-center justify-center gap-16 pt-16">
      <section className="grid w-full grid-cols-1 items-end gap-4 xl:grid-cols-[1.3fr,0.7fr]">
        <div className="flex flex-col gap-4">
          <form
            action={async () => {
              "use server";
              signOut();
            }}
            className="mt-2 md:mt-4"
          >
            <Button className="w-max py-1 text-2xl">Logout</Button>
          </form>
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
