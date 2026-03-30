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

  const safe = (v: string) => (v ?? "").replace(/[|=]/g, " ").trim();

  const context = `title=${safe(title)}|description=${safe(description)}|price=${price ?? 0}`;
  const tag = category.toLowerCase().trim();

  // Build tags: category + optional special tags
  const tags = [tag, ...(isHero ? ["_hero"] : []), ...(isFeatured ? ["_featured"] : [])];

  try {
    // If setting as hero, remove _hero from any other photo first
    if (isHero) {
      const existing = await cloudinary.search
        .expression("tags=_hero AND folder=lumiq")
        .max_results(10)
        .execute();
      const others = (existing.resources ?? []).filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (r: any) => r.public_id !== publicId
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ).map((r: any) => r.public_id);
      if (others.length > 0) {
        await cloudinary.uploader.remove_tag("_hero", others);
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
