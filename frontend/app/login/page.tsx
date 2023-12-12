"use client";

import { signIn } from "next-auth/react";

export default async function LoginPage() {
  const signInHandler = async () => {
    // "use server";
    await signIn("patreon");
  };

  return (
    <form action={signInHandler}>
      <button type="submit">Login</button>
    </form>
  );
}
