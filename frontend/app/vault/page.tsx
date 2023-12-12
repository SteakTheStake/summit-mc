import { auth } from "@/auth";
import { signOut } from "next-auth/react";
import { LogoutButton } from ".";

export default async function Vault() {
  const session = await auth();
  // console.log(session);

  return (
    <main>
      <LogoutButton />
    </main>
  );
}
