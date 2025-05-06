import { LinkButton } from "@/components/button";
import { HeroImage } from "./home";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-12 py-16">
      <div className="relative flex w-full justify-center px-4 animate-fade-in">
        <HeroImage />
      </div>

      <section className="grid w-full max-w-4xl grid-cols-2 gap-4 p-6 rounded-lg bg-black/20 backdrop-blur-md">
        <LinkButton
          href="/pricing"
          className="col-span-2 w-full py-4 text-2xl font-bold"
        >
          Play Summit
        </LinkButton>
        <LinkButton href="/vault" className="w-full py-3 text-xl">
          Vault
        </LinkButton>
        <LinkButton href="/blog" className="w-full py-3 text-xl">
          Blog
        </LinkButton>
        <LinkButton
          href="/f2"
          className="w-full py-3 text-xl max-sm:col-span-2"
        >
          Summit F2
        </LinkButton>
        <LinkButton
          href="https://modrinth.com/resourcepack/summit"
          target="_blank"
          className="w-full py-3 text-xl max-sm:col-span-2"
        >
          Free Version
        </LinkButton>
      </section>
    </main>
  );
}
