import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";

/* ── Dynamic image discovery ─────────────────────────────────── */
const landscapeModules = import.meta.glob(
  "../assets/my-photos/landscape/*.{jpg,jpeg,png,webp}", { eager: true }
) as Record<string, { default: string }>;

const natureModules = import.meta.glob(
  "../assets/my-photos/nature/*.{jpg,jpeg,png,webp}", { eager: true }
) as Record<string, { default: string }>;

const streetModules = import.meta.glob(
  "../assets/my-photos/street/*.{jpg,jpeg,png,webp}", { eager: true }
) as Record<string, { default: string }>;

const allModules = import.meta.glob(
  "../assets/my-photos/**/*.{jpg,jpeg,png,webp}", { eager: true }
) as Record<string, { default: string }>;

function nOf(modules: Record<string, { default: string }>, n: number) {
  return Object.values(modules).slice(0, n).map((m) => m.default);
}

const landscapePhotos = nOf(landscapeModules, 6);
const naturePhotos    = nOf(natureModules, 2);
const streetPhotos    = nOf(streetModules, 2);
const allPhotos       = nOf(allModules, 8);

// Asymmetric featured: big = first landscape, pair = first nature + first street
const featBig    = landscapePhotos[0] ?? null;
const featPair   = [naturePhotos[0], streetPhotos[0]].filter(Boolean) as string[];

// Stats
const totalCount = Object.keys(allModules).length;

/* ── Marquee text ─────────────────────────────────────────────── */
const MARQUEE_ITEMS = ["Landscape", "Portrait", "Nature", "Street", "Light", "Story"];

/* ── Fade-up variant ─────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const fadeUpInView = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const Index = () => (
  <div className="overflow-x-hidden">

    {/* ══ HERO ══════════════════════════════════════════════════ */}
    <div className="relative">
      <HeroSlider />

      {/* Text overlay — bottom-left editorial layout */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-20 px-8 md:px-16 pointer-events-none">
        <motion.p
          {...fadeUp(0.2)}
          className="font-body text-[10px] tracking-[0.4em] uppercase text-white/50 mb-5"
        >
          Photography Portfolio — Lumiq
        </motion.p>

        <motion.h1
          {...fadeUp(0.45)}
          className="font-display text-5xl sm:text-7xl md:text-[6.5rem] font-light leading-[1.0] text-white mb-7 max-w-3xl"
        >
          Capturing Light.
          <br />
          <em className="italic text-white/80">Telling Stories.</em>
        </motion.h1>

        <motion.div
          {...fadeUp(0.75)}
          className="flex flex-wrap items-center gap-5 pointer-events-auto"
        >
          <Link
            to="/gallery"
            className="font-body text-[11px] tracking-[0.25em] uppercase bg-white text-black px-8 py-3 rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            View Gallery
          </Link>
          <Link
            to="/contact"
            className="font-body text-[11px] tracking-[0.25em] uppercase text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            Contact Me <span className="text-base leading-none">→</span>
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue — center bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-white/40" />
        </motion.div>
      </motion.div>
    </div>

    {/* ══ MARQUEE STRIP ═════════════════════════════════════════ */}
    <div className="bg-neutral-900 py-4 overflow-hidden border-y border-neutral-800">
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

    {/* ══ SELECTED WORKS ════════════════════════════════════════ */}
    {(featBig || featPair.length > 0) && (
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6 md:px-12">

          {/* Left-aligned heading */}
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <motion.div {...fadeUpInView()}>
              <p className="font-body text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-3">
                Selected Works
              </p>
              <h2 className="font-display text-5xl md:text-6xl font-light leading-tight">
                Recent<br /><em>Collection</em>
              </h2>
            </motion.div>
            <motion.div {...fadeUpInView(0.15)}>
              <Link
                to="/gallery"
                className="font-body text-xs tracking-[0.2em] uppercase text-neutral-400 border border-neutral-200 rounded-full px-6 py-2.5 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300"
              >
                View All {totalCount > 0 ? `${totalCount}+` : ""} Works
              </Link>
            </motion.div>
          </div>

          {/* Row 1 — flex-based asymmetric layout (reliable height) */}
          <div className="flex flex-col md:flex-row gap-3 md:h-[500px]">

            {/* Big card — 2/3 width on desktop */}
            {featBig && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 aspect-[4/3] md:aspect-auto md:flex-[2]"
              >
                <Link to="/gallery" className="absolute inset-0">
                  <img
                    src={featBig}
                    alt="Landscape"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="font-body text-xs uppercase tracking-[0.25em] text-white/60 mb-1">Landscape</p>
                      <p className="font-display text-3xl font-light text-white">The Open Land</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Right column — 1/3 width, two equal stacked cards */}
            <div className="flex flex-col gap-3 md:flex-1">
              {featPair.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.12 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 aspect-[4/3] md:aspect-auto md:flex-1"
                >
                  <Link to="/gallery" className="absolute inset-0">
                    <img
                      src={src}
                      alt={i === 0 ? "Nature" : "Street"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                      <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="font-body text-xs uppercase tracking-[0.25em] text-white/60 mb-1">
                          {i === 0 ? "Nature" : "Street"}
                        </p>
                        <p className="font-display text-xl font-light text-white">
                          {i === 0 ? "Into the Wild" : "City Frames"}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Row 2 — three equal landscape cards */}
          {landscapePhotos.length >= 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {landscapePhotos.slice(1, 4).map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <Link to="/gallery" className="absolute inset-0">
                    <img
                      src={src}
                      alt="Landscape"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                      <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="font-body text-xs uppercase tracking-[0.25em] text-white/60 mb-1">Landscape</p>
                        <p className="font-display text-lg font-light text-white">Frame {i + 2}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    )}

    {/* ══ STATS ROW ═════════════════════════════════════════════ */}
    <section className="py-16 bg-neutral-50 border-y border-neutral-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-200">
          {[
            { number: "21", label: "Landscapes" },
            { number: "8",  label: "Nature Shots" },
            { number: "6",  label: "Street Photos" },
            { number: "∞",  label: "Stories to Tell" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              {...fadeUpInView(i * 0.08)}
              className="text-center py-4 px-4"
            >
              <p className="font-display text-5xl md:text-6xl font-light text-neutral-900 mb-2">
                {stat.number}
              </p>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-neutral-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ PHOTO STRIP ═══════════════════════════════════════════ */}
    {allPhotos.length >= 4 && (
      <section className="py-0 bg-white overflow-hidden">
        <motion.div
          {...fadeUpInView()}
          className="flex gap-1 mt-0"
        >
          {allPhotos.slice(0, 6).map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 1.04 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.07 }}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              className="relative flex-1 min-w-0 aspect-[3/4] overflow-hidden cursor-pointer"
            >
              <Link to="/gallery">
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    )}

    {/* ══ QUOTE ═════════════════════════════════════════════════ */}
    <section className="relative py-32 bg-neutral-900 overflow-hidden">
      {/* Subtle background texture using a photo at low opacity */}
      {landscapePhotos[2] && (
        <img
          src={landscapePhotos[2]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10 scale-105"
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-neutral-900/60" />

      <div className="relative container mx-auto px-6 max-w-4xl text-center">
        <motion.p
          {...fadeUpInView()}
          className="font-display text-3xl md:text-5xl font-light leading-relaxed text-white/90 italic"
        >
          "Light is everything. It shapes mood,<br className="hidden md:block" />
          depth, and emotion — and I spend<br className="hidden md:block" />
          my life chasing it."
        </motion.p>

        <motion.div
          {...fadeUpInView(0.25)}
          className="mt-6 flex flex-col items-center gap-1"
        >
          <div className="w-8 h-px bg-white/20 mb-4" />
          <p className="font-body text-xs tracking-[0.3em] uppercase text-white/30">
            — Lumiq
          </p>
        </motion.div>

        <motion.div {...fadeUpInView(0.4)} className="mt-12">
          <Link
            to="/about"
            className="font-body text-[11px] tracking-[0.25em] uppercase text-white/50 border border-white/20 rounded-full px-8 py-3 hover:bg-white hover:text-black transition-all duration-400"
          >
            About Me
          </Link>
        </motion.div>
      </div>
    </section>

  </div>
);

export default Index;
