"use client";

import { useTheme } from "next-themes";

import summitDark from "@/public/dark-summit-logo.png";
import summitlight from "@/public/light-summit-logo.png";
import Image from "next/image";

export const HeroImage = () => {
  const { theme } = useTheme();

  return (
    <Image
      src={theme === "dark" ? summitDark : summitlight}
      alt="Hero logo image of SummitMC"
      width={448}
      height={196}
      className="max-w-md w-full"
    />
  );
};
