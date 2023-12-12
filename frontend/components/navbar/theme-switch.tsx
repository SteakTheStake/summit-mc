"use client";

import { useTheme } from "next-themes";
import { Button } from "../button";
import Image from "next/image";

import sun from "@/public/sun.png";
import moon from "@/public/moon.png";
import { twMerge } from "tailwind-merge";

export const ThemeSwitch = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();

  const switchThemes = () => {
    console.log(theme);
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button
      onClick={() => switchThemes()}
      className={twMerge("p-1", className)}
      aria-label="Theme Switch Button"
    >
      <Image
        src={theme === "dark" ? moon : sun}
        alt="Image of sun/moon depending on theme"
        height={24}
        width={24}
        className="icon-shadow"
      />
    </Button>
  );
};
