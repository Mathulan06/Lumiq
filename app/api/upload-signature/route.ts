import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

// Protected by middleware
export async function POST(request: NextRequest) {
  const { category, title, description, price } = await request.json();

  if (!category?.trim()) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }

  // Sanitize: strip non-ASCII (emojis, smart quotes, etc) + chars that break context format
  const safe = (v: unknown) =>
    String(v ?? "")
      .replace(/[^\x20-\x7E]/g, "")  // keep only printable ASCII
      .replace(/[|=\\]/g, " ")
      .trim();

  const timestamp = Math.round(Date.now() / 1000);
  const tag = category.toLowerCase().trim();
  const context = `title=${safe(title)}|description=${safe(description)}|price=${safe(price) || "0"}`;

  const paramsToSign = {
    context,
    folder: "lumiq",
    tags: tag,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    context,
    folder: "lumiq",
    tags: tag,
  });
}
