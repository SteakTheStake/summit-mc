"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";

function playSound() {
  const muted = localStorage.getItem("muted");
  if (muted !== "mute") {
    const sound = new Audio("/click.mp3");
    sound.play();
    setTimeout(() => sound.remove(), 500);
  }
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
interface LinkButtonProps extends React.LinkHTMLAttributes<HTMLAnchorElement> {
  href: string;
  target?: "_blank";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  onClick,
  ...props
}) => {
  return (
    <button
      {...props}
      className={twMerge(
        "default-ts flex items-center justify-center rounded border-2 border-white/60 bg-zinc-600 px-6 py-4 text-center text-white hover:border-white active:border-gray-400",
        className,
      )}
      style={{
        background: "url(/bgbtn.png)",
        backgroundSize: "200% 200%",
        backgroundRepeat: "repeat",
        imageRendering: "pixelated",
      }}
      onClick={(e) => {
        playSound();
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </button>
  );
};

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  target,
  children,
  className,
  onClick,
  ...props
}) => {
  return (
    <Link
      {...props}
      href={href}
      target={target}
      className={twMerge(
        "default-ts flex items-center justify-center rounded border-2 border-white/60 bg-zinc-600 px-6 py-4 text-center text-white hover:border-white active:border-gray-400",
        className,
      )}
      style={{
        background: "url(/bgbtn.png)",
        backgroundSize: "200% 200%",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
      }}
      onClick={(e) => {
        playSound();
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </Link>
  );
};
