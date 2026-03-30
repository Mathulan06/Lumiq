import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cloudinary } from "@/lib/cloudinary";

// Protected by middleware
export async function POST(request: NextRequest) {
  const { publicId, category, title, description, price, isHero, isFeatured } =
    await request.json();

  if (!publicId || !category?.trim()) {
    return NextResponse.json({ error: "publicId and category are required" }, { status: 400 });
  }

  const safe = (v: string) =>
    String(v ?? "")
      .replace(/[^\x20-\x7E]/g, "")  // keep only printable ASCII
      .replace(/[|=\\]/g, " ")
      .trim();

  const context = `title=${safe(title)}|description=${safe(description)}|price=${price ?? 0}`;
  const tag = category.toLowerCase().trim();

  // Build tags: category + optional special tags
  const tags = [tag, ...(isHero ? ["_hero"] : []), ...(isFeatured ? ["_featured"] : [])];

  try {
    // If setting as hero, enforce max 3 — remove oldest if already at limit
    if (isHero) {
      const existing = await cloudinary.search
        .expression("tags=_hero AND folder=lumiq")
        .sort_by("created_at", "asc")
        .max_results(10)
        .execute();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const others = (existing.resources ?? []).filter((r: any) => r.public_id !== publicId);
      if (others.length >= 3) {
        // Remove the oldest to stay within 3
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await cloudinary.uploader.remove_tag("_hero", [others[0].public_id]);
      }
    }

    await cloudinary.api.update(publicId, {
      context,
      tags: tags.join(","),
      type: "upload",
      resource_type: "image",
    });

    revalidatePath("/", "page");
    revalidatePath("/gallery", "page");
    revalidatePath("/gallery/[category]", "page");
    revalidatePath("/shop", "page");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cloudinary update error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
