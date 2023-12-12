"use client";

import { Button } from "@/components/button";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <Button onClick={() => signOut()} className="text-2xl">
      Logout
    </Button>
  );
};
