import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Dynamically pick hero slides from whatever landscape photos exist
const allLandscape = import.meta.glob(
  "../assets/my-photos/landscape/*.{jpg,jpeg,png,webp}",
  { eager: true }
) as Record<string, { default: string }>;

const allNature = import.meta.glob(
  "../assets/my-photos/nature/*.{jpg,jpeg,png,webp}",
  { eager: true }
) as Record<string, { default: string }>;

// Take up to 2 from landscape + 1 from nature for variety
function pickHeroSlides() {
  const landscape = Object.values(allLandscape).map((m) => m.default);
  const nature = Object.values(allNature).map((m) => m.default);
  const slides = [
    ...landscape.slice(0, 2),
    ...nature.slice(0, 1),
  ];
  return slides.length > 0 ? slides : landscape.slice(0, 3);
}

const slides = pickHeroSlides();

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  if (slides.length === 0) return <div className="w-full h-screen bg-neutral-100" />;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={slides[current]}
          alt={`Hero slide ${current + 1}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/35" />

      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors" aria-label="Previous">
            <ChevronLeft size={32} />
          </button>
          <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors" aria-label="Next">
            <ChevronRight size={32} />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-px transition-all duration-300 ${i === current ? "bg-white w-8" : "bg-white/40 w-4"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;
