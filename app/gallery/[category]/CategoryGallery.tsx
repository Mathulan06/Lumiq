"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@/lib/types";

export default function CategoryGallery({ photos }: { photos: Photo[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () =>
    setLightbox((i) => ((i ?? 0) - 1 + photos.length) % photos.length);
  const next = () =>
    setLightbox((i) => ((i ?? 0) + 1) % photos.length);

  if (photos.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-3xl font-light text-neutral-300 italic">
          No photos in this category yet
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setLightbox(i)}
            className="group relative overflow-hidden rounded-2xl cursor-pointer break-inside-avoid shadow-md hover:shadow-xl transition-shadow duration-400"
          >
            <Image
              src={photo.thumbnailUrl}
              alt={photo.title || photo.category}
              width={900}
              height={0}
              style={{ height: "auto", width: "100%" }}
              className="block transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
              <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {photo.title && (
                  <p className="font-display text-lg font-light text-white">{photo.title}</p>
                )}
                {photo.price > 0 && (
                  <p className="font-body text-xs text-white/60 mt-0.5">${photo.price}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors z-10"
            >
              <X size={28} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-white/60 hover:text-white transition-colors z-10 p-2"
            >
              <ChevronLeft size={36} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-white/60 hover:text-white transition-colors z-10 p-2"
            >
              <ChevronRight size={36} />
            </button>

            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center gap-4"
            >
              <div className="relative w-full max-h-[75vh]">
                <Image
                  src={photos[lightbox].url}
                  alt={photos[lightbox].title || ""}
                  width={1600}
                  height={0}
                  style={{ height: "auto", maxHeight: "75vh", width: "auto", margin: "0 auto" }}
                  className="rounded-lg"
                  priority
                />
              </div>
              <div className="text-center">
                {photos[lightbox].title && (
                  <p className="font-display text-2xl font-light text-white">
                    {photos[lightbox].title}
                  </p>
                )}
                {photos[lightbox].description && (
                  <p className="font-body text-sm text-white/50 mt-1">
                    {photos[lightbox].description}
                  </p>
                )}
              </div>
            </motion.div>

            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-body text-xs text-white/30 tracking-widest">
              {lightbox + 1} / {photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
