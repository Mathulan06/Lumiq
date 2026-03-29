"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RefreshCw, Images } from "lucide-react";
import { toast } from "sonner";
import UploadForm from "./UploadForm";
import type { Photo } from "@/lib/types";
import { capitalize } from "@/lib/utils";

export default function ImageManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [photosRes, catsRes] = await Promise.all([
        fetch("/api/images"),
        fetch("/api/categories"),
      ]);
      setPhotos(await photosRes.json());
      setCategories(await catsRes.json());
    } catch {
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function deletePhoto(photo: Photo) {
    if (!confirm(`Delete "${photo.title || photo.category}"? This cannot be undone.`)) return;
    setDeleting(photo.publicId);
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: photo.publicId }),
      });
      if (!res.ok) throw new Error();
      toast.success("Photo deleted");
      setPhotos((prev) => prev.filter((p) => p.publicId !== photo.publicId));
    } catch {
      toast.error("Failed to delete photo");
    } finally {
      setDeleting(null);
    }
  }

  const displayed =
    activeCategory === "all"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-10">
      {/* Upload form */}
      <UploadForm existingCategories={categories} onSuccess={fetchData} />

      {/* Library header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Images size={18} className="text-neutral-400" />
          <h2 className="font-display text-2xl font-light">
            Library{" "}
            <span className="font-body text-base text-neutral-400 font-normal">
              ({photos.length})
            </span>
          </h2>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Category filter tabs */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {["all", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-body text-xs tracking-[0.15em] uppercase px-4 py-2 rounded-full border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-400 border-neutral-200 hover:border-neutral-400"
              }`}
            >
              {cat === "all" ? `All (${photos.length})` : `${capitalize(cat)} (${photos.filter((p) => p.category === cat).length})`}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-neutral-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-3xl font-light text-neutral-300 italic">
            No photos yet
          </p>
          <p className="font-body text-sm text-neutral-400 mt-2">
            Upload your first photo using the form above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {displayed.map((photo) => (
              <motion.div
                key={photo.publicId}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-100 shadow-sm"
              >
                <Image
                  src={photo.thumbnailUrl}
                  alt={photo.title || photo.category}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />

                {/* Hover info + delete */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <button
                    onClick={() => deletePhoto(photo)}
                    disabled={deleting === photo.publicId}
                    className="self-end bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div>
                    {photo.title && (
                      <p className="font-display text-base font-light text-white truncate">
                        {photo.title}
                      </p>
                    )}
                    <p className="font-body text-[10px] uppercase tracking-widest text-white/50">
                      {capitalize(photo.category)}
                    </p>
                    {photo.price > 0 && (
                      <p className="font-body text-xs text-white/70 mt-0.5">${photo.price}</p>
                    )}
                  </div>
                </div>

                {deleting === photo.publicId && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
