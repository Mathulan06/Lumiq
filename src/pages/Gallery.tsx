import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LightboxModal from "@/components/LightboxModal";

/* ── Image discovery ─────────────────────────────────────────── */
const imageModules = import.meta.glob(
  "../assets/my-photos/**/*.{jpg,jpeg,png,webp}",
  { eager: true }
) as Record<string, { default: string }>;

function titleFromFilename(filename: string, category: string, idx: number): string {
  const name = filename.replace(/\.[^/.]+$/, "");
  if (/^(img|dsc|dcim|dscf|_mg)_?\d+/i.test(name)) {
    return `${category.charAt(0).toUpperCase() + category.slice(1)} ${idx + 1}`;
  }
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

type Photo = { src: string; title: string; category: string };

function buildPhotoList(): Photo[] {
  const countPerCategory: Record<string, number> = {};
  const photos: Photo[] = [];
  const sorted = Object.entries(imageModules).sort(([a], [b]) => a.localeCompare(b));
  for (const [key, mod] of sorted) {
    const parts = key.split("/");
    const category = parts[parts.length - 2];
    const filename = parts[parts.length - 1];
    countPerCategory[category] = countPerCategory[category] ?? 0;
    const idx = countPerCategory[category]++;
    photos.push({ src: mod.default, title: titleFromFilename(filename, category, idx), category });
  }
  return photos;
}

const ALL_PHOTOS = buildPhotoList();

const CATEGORY_ORDER = ["landscape", "portrait", "nature", "street"];

const CATEGORIES = [
  { name: "All", id: "all", count: ALL_PHOTOS.length },
  ...CATEGORY_ORDER
    .filter((c) => ALL_PHOTOS.some((p) => p.category === c))
    .map((c) => ({
      name: c.charAt(0).toUpperCase() + c.slice(1),
      id: c,
      count: ALL_PHOTOS.filter((p) => p.category === c).length,
    })),
];

/* ── Component ───────────────────────────────────────────────── */
const Gallery = () => {
  const [active, setActive] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [displayed, setDisplayed] = useState<Photo[]>(ALL_PHOTOS);
  const [gridKey, setGridKey] = useState(0);

  // Slight delay so fade-out completes before new photos appear
  useEffect(() => {
    const photos = active === "all" ? ALL_PHOTOS : ALL_PHOTOS.filter((p) => p.category === active);
    const t = setTimeout(() => {
      setDisplayed(photos);
      setGridKey((k) => k + 1);
    }, 120);
    return () => clearTimeout(t);
  }, [active]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setLightbox((i) => ((i ?? 0) + 1) % displayed.length);
      if (e.key === "ArrowLeft")  setLightbox((i) => ((i ?? 0) - 1 + displayed.length) % displayed.length);
      if (e.key === "Escape")     setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, displayed.length]);

  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-neutral-400 mb-3">
            Visual Collection
          </p>
          <h1 className="font-display text-6xl md:text-8xl font-light leading-none">
            Gallery
          </h1>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`relative font-body text-xs tracking-[0.12em] uppercase px-5 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                active === cat.id
                  ? "bg-neutral-900 text-white shadow-lg"
                  : "text-neutral-400 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
              }`}
            >
              {cat.name}
              <span className={`text-[10px] ${active === cat.id ? "text-white/50" : "text-neutral-400"}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Masonry grid — original aspect ratios via CSS columns */}
        <AnimatePresence mode="wait">
          <motion.div
            key={gridKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-3"
          >
            {displayed.map((photo, i) => (
              <motion.div
                key={photo.src}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
                className="break-inside-avoid mb-3 group relative overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setLightbox(i)}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5">
                  <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-body text-[10px] uppercase tracking-[0.25em] text-white/60 mb-1">
                      {photo.category}
                    </p>
                    <p className="font-display text-xl font-light text-white leading-tight">
                      {photo.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {displayed.length === 0 && (
          <p className="text-center font-body text-sm text-neutral-400 py-20">
            No photos in this category yet.
          </p>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <LightboxModal
          images={displayed}
          currentIndex={lightbox}
          onClose={() => setLightbox(null)}
          onNext={() => setLightbox((lightbox + 1) % displayed.length)}
          onPrev={() => setLightbox((lightbox - 1 + displayed.length) % displayed.length)}
        />
      )}
    </div>
  );
};

export default Gallery;
