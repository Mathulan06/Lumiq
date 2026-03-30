import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

// Protected by middleware (same as /api/upload)
export async function POST(request: NextRequest) {
  const { category, title, description, price } = await request.json();

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = {
    context: `title=${title ?? ""}|description=${description ?? ""}|price=${price ?? 0}`,
    folder: "lumiq",
    tags: category?.toLowerCase().trim(),
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
    ...paramsToSign,
  });
}
