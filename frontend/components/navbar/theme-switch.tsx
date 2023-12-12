"use client";

import { useTheme } from "next-themes";
import { Button } from "../button";
import Image from "next/image";

import sun from "@/public/sun.png";
import moon from "@/public/moon.png";

export const ThemeSwitch = () => {
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
      className="p-1"
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
