import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Protected by middleware
export async function POST() {
  revalidatePath("/", "page");
  revalidatePath("/gallery", "page");
  revalidatePath("/gallery/[category]", "page");
  revalidatePath("/shop", "page");
  return NextResponse.json({ revalidated: true });
}
