"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Download } from "@/vault-types";
import { Button } from "@/components/button";
import { Session } from "./page";
import { AnimatePresence, motion } from "framer-motion";

export const Downloads = ({
  downloads,
  session,
}: {
  downloads: Download[];
  session: Session;
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
        />
      ))}

      <AnimatePresence>
        {preparing && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex h-full w-full items-center justify-center bg-zinc-900/90"
          >
            <h1>Preparing your download! This may take a bit...</h1>
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
}: DownloadButtonProps) => {
  const downloadPack = async () => {
    setPreparing(true);
    const body = {
      access_token: session.accessToken,
      patreon_id: session.user.id,
      is_pledged: session.is_pledged,
      pledge_amount: session.pledge_amount,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PY_API}/api/get-download/${id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name} [${resolution}x].zip`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        console.error("Failed to download file.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPreparing(false);
    }
  };

  return (
    <Button
      className="w-full py-1 text-xl transition-opacity disabled:opacity-10"
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
  session: Session;
}
