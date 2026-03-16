import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import LightboxModal from "@/components/LightboxModal";

// Auto-discovers every image inside src/assets/my-photos/*/
// Adding or removing a file there (via the photo-sync plugin) triggers a full reload.
const imageModules = import.meta.glob(
  "../assets/my-photos/**/*.{jpg,jpeg,png,webp}",
  { eager: true }
) as Record<string, { default: string }>;

function titleFromFilename(filename: string, category: string, idx: number): string {
  const name = filename.replace(/\.[^/.]+$/, "");
  // Camera-roll style names (IMG_xxxx, DSC_xxxx, etc.) → "Landscape 1"
  if (/^(img|dsc|dcim|dscf|_mg)_?\d+/i.test(name)) {
    return `${category.charAt(0).toUpperCase() + category.slice(1)} ${idx + 1}`;
  }
  // Human-readable filenames like "misty-valley" → "Misty Valley"
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

type Photo = { src: string; title: string; category: string };

function buildPhotoList(): Photo[] {
  const countPerCategory: Record<string, number> = {};
  const photos: Photo[] = [];

  const sorted = Object.entries(imageModules).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  for (const [key, mod] of sorted) {
    // key looks like: ../assets/my-photos/landscape/IMG_0819.jpg
    const parts = key.split("/");
    const category = parts[parts.length - 2];
    const filename = parts[parts.length - 1];
    countPerCategory[category] = (countPerCategory[category] ?? 0);
    const idx = countPerCategory[category]++;
    photos.push({
      src: mod.default,
      title: titleFromFilename(filename, category, idx),
      category,
    });
  }

  return photos;
}

const ALL_PHOTOS = buildPhotoList();

const CATEGORIES = [
  { name: "All", id: "all" },
  ...["landscape", "portrait", "nature", "street"]
    .filter((c) => ALL_PHOTOS.some((p) => p.category === c))
    .map((c) => ({ name: c.charAt(0).toUpperCase() + c.slice(1), id: c })),
];

const Gallery = () => {
  const [active, setActive] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    active === "all" ? ALL_PHOTOS : ALL_PHOTOS.filter((p) => p.category === active);

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <SectionHeading
          title="Gallery"
          subtitle="Landscapes, portraits & nature from the tea estates"
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-8 mb-14">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`font-body text-xs tracking-[0.15em] uppercase pb-1 transition-all duration-200 ${
                active === cat.id
                  ? "text-foreground border-b border-foreground"
                  : "text-neutral-400 hover:text-foreground border-b border-transparent"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((photo, i) => (
            <motion.div
              key={photo.src}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
              onClick={() => setLightbox(i)}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-500 flex items-end p-5">
                <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-white/70">
                    {photo.category}
                  </p>
                  <p className="font-display text-xl font-light text-white">{photo.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {lightbox !== null && (
        <LightboxModal
          images={filtered}
          currentIndex={lightbox}
          onClose={() => setLightbox(null)}
          onNext={() => setLightbox((lightbox + 1) % filtered.length)}
          onPrev={() => setLightbox((lightbox - 1 + filtered.length) % filtered.length)}
        />
      )}
    </div>
  );
};

export default Gallery;
