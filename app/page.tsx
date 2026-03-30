import Link from "next/link";
import Image from "next/image";
import { getPhotos, getCategories, getHeroPhotos, getFeaturedPhotos } from "@/lib/cloudinary";
import HeroSlideshow from "@/components/HeroSlideshow";

const MARQUEE_ITEMS = ["Landscape", "Portrait", "Nature", "Street", "Light", "Story"];

export const revalidate = 60;

export default async function HomePage() {
  const [photos, categories, heroPhotos, featuredPhotos] = await Promise.all([
    getPhotos().catch(() => []),
    getCategories().catch(() => []),
    getHeroPhotos().catch(() => []),
    getFeaturedPhotos().catch(() => []),
  ]);

  const heroSlides = heroPhotos.length > 0 ? heroPhotos : photos.slice(0, 1);
  const recent = photos.slice(0, 5);
  const strip = photos.slice(0, 6);

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO SLIDESHOW ───────────────────────────────────── */}
      <HeroSlideshow photos={heroSlides} />

      {/* ── MARQUEE STRIP ────────────────────────────────────── */}
      <div className="bg-neutral-900 dark:bg-black py-4 overflow-hidden border-y border-neutral-800">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6">
              <span className="font-display text-sm font-light tracking-[0.3em] uppercase text-white/40">
                {item}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ── RECENT COLLECTION ────────────────────────────────── */}
      {recent.length > 0 && (
        <section className="py-28 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
              <div>
                <p className="font-body text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-3">
                  Selected Works
                </p>
                <h2 className="font-display text-5xl md:text-6xl font-light leading-tight">
                  Recent<br /><em>Collection</em>
                </h2>
              </div>
              <Link
                href="/gallery"
                className="font-body text-xs tracking-[0.2em] uppercase text-neutral-400 border border-neutral-200 dark:border-neutral-700 rounded-full px-6 py-2.5 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 dark:hover:bg-white dark:hover:text-neutral-900 dark:hover:border-white transition-all duration-300"
              >
                View All {photos.length > 0 ? `${photos.length}+` : ""} Works
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              {recent.map((photo, i) => (
                <Link
                  key={photo.id}
                  href={`/gallery/${photo.category}`}
                  className={`group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl dark:shadow-black/40 transition-all duration-500 hover:-translate-y-1 ${
                    i < 3 ? "sm:col-span-2 aspect-[3/4]" : "sm:col-span-3 aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={photo.thumbnailUrl}
                    alt={photo.title || photo.category}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-6">
                    <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/60 mb-1">
                        {photo.category}
                      </p>
                      <p className="font-display text-2xl font-light text-white">
                        {photo.title || photo.category}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED COLLECTION ──────────────────────────────── */}
      {featuredPhotos.length > 0 && (
        <section className="py-28 bg-neutral-50 dark:bg-neutral-800">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
              <div>
                <p className="font-body text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-3">
                  Curated Picks
                </p>
                <h2 className="font-display text-5xl md:text-6xl font-light leading-tight">
                  Featured<br /><em>Collection</em>
                </h2>
              </div>
              <Link
                href="/gallery"
                className="font-body text-xs tracking-[0.2em] uppercase text-neutral-400 border border-neutral-200 dark:border-neutral-600 rounded-full px-6 py-2.5 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 dark:hover:bg-white dark:hover:text-neutral-900 dark:hover:border-white transition-all duration-300"
              >
                Browse Gallery
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredPhotos.map((photo) => (
                <Link
                  key={photo.id}
                  href={`/gallery/${photo.category}`}
                  className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl dark:shadow-black/40 transition-all duration-500 hover:-translate-y-1 aspect-[3/4]"
                >
                  <Image
                    src={photo.thumbnailUrl}
                    alt={photo.title || photo.category}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1">
                      {photo.category}
                    </p>
                    <p className="font-display text-2xl font-light text-white">
                      {photo.title || photo.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STATS ROW ────────────────────────────────────────── */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-100 dark:border-neutral-700">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-200 dark:divide-neutral-700">
            {[
              { number: String(photos.length || "—"), label: "Photos" },
              { number: String(categories.length || "—"), label: "Categories" },
              { number: "∞", label: "Stories to Tell" },
              { number: "1", label: "Photographer" },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-4 px-4">
                <p className="font-display text-5xl md:text-6xl font-light text-neutral-900 dark:text-white mb-2">
                  {stat.number}
                </p>
                <p className="font-body text-[10px] tracking-[0.25em] uppercase text-neutral-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO STRIP ──────────────────────────────────────── */}
      {strip.length >= 4 && (
        <div className="flex gap-1 overflow-hidden">
          {strip.map((photo) => (
            <Link
              key={photo.id}
              href="/gallery"
              className="relative flex-1 min-w-0 aspect-[3/4] overflow-hidden group"
            >
              <Image
                src={photo.thumbnailUrl}
                alt={photo.title || ""}
                fill
                sizes="16vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      )}

      {/* ── QUOTE ────────────────────────────────────────────── */}
      <section className="relative py-32 bg-neutral-900 dark:bg-black overflow-hidden">
        <div className="relative container mx-auto px-6 max-w-4xl text-center">
          <p className="font-display text-3xl md:text-5xl font-light leading-relaxed text-white/90 italic">
            "Light is everything. It shapes mood,
            <br className="hidden md:block" />
            depth, and emotion — and I spend
            <br className="hidden md:block" />
            my life chasing it."
          </p>
          <div className="mt-6 flex flex-col items-center gap-1">
            <div className="w-8 h-px bg-white/20 mb-4" />
            <p className="font-body text-xs tracking-[0.3em] uppercase text-white/30">— Lumiq</p>
          </div>
          <div className="mt-12">
            <Link
              href="/about"
              className="font-body text-[11px] tracking-[0.25em] uppercase text-white/50 border border-white/20 rounded-full px-8 py-3 hover:bg-white hover:text-black transition-all duration-400"
            >
              About Me
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
