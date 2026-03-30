import { getPhotos } from "@/lib/cloudinary";
import { capitalize } from "@/lib/utils";
import CategoryGallery from "./CategoryGallery";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const photos = await getPhotos(decoded).catch(() => []);

  return (
    <div className="pt-28 pb-32 md:pb-16 min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12">
          <p className="font-body text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-3">
            Gallery
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-light">
            <em>{capitalize(decoded)}</em>
          </h1>
          <p className="font-body text-sm text-neutral-400 mt-3">
            {photos.length} photograph{photos.length !== 1 ? "s" : ""}
          </p>
        </div>

        <CategoryGallery photos={photos} />
      </div>
    </div>
  );
}
