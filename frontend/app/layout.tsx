import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "./providers";

import { Navbar } from "@/components/navbar";
import { Stars } from "@/components/stars";

const minecraft = localFont({
  src: [
    {
      path: "../font/400.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../font/400-italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../font/700.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../font/700-italic.otf",
      weight: "700",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "SummitMC",
  description: "Minecraft at its peak",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${minecraft.className} antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <div className="bg-overlay" aria-hidden="true">
            <Stars />
          </div>
        </Providers>
      </body>
    </html>
  );
}
