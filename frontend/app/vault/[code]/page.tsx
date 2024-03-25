import { auth } from "@/auth";
import { UserCodeDetails } from "../vault-types";
import { Downloads } from "../downloads";
import { revalidateTag } from "next/cache";

async function checkCode(
  accessToken: string,
  code: string,
): Promise<UserCodeDetails> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/check-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: accessToken,
      code,
    }),
    next: {
      tags: ["redeem"],
    },
  });

  return res.json();
}

export default async function Redeem({
  params: { code },
}: {
  params: { code: string };
}) {
  const session = await auth();
  if (!session) return null;
  if (!session.user) return null;

  const details = await checkCode(session.accessToken, code);
  const { tier, packs, downloads } = details;

  if (details.message) {
    return (
      <main className="flex items-center justify-center">
        <h1 className="bg-zinc-700/50 p-4 text-4xl">{details.message}</h1>
      </main>
    );
  }

  const packList = () => {
    if (packs.length === 1) {
      return packs[0].title;
    }

    return packs.map((pack) => pack.title).join(", ");
  };

  function formatDate(date: string) {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formattedDate;
  }

  async function revalidateCode() {
    "use server";
    revalidateTag("redeem");
  }

  return (
    <main className="flex flex-col items-center justify-center gap-16 pt-16">
      <section className="grid w-full grid-cols-1 items-end gap-4 xl:grid-cols-[1.3fr,0.7fr]">
        <div></div>
        <div className="bg-zinc-700/50 p-4 sm:w-max xl:w-full">
          <h2 className="text-xl">Redeem Code Details:</h2>
          <ul className="flex list-disc flex-col pl-4 text-lg text-white">
            <li>
              <span className="text-yellow-400">Tier:</span> {tier.name}, $
              {tier.price}/m
            </li>
            <li>
              <span className="text-yellow-400">Your packs:</span> {packList()}
            </li>
            <li>
              <span className="text-yellow-400">Uses Remaining:</span>{" "}
              {details.code.uses_remaining}
            </li>
            <li>
              <span className="text-yellow-400">Expiring:</span>{" "}
              {formatDate(details.code.expiry)}
            </li>
          </ul>
        </div>
      </section>

      <section className="w-full">
        <h1 className="text-4xl">Downloads</h1>
        <Downloads
          downloads={downloads}
          session={session}
          code={code}
          reval={revalidateCode}
        />
      </section>
    </main>
  );
}
