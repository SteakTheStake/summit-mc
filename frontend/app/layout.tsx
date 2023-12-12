import "./globals.css";

import Providers from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Stars } from "@/components/stars";

import localFont from "next/font/local";
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

import type { Metadata } from "next";
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
          <Footer></Footer>

          <div className="bg-overlay" aria-hidden="true">
            <Stars />
          </div>
        </Providers>
      </body>
    </html>
  );
}
