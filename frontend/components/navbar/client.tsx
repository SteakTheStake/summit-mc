"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

export const NavLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={twMerge(
        "hover:bg-zinc-950/50 aspect-square p-2 px-4 rounded-md transition-colors",
        className,
        isActive && "bg-zinc-950/40",
      )}
    >
      {children}
    </Link>
  );
};
