
"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/button";
import { PatreonButton } from "../login";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-2xl space-y-8 bg-black/20 backdrop-blur-md p-8 rounded-lg">
        <h1 className="text-3xl font-bold">Account Settings</h1>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Linked Accounts</h2>
          
          <div className="flex items-center justify-between p-4 bg-black/40 rounded">
            <div>
              <h3 className="font-medium">Patreon</h3>
              <p className="text-sm text-gray-400">
                {session?.is_pledged ? "Connected" : "Not connected"}
              </p>
            </div>
            
            {!session?.is_pledged && <PatreonButton />}
          </div>
        </div>
      </div>
    </main>
  );
}
