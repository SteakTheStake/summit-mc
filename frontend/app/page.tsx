import { Button, LinkButton } from "@/components/button";
import { HeroImage } from "./home";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-8">
      <div className="relative mt-4 flex w-full justify-center px-4">
        <HeroImage />
      </div>

      <section className="grid w-full grid-cols-2 gap-3 text-2xl">
        <LinkButton href="/pricing" className="col-span-2 w-full py-3">
          Play Summit
        </LinkButton>
        <LinkButton href="/summit-plus" className="col-span-2 w-full py-3">
          Summit+
        </LinkButton>
        <LinkButton href="/vault" className="w-full py-3">
          Vault
        </LinkButton>
        <LinkButton href="/blog" className="w-full py-3">
          Blog
        </LinkButton>
      </section>
    </main>
  );
}
