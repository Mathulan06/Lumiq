import { NextRequest, NextResponse } from "next/server";
import { getPhotos } from "@/lib/cloudinary";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") ?? undefined;
  try {
    const photos = await getPhotos(category);
    return NextResponse.json(photos);
  } catch (err) {
    console.error("GET /api/images error:", err);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
