import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import ImageManager from "@/components/admin/ImageManager";

export default async function AdminDashboardPage() {
  // Double-check auth server-side (middleware already handles this,
  // but an extra check here avoids any edge cases)
  const token = (await cookies()).get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) redirect("/admin");

  return (
    <div className="min-h-screen bg-neutral-50 pt-8 pb-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="font-display text-4xl font-light tracking-[0.1em]">Dashboard</p>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-neutral-400 mt-1">
              Lumiq Admin
            </p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="font-body text-xs tracking-[0.2em] uppercase text-neutral-400 border border-neutral-200 rounded-full px-5 py-2 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300"
            >
              Sign Out
            </button>
          </form>
        </div>

        <ImageManager />
      </div>
    </div>
  );
}
