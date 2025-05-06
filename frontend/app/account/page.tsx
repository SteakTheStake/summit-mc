"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/button";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [newUsername, setNewUsername] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.replace(`/login?callbackUrl=${encodeURIComponent("/account")}`);
    return null;
  }

  const user = session.user;

  async function handleUsernameChange() {
    if (!user) {
      toast.error("User not found");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/users/update`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
            name: newUsername,
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to update username");

      await update({ name: newUsername });
      toast.success("Username updated successfully!");
      setShowUsernameModal(false);
    } catch (error) {
      toast.error("Failed to update username");
    }
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-8">
      <Toaster />
      <h1 className="text-4xl font-bold mb-4">Account Settings</h1>
      <p className="mb-6 text-center max-w-2xl">
        Manage your profile and connected accounts. To access exclusive content
        in the Vault, you need to connect your Patreon account and be an active
        subscriber.
      </p>

      <section className="w-full max-w-md space-y-6 bg-zinc-800/50 p-6 rounded-lg">
        {/* Profile Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Profile</h2>

          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            {user?.image ? (
              <Image
                src={user.image}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center">
                <span className="text-xl">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <Button
              onClick={() => toast.error("Profile picture upload coming soon!")}
              className="bg-zinc-700 hover:bg-zinc-600"
            >
              Change Picture
            </Button>
          </div>

          {/* Username */}
          <div className="flex items-center justify-between">
            <span>
              Username: <strong>{user?.name}</strong>
            </span>
            <Button
              onClick={() => setShowUsernameModal(true)}
              className="bg-zinc-700 hover:bg-zinc-600"
            >
              Edit
            </Button>
          </div>
        </div>

        {/* Patreon Integration */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Subscriptions</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium">Patreon Status</span>
              <span
                className={
                  session.is_pledged ? "text-green-400" : "text-gray-400"
                }
              >
                {session.is_pledged ? "Active Subscriber" : "Not Subscribed"}
              </span>
            </div>
            <Button
              onClick={() => {
                if (!session.is_pledged) {
                  signIn("patreon");
                } else {
                  router.push("/vault");
                }
              }}
              className="bg-[#FF424D] hover:bg-[#FF424D]/80"
            >
              {session.is_pledged ? "View Vault" : "Connect Patreon"}
            </Button>
          </div>
        </div>
      </section>

      {/* Username Change Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-zinc-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Change Username</h3>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-2 rounded bg-zinc-700 mb-4"
              placeholder="New username"
            />
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowUsernameModal(false)}
                className="bg-zinc-700 hover:bg-zinc-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUsernameChange}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
