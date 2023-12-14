import { LinkButton } from "@/components/button";
import { Tier } from "@/payload-types";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pricing | SummitMC",
  description: "Pricing details for SummitMC",
};

const getData = async () => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API + "/api/tiers?sort=price",
    {
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) {
    throw new Error("Failed to fetch pricing data.");
  }

  return res.json();
};

export default async function Pricing() {
  const pricing: { docs: Tier[] } = await getData();

  return (
    <main className="flex flex-col items-center justify-center pt-16">
      <section className="w-full">
        <h1 className="text-5xl">Pricing</h1>
        <p className="text-2xl text-white">
          You can find the pricing for our various tiers here. To find out more
          visit our{" "}
          <a
            href="https://patreon.com/SummitMC"
            target="_blank"
            className="text-yellow-400 underline"
          >
            Patreon
          </a>{" "}
          page.
        </p>
      </section>

      <section className="mt-16 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pricing.docs.map((tier) => (
          <div
            key={tier.id}
            className="flex flex-col justify-between bg-zinc-700/50 p-4"
          >
            <div>
              <h1 className="text-2xl">{tier.name}</h1>
              <p className="text-3xl text-white">${tier.price}/m</p>

              <h2 className="mt-3 text-xl">What&apos; Included:</h2>
              <ul className="flex list-disc flex-col pl-5 text-lg text-white">
                {tier.included!.map((item, i) => (
                  <li key={i}>{item.item}</li>
                ))}
              </ul>
            </div>

            <LinkButton
              href={tier.join_link}
              target="_blank"
              className="mt-4 py-1 text-xl"
            >
              Join Now
            </LinkButton>
          </div>
        ))}
      </section>
    </main>
  );
}
