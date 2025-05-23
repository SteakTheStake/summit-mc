"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Download } from "./vault-types";
import { Button } from "@/components/button";
import { Session as AuthSession } from "next-auth";
import { AnimatePresence, motion } from "framer-motion";

export const Downloads = ({
  downloads,
  session,
  code,
  reval,
}: {
  downloads: Download[];
  session: AuthSession;
  code?: string;
  reval?: () => void;
}) => {
  const [preparing, setPreparing] = useState(false);

  return (
    <ul className="relative mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {downloads.map((download) => (
        <DownloadButton
          key={download.id}
          id={download.id}
          name={download.name}
          resolution={download.resolution}
          preparing={preparing}
          setPreparing={setPreparing}
          session={session}
          code={code}
          reval={reval}
          pack={download.pack}
        />
      ))}

      <AnimatePresence>
        {preparing && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="bg-latte-900/70 absolute inset-0 flex h-full w-full items-center justify-center border border-black p-4"
          >
            <h1 className="text-center text-lg text-white">
              Preparing your download! This may take a bit...
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </ul>
  );
};

const DownloadButton = ({
  preparing,
  setPreparing,
  id,
  name,
  resolution,
  session,
  code,
  pack,
  reval,
}: DownloadButtonProps) => {
  const downloadPack = async () => {
    setPreparing(true);
    const body = {
      code,
      access_token: session.accessToken,
      // @ts-ignore
      patreon_id: session.user!.id,
      is_pledged: session.is_pledged,
      pledge_amount: session.pledge_amount,
      download_id: id,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/get-download/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      if (res.ok) {
        const data: { token: string } = await res.json();
        if (typeof window !== "undefined") {
          window.location.href = `${process.env.NEXT_PUBLIC_API}/api/download?token=${data.token}`;
        }
      } else {
        console.error("Failed to download file.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPreparing(false);
      if (reval) {
        reval();
      }
    }
  };

  return (
    <Button
      className="w-full py-1 text-xl transition-[background,box-shadow,opacity] disabled:opacity-10"
      disabled={preparing}
      onClick={downloadPack}
    >
      {name}&nbsp;
      <span className="text-amber-400">[{resolution}x]</span>
    </Button>
  );
};

interface DownloadButtonProps {
  preparing: boolean;
  setPreparing: Dispatch<SetStateAction<boolean>>;
  id: string;
  name: string;
  resolution: number;
  session: AuthSession;
  code?: string;
  pack: string;
  reval?: () => void;
}
