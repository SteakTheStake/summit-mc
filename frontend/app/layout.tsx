import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

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
    <html lang="en">
      <body className={`${minecraft.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
