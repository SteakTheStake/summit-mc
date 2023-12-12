import { Metadata } from "next";
import { PatreonButton } from ".";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login | SummitMC",
  description: "Login to access the vault",
};

export default function LoginPage() {
  return (
    <main className="flex flex-col gap-4 items-center justify-center">
      <PatreonButton />
      <p className="sm:w-96 w-full text-lg">
        By signing with Patreon, you agree to our{" "}
        <Link href="/privacy-policy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </main>
  );
}
