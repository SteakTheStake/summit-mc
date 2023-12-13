"use client";

import { MenuIcon, Plus } from "lucide-react";
import { Button } from "../button";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { NavLink } from "./client";
import { LinkButton } from "@/components/button";
import { ThemeSwitch } from "@/components/navbar/theme-switch";

export const Menu = () => {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (open) {
        document.body.style.overflowY = "hidden";
      } else {
        document.body.style.overflowY = "scroll";
      }
    }
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { label: "Home", href: "/" },
    { label: "Pricing", href: "/pricing" },
    { label: "Summit+", href: "/summit-plus" },
    { label: "Blog", href: "/blog" },
  ];

  if (mounted) {
    return (
      <>
        <Button className="p-1 md:hidden" onClick={() => setOpen(true)}>
          <MenuIcon className="icon-shadow" />
        </Button>

        {createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  initial={{ opacity: 0, translateY: 40 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: 40 }}
                  className="fixed inset-0 z-[2000] m-4 flex h-[calc(100%-2rem)] w-[calc(100%-2rem)] flex-col items-center justify-center gap-6 border-2 bg-[url(/bgbtn.png)] bg-contain"
                >
                  <Button
                    className="absolute right-0 top-0 m-4 h-max w-max p-1 shadow"
                    onClick={() => setOpen(false)}
                  >
                    <Plus className="icon-shadow rotate-45" />
                  </Button>

                  <ul className="flex flex-col items-center justify-center gap-4 text-2xl">
                    {links.map((link, i) => (
                      <li key={i}>
                        <NavLink href={link.href}>{link.label}</NavLink>
                      </li>
                    ))}
                  </ul>

                  <ul className="flex items-center justify-end gap-2">
                    <li>
                      <LinkButton
                        href="https://www.patreon.com/SummitMC"
                        target="_blank"
                        className="p-2 shadow"
                        aria-label="Link to open Patreon page in a new tab"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="16"
                          width="16"
                          viewBox="0 0 512 512"
                          className="icon-shadow fill-white"
                        >
                          <path d="M489.7 153.8c-.1-65.4-51-119-110.7-138.3C304.8-8.5 207-5 136.1 28.4C50.3 68.9 23.3 157.7 22.3 246.2C21.5 319 28.7 510.6 136.9 512c80.3 1 92.3-102.5 129.5-152.3c26.4-35.5 60.5-45.5 102.4-55.9c72-17.8 121.1-74.7 121-150z" />
                        </svg>
                      </LinkButton>
                    </li>
                    <li>
                      <LinkButton
                        href="https://discord.gg/M9cmBBGKU8"
                        target="_blank"
                        className="p-2 shadow"
                        aria-label="Link to open Discord server in a new tab"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="16"
                          width="16"
                          viewBox="0 0 640 512"
                          className="icon-shadow fill-white"
                        >
                          <path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" />
                        </svg>
                      </LinkButton>
                    </li>
                    <li>
                      <ThemeSwitch className="shadow" />
                    </li>
                    <li>
                      <LinkButton
                        href="/login"
                        className="px-2 py-1 text-base shadow"
                      >
                        Login
                      </LinkButton>
                    </li>
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 z-[1500] h-full w-full bg-zinc-800/20"
                ></motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
      </>
    );
  }
};
