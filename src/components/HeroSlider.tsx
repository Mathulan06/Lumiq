import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const allLandscape = import.meta.glob(
  "../assets/my-photos/landscape/*.{jpg,jpeg,png,webp}",
  { eager: true }
) as Record<string, { default: string }>;

const allNature = import.meta.glob(
  "../assets/my-photos/nature/*.{jpg,jpeg,png,webp}",
  { eager: true }
) as Record<string, { default: string }>;

function pickHeroSlides() {
  const landscape = Object.values(allLandscape).map((m) => m.default);
  const nature = Object.values(allNature).map((m) => m.default);
  const slides = [...landscape.slice(0, 2), ...nature.slice(0, 1)];
  return slides.length > 0 ? slides : landscape.slice(0, 3);
}

const slides = pickHeroSlides();

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
    setProgressKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const goTo = (i: number) => {
    setCurrent(i);
    setProgressKey((k) => k + 1);
  };

  if (slides.length === 0) return <div className="w-full h-screen bg-neutral-900" />;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={slides[current]}
          alt={`Hero slide ${current + 1}`}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Gradient overlays — heavier at bottom-left for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Bottom-right: progress bar + slide counter */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 right-8 z-10 flex items-center gap-3">
          <div className="w-16 h-px bg-white/20 overflow-hidden">
            <div
              key={progressKey}
              className="h-full bg-white/80 animate-slide-progress"
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={current}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="font-body text-xs text-white/50 tracking-[0.2em]"
            >
              {String(current + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      {/* Bottom-center: dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-11 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-px transition-all duration-500 ${
                i === current ? "bg-white w-10" : "bg-white/35 w-5 hover:bg-white/60"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
