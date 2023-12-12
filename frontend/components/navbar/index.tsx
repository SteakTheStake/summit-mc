import Image from "next/image";
import Link from "next/link";
import { NavLink } from "./client";

import summit from "@/public/logo.png";
import { Button } from "../button";

export const Navbar = () => {
  return (
    <nav className="h-16 flex items-center justify-center">
      <header className="grid gird-cols-2 md:grid-cols-3 h-16 items-center justify-between gap-8 w-full max-w-7xl">
        <ul className="flex gap-4 items-center text-2xl">
          <li>
            <NavLink href="/">Home</NavLink>
          </li>
          <li>
            <NavLink href="/pricing">Pricing</NavLink>
          </li>
          <li>
            <NavLink href="/summit-plus">Summit+</NavLink>
          </li>
        </ul>

        <Link
          href="/"
          className="hover:bg-zinc-950/50 aspect-square p-2 rounded-md transition-colors h-max w-max justify-self-center"
        >
          <Image
            src={summit}
            alt="SummitMC brand logo"
            height={38}
            width={38}
          />
        </Link>

        <ul className="flex items-center justify-end gap-4 text-2xl">
          <li>
            <Button className="p-2">Hi</Button>
          </li>
        </ul>
      </header>
    </nav>
  );
};
