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

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

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
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Gradient overlays — heavier at bottom-left for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

    </div>
  );
};

export default HeroSlider;
