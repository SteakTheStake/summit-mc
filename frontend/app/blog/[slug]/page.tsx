import { RenderBlocks } from "@/components/render";
import { Post } from "@/payload-types";

import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = params.slug;

  const project: { docs: Post[] } = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/posts?where[or][0][and][0][slug][equals]=${slug}`,
    { method: "GET", next: { revalidate: 60 } },
  ).then((res) => res.json());
  const details = project.docs[0];

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_API),
    title: `${details.title} | SummitMC`,
    description: `${details.updatedAt.slice(0, 10)} - ${details.subtitle}`,
    openGraph: {
      title: `${details.title} | SummitMC`,
      description: `${details.updatedAt.slice(0, 10)} - ${details.subtitle}`,
      images: process.env.NEXT_PUBLIC_API + details.meta_img.url,
    },
    twitter: {
      title: `${details.title} | SummitMC`,
      description: `${details.updatedAt.slice(0, 10)} - ${details.subtitle}`,
      card: "summary_large_image",
      images: process.env.NEXT_PUBLIC_API + details.meta_img.url,
    },
  };
}

const getPost = async (slug: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API +
      `/api/posts?where[or][0][and][0][slug][equals]=${slug}`,
    {
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) {
    throw new Error("Failed to fetch post details. " + (await res.text()));
  }

  return res.json();
};

export default async function BlogSlug({
  params,
}: {
  params: { slug: string };
}) {
  const data: { docs: Post[] } = await getPost(params.slug);
  const details = data.docs[0];

  return (
    <main className="flex flex-col pt-16">
      <section className="relative">
        <Image
          src={process.env.NEXT_PUBLIC_API + details.meta_img.url}
          alt={details.meta_img.alt}
          width={details.meta_img.width!}
          height={details.meta_img.height!}
          className="aspect-video w-full object-cover object-center"
        />

        <div className="absolute bottom-0 left-0 h-max w-full bg-zinc-700/50 p-4">
          <h1 className="text-4xl">{details.title}</h1>
          <p className="text-white">{details.createdAt.slice(0, 10)}</p>
        </div>
      </section>

      <article className="prose prose-xl dark:prose-invert prose-p:text-white max-w-none">
        <RenderBlocks layout={details.layout} />
      </article>
    </main>
  );
}
