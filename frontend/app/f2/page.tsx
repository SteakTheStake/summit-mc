"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/button";

export default function F2Page() {
  const { data: session } = useSession();

  return (
    <>
      <div className="absolute inset-0 -z-10">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#2a003d,#0f172a)]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgo8ZGVmcz4KICA8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CiAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIj4KICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ic2VlZCIgZnJvbT0iMCIgdG89IjEwMCIgZHVyPSIxMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgICA8L2ZlVHVyYnVsZW5jZT4KICA8L2ZpbHRlcj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIuMTUiLz4KPC9zdmc+')]" />
          </div>
        </div>
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 py-16 px-4">
        <div className="text-center space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Summit F2
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Share your best Minecraft moments with the community
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {session ? (
            <Link href="/f2/gallery" className="shadow">
              <Button className="px-8 py-4 text-xl">
                View Gallery
              </Button>
            </Link>
          ) : (
            <Link href="/login" className="shadow">
              <Button className="px-8 py-4 text-xl">
                Get Started
              </Button>
            </Link>
          )}
          <Link href="/f2/trending" className="shadow">
            <Button className="px-8 py-4 text-xl">
              Trending Screenshots
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          <div className="bg-black/20 backdrop-blur-md p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-2">Share</h3>
            <p className="text-gray-300">Upload and share your best Minecraft screenshots with the community</p>
          </div>
          <div className="bg-black/20 backdrop-blur-md p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-2">Discover</h3>
            <p className="text-gray-300">Explore amazing builds and moments from other players</p>
          </div>
          <div className="bg-black/20 backdrop-blur-md p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-2">Connect</h3>
            <p className="text-gray-300">Like, comment, and interact with other Minecraft enthusiasts</p>
          </div>
        </div>
      </main>
    </>
  );
}