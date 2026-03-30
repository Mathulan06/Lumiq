import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

// Protected by middleware
export async function POST(request: NextRequest) {
  const { publicId, category, title, description, price } = await request.json();

  if (!publicId || !category?.trim()) {
    return NextResponse.json({ error: "publicId and category are required" }, { status: 400 });
  }

  // Sanitize values — strip | and = to prevent breaking the context format
  const safe = (v: string) => (v ?? "").replace(/[|=]/g, " ").trim();

  const context = `title=${safe(title)}|description=${safe(description)}|price=${price ?? 0}`;
  const tag = category.toLowerCase().trim();

  try {
    await cloudinary.api.update(publicId, {
      context,
      tags: tag,
      type: "upload",
      resource_type: "image",
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cloudinary update error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
