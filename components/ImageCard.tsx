"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Photo } from "@/lib/types";

interface Props {
  photo: Photo;
  onClick?: () => void;
  showPrice?: boolean;
}

export default function ImageCard({ photo, onClick, showPrice = false }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-500 aspect-[3/4]"
    >
      <Image
        src={photo.thumbnailUrl}
        alt={photo.title || photo.category}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
        <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {photo.title && (
            <p className="font-display text-xl font-light text-white">{photo.title}</p>
          )}
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/60 mt-0.5">
            {photo.category}
          </p>
          {showPrice && photo.price > 0 && (
            <p className="font-body text-sm font-medium text-white/90 mt-1">
              ${photo.price}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
