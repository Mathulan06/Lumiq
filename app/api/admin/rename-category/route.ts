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
    // Find all photos with the old category tag
    const result = await cloudinary.search
      .expression(`tags=${oldTag} AND folder=lumiq`)
      .max_results(500)
      .execute();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const publicIds = (result.resources ?? []).map((r: any) => r.public_id);

    if (publicIds.length === 0) {
      return NextResponse.json({ error: "No photos found with that category" }, { status: 404 });
    }

    // Swap the tag on all photos at once
    await cloudinary.uploader.add_tag(newTag, publicIds);
    await cloudinary.uploader.remove_tag(oldTag, publicIds);

    revalidatePath("/", "page");
    revalidatePath("/gallery", "page");
    revalidatePath("/gallery/[category]", "page");
    revalidatePath("/shop", "page");

    return NextResponse.json({ success: true, updated: publicIds.length });
  } catch (err) {
    console.error("Rename category error:", err);
    return NextResponse.json({ error: "Rename failed" }, { status: 500 });
  }
}
