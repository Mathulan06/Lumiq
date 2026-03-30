import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "lumiq-fallback-secret-change-in-production"
);

const PROTECTED = ["/admin/dashboard", "/api/upload", "/api/admin/delete", "/api/admin/update", "/api/upload-signature"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    if (pathname.startsWith("/api/"))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/"))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const res = NextResponse.redirect(new URL("/admin", request.url));
    res.cookies.delete("admin_token");
    return res;
  }
}

export const config = {
  matcher: ["/admin/dashboard", "/api/upload", "/api/upload-signature", "/api/admin/:path*"],
};
