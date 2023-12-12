import { auth } from "@/auth";
import { signOut } from "next-auth/react";

export default async function Vault() {
  const session = await auth();
  // console.log(session);

  return <main></main>;
}
