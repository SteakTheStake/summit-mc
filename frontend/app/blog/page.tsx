import { LinkButton } from "@/components/button";
import { Post } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Blog | SummitMC",
  description: "Latest blog posts for SummitMC",
};

const getPosts = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/posts?limit=18", {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch posts. " + (await res.text()));
  }

  return res.json();
};

export default async function Blog() {
  const posts: { docs: Post[] } = await getPosts();
  const firstPost = posts.docs[0];

  return (
    <main className="flex flex-col items-center justify-center gap-16">
      <section className="w-full">
        <h1 className="pt-16 text-5xl">Latest Post</h1>
        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link href={"/blog/" + firstPost.slug!}>
            <Image
              src={process.env.NEXT_PUBLIC_API + firstPost.meta_img.url}
              alt={firstPost.meta_img.alt}
              width={firstPost.meta_img.width!}
              height={firstPost.meta_img.height!}
              className="aspect-video w-full object-cover object-center"
            />
          </Link>
          <div className="flex flex-col justify-between bg-zinc-700/50 p-4">
            <div>
              <Link
                href={"/blog/" + firstPost.slug!}
                className="text-xl underline md:text-3xl"
              >
                <h1>{firstPost.title}</h1>
              </Link>
              <p className="text-lg text-white md:text-xl">
                {firstPost.subtitle}
              </p>
            </div>
            <LinkButton
              href={"/blog/" + firstPost.slug!}
              className="py-2 text-2xl"
            >
              Check post
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="w-full">
        <h1 className="text-3xl">Recent Posts</h1>
        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.docs.map((post) => (
            <div key={post.id} className="mt-2 grid grid-cols-1 gap-4">
              <Link href={"/blog/" + post.slug!}>
                <Image
                  src={process.env.NEXT_PUBLIC_API + post.meta_img.url}
                  alt={post.meta_img.alt}
                  width={post.meta_img.width!}
                  height={post.meta_img.height!}
                  className="aspect-video w-full object-cover object-center"
                />
              </Link>
              <div className="flex flex-col justify-between bg-zinc-700/50 p-4">
                <div>
                  <Link
                    href={"/blog/" + post.slug!}
                    className="text-xl underline md:text-2xl"
                  >
                    <h1>{post.title}</h1>
                  </Link>
                  <p className="text-lg text-white">{post.subtitle}</p>
                </div>
                <LinkButton
                  href={"/blog/" + post.slug!}
                  className="mt-4 py-1 text-lg"
                >
                  Check post
                </LinkButton>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
