"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Download } from "@/vault-types";
import { Button } from "@/components/button";
import { Session } from "./page";

export const Downloads = ({
  downloads,
  session,
}: {
  downloads: Download[];
  session: Session;
}) => {
  const [preparing, setPreparing] = useState(false);
  return (
    <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {preparing ? "yeah" : "no"}
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
  const downloadPack = () => {
    const body = {
      access_token: session.accessToken,
      patreon_id: session.user.id,
      is_pledged: session.is_pledged,
      pledge_amount: session.pledge_amount,
    };
  };

  return (
    <Button
      className="w-full py-1 text-xl"
      onClick={() => setPreparing(!preparing)}
    >
      {name}&nbsp;<span className="text-amber-400">[{resolution}x]</span>
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
