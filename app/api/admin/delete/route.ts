import { NextRequest, NextResponse } from "next/server";
import { deletePhoto } from "@/lib/cloudinary";

// Middleware already guards /api/admin/delete
export async function POST(request: NextRequest) {
  const { publicId } = await request.json();

  if (!publicId) {
    return NextResponse.json({ error: "publicId is required" }, { status: 400 });
  }

  try {
    await deletePhoto(publicId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE photo error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
