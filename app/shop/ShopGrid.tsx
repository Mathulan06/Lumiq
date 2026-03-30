"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, MessageCircle } from "lucide-react";
import type { Photo } from "@/lib/types";
import { capitalize } from "@/lib/utils";

const WHATSAPP_NUMBER = "94774988686";

export default function ShopGrid({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);

  function orderViaWhatsApp(photo: Photo) {
    const msg = encodeURIComponent(
      `Hi! I'd like to order a print of "${photo.title || photo.category}" priced at $${photo.price}. Could you share more details?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-3xl font-light text-neutral-300 italic">
          No prints available yet
        </p>
        <p className="font-body text-sm text-neutral-400 mt-3">
          Check back soon — new prints added regularly.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group"
          >
            <div
              onClick={() => setSelected(photo)}
              className="relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-400 mb-4"
            >
              <Image
                src={photo.thumbnailUrl}
                alt={photo.title || photo.category}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl font-light text-neutral-900">
                  {photo.title || capitalize(photo.category)}
                </p>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-neutral-400 mt-0.5">
                  {capitalize(photo.category)}
                </p>
                {photo.description && (
                  <p className="font-body text-sm text-neutral-500 mt-1 line-clamp-2">
                    {photo.description}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-2xl font-light text-neutral-900">
                  ${photo.price}
                </p>
                <button
                  onClick={() => orderViaWhatsApp(photo)}
                  className="mt-2 flex items-center gap-1.5 font-body text-[10px] tracking-[0.2em] uppercase text-green-600 hover:text-green-700 transition-colors"
                >
                  <MessageCircle size={13} />
                  Order
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick-view modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={selected.url}
                alt={selected.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <p className="font-display text-3xl font-light">
                {selected.title || capitalize(selected.category)}
              </p>
              {selected.description && (
                <p className="font-body text-sm text-neutral-500 mt-2">{selected.description}</p>
              )}
              <div className="flex items-center justify-between mt-6">
                <p className="font-display text-4xl font-light">${selected.price}</p>
                <button
                  onClick={() => orderViaWhatsApp(selected)}
                  className="flex items-center gap-2 bg-neutral-900 text-white font-body text-xs tracking-[0.2em] uppercase px-6 py-3 rounded-full hover:bg-neutral-700 transition-colors"
                >
                  <ShoppingBag size={14} />
                  Order via WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
