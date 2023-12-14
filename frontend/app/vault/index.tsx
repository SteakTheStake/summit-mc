"use client";

import { Button } from "@/components/button";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <Button onClick={() => signOut()} className="w-max py-1 text-2xl">
      Logout
    </Button>
  );
};
