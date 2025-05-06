"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import Image from "next/image";

interface Screenshot {
  id: string;
  image: {
    url: string;
  };
  title: string;
  likes: number;
  comments?: { length: number };
}

export default function TrendingPage() {
  const [trendingScreenshots, setTrendingScreenshots] = useState<Screenshot[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingScreenshots();
  }, []);

  const fetchTrendingScreenshots = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/screenshots?sort=-likes`,
      );
      const data = await res.json();
      setTrendingScreenshots(data.docs);
    } catch (error) {
      console.error("Failed to fetch trending screenshots:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col items-center justify-start gap-8 py-16">
      <h1 className="text-4xl font-bold">Trending Screenshots</h1>
      <p className="text-center max-w-2xl text-gray-300">
        Most liked and commented screenshots from the community
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {trendingScreenshots.map((screenshot) => (
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
              <div className="flex items-center gap-4 mt-2 text-gray-400">
                <span>❤️ {screenshot.likes || 0}</span>
                <span>💬 {screenshot.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
