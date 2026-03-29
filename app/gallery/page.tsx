import Link from "next/link";
import Image from "next/image";
import { getPhotos, getCategories } from "@/lib/cloudinary";
import { capitalize } from "@/lib/utils";

export const revalidate = 60;

export default async function GalleryPage() {
  const [photos, categories] = await Promise.all([
    getPhotos().catch(() => []),
    getCategories().catch(() => []),
  ]);

  return (
    <div className="pt-28 pb-32 md:pb-16 min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-12">

        {/* Heading */}
        <div className="mb-16">
          <p className="font-body text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-3">
            Portfolio
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-light">
            The <em>Gallery</em>
          </h1>
          <p className="font-body text-sm text-neutral-400 mt-3">
            {photos.length} photographs across {categories.length} categories
          </p>
        </div>

        {/* Category cards */}
        {categories.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl font-light text-neutral-300 italic">
              No photos yet
            </p>
            <p className="font-body text-sm text-neutral-400 mt-3">
              Upload your first photos via the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const catPhotos = photos.filter((p) => p.category === cat);
              const cover = catPhotos[0];
              return (
                <Link
                  key={cat}
                  href={`/gallery/${cat}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  {cover ? (
                    <Image
                      src={cover.thumbnailUrl}
                      alt={cat}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1">
                      {catPhotos.length} photo{catPhotos.length !== 1 ? "s" : ""}
                    </p>
                    <p className="font-display text-3xl font-light text-white">
                      {capitalize(cat)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
