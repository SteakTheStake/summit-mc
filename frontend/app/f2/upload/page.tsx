
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { UploadForm } from "@/components/screenshot/upload-form";

export default function UploadPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.replace("/login");
    return null;
  }

  return (
    <main className="flex flex-col items-center justify-start gap-8 py-16">
      <h1 className="text-4xl font-bold">Upload Screenshot</h1>
      <p className="text-center max-w-2xl text-gray-300">
        Share your best Minecraft moments with the community. Supported formats: PNG, JPG, JPEG
      </p>
      <UploadForm />
    </main>
  );
}
