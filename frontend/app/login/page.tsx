"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/button";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      window.location.href = "/account";
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Toaster />
      <div className="w-full max-w-md space-y-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-black/20 backdrop-blur-md p-8 rounded-lg"
        >
          <h1 className="text-3xl font-bold text-center">Login</h1>
          {error && <div className="text-red-500 text-center">{error}</div>}

          <div className="space-y-2">
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full p-2 rounded bg-black/40"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-2 rounded bg-black/40"
            />
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>

          <p className="text-center">
            Dont have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
