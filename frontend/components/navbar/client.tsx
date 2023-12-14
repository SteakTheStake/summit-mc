"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Session } from "next-auth";
import Image from "next/image";
import { Button, LinkButton } from "../button";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

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
        "aspect-square rounded-md p-2 px-4 transition-colors hover:bg-zinc-950/50",
        className,
        isActive && "bg-zinc-950/40",
      )}
    >
      {children}
    </Link>
  );
};

export const UserProfileDropdown = ({ session }: { session: Session }) => {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      setOpen(false);
    }
  }, [pathname]);

  if (session && session.user) {
    return (
      <DropdownMenu.Root open={isOpen} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <div>
            <Button
              aria-label="User dropdown to access profile or logout"
              className={
                session.user.image
                  ? "overflow-hidden p-0"
                  : "px-2 py-1 text-base"
              }
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile picture of user"
                  width={32}
                  height={32}
                />
              ) : (
                <span>Vault</span>
              )}
            </Button>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade mt-2 min-w-[220px] rounded border-2 bg-zinc-600 p-2 will-change-[opacity,transform] "
            style={{
              background: "url(/bgbtn.png)",
              backgroundSize: "100% 200%",
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated",
            }}
          >
            <DropdownMenu.Item>
              <LinkButton href="/vault" className="py-1 text-xl shadow">
                Vault
              </LinkButton>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Button
                className="mt-2 w-full py-1 text-xl text-amber-400 shadow"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }
};
