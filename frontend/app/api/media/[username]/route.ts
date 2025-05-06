import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function POST(request: Request, { params }: { params: { username: string } }) {
  const session = await auth();
  const headersList = headers();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract the username from the params
  const username = params.username;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const hashtags = formData.get("hashtags") as string;

    const apiUrl = process.env.NEXT_PUBLIC_API || "https://payload.summitmc.xyz";

    // Upload media to the media collection
    const mediaForm = new FormData();
    mediaForm.append("file", file);

    const mediaRes = await fetch(`${apiUrl}/api/media`, {
      method: "POST",
      headers: {
        Cookie: headersList.get("cookie") || "",
      },
      credentials: "include",
      body: mediaForm,
    });

    if (!mediaRes.ok) {
      const err = await mediaRes.text();
      throw new Error("Media upload failed: " + err);
    }

    const media = await mediaRes.json();

    // Now create the screenshot with the uploaded media ID
    const screenshotRes = await fetch(`${apiUrl}/api/media/${username}/img`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: headersList.get("cookie") || "",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        description,
        hashtags: hashtags.split(",").map(tag => ({ tag: tag.trim() })),
        image: media.id,
        author: session.user.id,
      }),
    });

    if (!screenshotRes.ok) {
      const err = await screenshotRes.text();
      throw new Error("Screenshot create failed: " + err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error uploading screenshot:", error);
    return NextResponse.json(
      { error: "Failed to upload screenshot" },
      { status: 500 }
    );
  }
}
