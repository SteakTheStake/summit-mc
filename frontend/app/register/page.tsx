"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/button";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const data = {
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    };

    try {
      const csrfRes = await fetch('/api/auth/csrf');
      const { csrfToken } = await csrfRes.json();

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Registration failed');

      const signInRes = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInRes?.error) {
        setError('Auto-login failed');
      } else {
        toast.success('Registered and logged in! Redirecting...');
        router.push('/account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Toaster />
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4 bg-black/20 backdrop-blur-md p-8 rounded-lg">
          <h1 className="text-3xl font-bold text-center">Create Account</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="block">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full p-2 rounded bg-black/40"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full p-2 rounded bg-black/40"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-2 rounded bg-black/40"
            />
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>

          <p className="text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}