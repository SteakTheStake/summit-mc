"use client";

import { useEffect, useState } from "react";
import { Button } from "../button";
import { LucideVolume2, LucideVolumeX } from "lucide-react";

export const MuteButton = () => {
  const [mounted, setMounted] = useState(false);

  const [muted, setMuted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (typeof document !== "undefined") {
      const mutedFromLocalStorage = localStorage.getItem("muted");
      if (mutedFromLocalStorage === "mute") {
        setMuted(true);
      } else {
        setMuted(false);
      }
    }
  }, []);

  const updateMuteOptions = () => {
    if (muted) {
      setMuted(false);
      localStorage.setItem("muted", "no-mute");
    } else {
      setMuted(true);
      localStorage.setItem("muted", "mute");
    }
  };

  if (mounted) {
    return (
      <Button
        className="p-1"
        onClick={updateMuteOptions}
        aria-label="Mute button click sounds button"
      >
        {muted ? <LucideVolumeX /> : <LucideVolume2 />}
      </Button>
    );
  }
};
