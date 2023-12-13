import { Metadata } from "next";
import { PatreonButton } from ".";
import Link from "next/link";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Login | SummitMC",
  description: "Login to access the vault",
};

export default async function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <PatreonButton />
      <p className="w-full text-lg sm:w-96">
        By signing with Patreon, you agree to our{" "}
        <Link href="/privacy-policy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </main>
  );
}
