import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cloudinary } from "@/lib/cloudinary";

// Protected by middleware
export async function POST(request: NextRequest) {
  const { oldCategory, newCategory } = await request.json();

  if (!oldCategory?.trim() || !newCategory?.trim()) {
    return NextResponse.json({ error: "oldCategory and newCategory are required" }, { status: 400 });
  }

  const oldTag = oldCategory.toLowerCase().trim();
  const newTag = newCategory.toLowerCase().trim();

  if (oldTag === newTag) {
    return NextResponse.json({ error: "New name is the same as current" }, { status: 400 });
  }

  try {
    // Get all photos with the old tag (include their full tag list)
    const result = await cloudinary.search
      .expression(`tags=${oldTag} AND folder=lumiq`)
      .with_field("tags")
      .max_results(500)
      .execute();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resources: any[] = result.resources ?? [];

    if (resources.length === 0) {
      return NextResponse.json({ error: "No photos found with that category" }, { status: 404 });
    }

    // Update each photo: swap old tag for new, keep all other tags (_hero, _featured, etc.)
    await Promise.all(
      resources.map((r) => {
        const newTags = (r.tags as string[])
          .filter((t) => t !== oldTag)
          .concat(newTag)
          .join(",");

        return cloudinary.api.update(r.public_id, {
          tags: newTags,
          type: "upload",
          resource_type: "image",
        });
      })
    );

    revalidatePath("/", "page");
    revalidatePath("/gallery", "page");
    revalidatePath("/gallery/[category]", "page");
    revalidatePath("/shop", "page");

    return NextResponse.json({ success: true, updated: resources.length });
  } catch (err) {
    console.error("Rename category error:", err);
    return NextResponse.json({ error: "Rename failed" }, { status: 500 });
  }
}
