import { Button, LinkButton } from "@/components/button";
import { HeroImage } from "./home";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 items-center justify-center">
      <div className="w-full relative flex justify-center mt-4 px-4">
        <HeroImage />
      </div>

      <section className="grid grid-cols-2 gap-3 w-full text-2xl">
        <LinkButton href="/pricing" className="col-span-2 w-full py-3">
          Play Summit
        </LinkButton>
        <LinkButton href="/summit-plus" className="col-span-2 w-full py-3">
          Summit+
        </LinkButton>
        <LinkButton href="/vault" className="w-full py-3">
          Vault
        </LinkButton>
        <Button className="w-full py-3">Quit</Button>
      </section>
    </main>
  );
}
