import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import LightboxModal from "@/components/LightboxModal";

import landscapeImg from "@/assets/gallery-landscape-1.jpg";
import streetImg from "@/assets/gallery-street-1.jpg";
import portraitImg from "@/assets/gallery-portrait-1.jpg";
import eventImg from "@/assets/gallery-event-1.jpg";
import mobileImg from "@/assets/gallery-mobile-1.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const categories = [
  { name: "All", id: "all" },
  { name: "Landscape", id: "landscape" },
  { name: "Street", id: "street" },
  { name: "Portrait", id: "portrait" },
  { name: "Event", id: "event" },
  { name: "Mobile", id: "mobile" },
];

const photos = [
  { src: landscapeImg, title: "Misty Valley", category: "landscape" },
  { src: hero1, title: "Golden Horizon", category: "landscape" },
  { src: streetImg, title: "Market Life", category: "street" },
  { src: hero2, title: "Neon Nights", category: "street" },
  { src: portraitImg, title: "Golden Hour", category: "portrait" },
  { src: hero3, title: "Cinematic Mood", category: "portrait" },
  { src: eventImg, title: "Celebration", category: "event" },
  { src: mobileImg, title: "Urban Angles", category: "mobile" },
];

const Gallery = () => {
  const [active, setActive] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === "all" ? photos : photos.filter((p) => p.category === active);

  return (
    <div className="pt-24 pb-20 bg-cinema-gradient min-h-screen">
      <div className="container mx-auto px-6">
        <SectionHeading title="Gallery" subtitle="Explore my work across different genres" />

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`font-display text-xs tracking-widest uppercase px-5 py-2 rounded-full border transition-all duration-300 ${
                active === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((photo, i) => (
            <motion.div
              key={photo.title}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer image-watermark"
              onClick={() => setLightbox(i)}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/50 transition-colors duration-500 flex items-end p-5">
                <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-xs uppercase tracking-widest text-primary font-display">{photo.category}</p>
                  <p className="font-display text-lg font-semibold">{photo.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
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
