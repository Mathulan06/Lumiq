"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/lib/types";

interface Props {
  photos: Photo[];
}

export default function HeroSlideshow({ photos }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [photos.length]);

  return (
    <section className="relative h-screen min-h-[600px] bg-neutral-900 flex items-end pb-20 px-8 md:px-16 overflow-hidden">

      {/* Slides */}
      {photos.map((photo, i) => (
        <div
          key={photo.publicId}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={photo.url}
            alt={photo.title || "Hero"}
            fill
            priority={i === 0}
            className="object-cover opacity-70"
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Text */}
      <div className="relative z-10 pointer-events-none">
        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-white/50 mb-5">
          Photography Portfolio — Lumiq
        </p>
        <h1 className="font-display text-5xl sm:text-7xl md:text-[6.5rem] font-light leading-[1.0] text-white mb-7 max-w-3xl">
          Capturing Light.
          <br />
          <em className="italic text-white/80">Telling Stories.</em>
        </h1>
        <div className="flex flex-wrap items-center gap-5 pointer-events-auto">
          <Link
            href="/gallery"
            className="font-body text-[11px] tracking-[0.25em] uppercase bg-white text-black px-8 py-3 rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            View Gallery
          </Link>
          <Link
            href="/contact"
            className="font-body text-[11px] tracking-[0.25em] uppercase text-white/60 hover:text-white transition-colors duration-300"
          >
            Contact Me →
          </Link>
        </div>
      </div>

      {/* Dot indicators — only if more than 1 photo */}
      {photos.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
