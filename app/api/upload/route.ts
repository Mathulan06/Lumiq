import { NextRequest, NextResponse } from "next/server";
import { uploadPhoto } from "@/lib/cloudinary";

// Middleware already guards this route — no extra auth needed here
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string | null)?.trim();
    const title = (formData.get("title") as string | null)?.trim() ?? "";
    const description = (formData.get("description") as string | null)?.trim() ?? "";
    const price = parseFloat((formData.get("price") as string | null) ?? "0");

    if (!file || !category) {
      return NextResponse.json({ error: "file and category are required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadPhoto(buffer, { category, title, description, price });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
