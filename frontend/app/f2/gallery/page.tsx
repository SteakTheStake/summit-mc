"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import Link from "next/link";
import Image from "next/image";

interface Screenshot {
  id: string;
  image: {
    url: string;
  };
  title: string;
  description: string;
}

export default function GalleryPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScreenshots();
  }, []);

  const fetchScreenshots = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/screenshots`);
      const data = await res.json();
      setScreenshots(data.docs);
    } catch (error) {
      console.error("Failed to fetch screenshots:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col items-center justify-start gap-8 py-16">
      <div className="flex justify-between items-center w-full max-w-6xl">
        <h1 className="text-4xl font-bold">Gallery</h1>
        <Link href="/f2/upload">
          <Button>Upload Screenshot</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {screenshots.map((screenshot) => (
          <div
            key={screenshot.id}
            className="bg-zinc-800/50 rounded-lg overflow-hidden"
          >
            <Image
              src={screenshot.image.url}
              alt={screenshot.title}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold">{screenshot.title}</h3>
              <p className="text-gray-400">{screenshot.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
