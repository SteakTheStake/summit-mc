"use client";

import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={twMerge(
        "px-6 py-4 flex items-center bg-zinc-600 justify-center text-center text-white default-ts hover:border-white border-2 border-white/60 active:border-gray-400",
        className,
      )}
      style={{
        background: "url(/bgbtn.png)",
        backgroundSize: "100% 200%",
      }}
    >
      {children}
    </button>
  );
};
