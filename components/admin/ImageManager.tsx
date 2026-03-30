"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RefreshCw, Images, Pencil, X, Check, Star, Home } from "lucide-react";
import { toast } from "sonner";
import UploadForm from "./UploadForm";
import type { Photo } from "@/lib/types";
import { capitalize } from "@/lib/utils";

interface EditState {
  photo: Photo;
  category: string;
  customCategory: string;
  title: string;
  description: string;
  price: string;
  isHero: boolean;
  isFeatured: boolean;
}

export default function ImageManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [renamingCat, setRenamingCat] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renaming, setRenaming] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [photosRes, catsRes] = await Promise.all([
        fetch("/api/images"),
        fetch("/api/categories"),
      ]);
      const photosData = await photosRes.json();
      const catsData = await catsRes.json();
      setPhotos(Array.isArray(photosData) ? photosData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
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
      if (editing?.photo.publicId === photo.publicId) setEditing(null);
    } catch {
      toast.error("Failed to delete photo");
    } finally {
      setDeleting(null);
    }
  }

  function openEdit(photo: Photo) {
    setEditing({
      photo,
      category: photo.category,
      customCategory: "",
      title: photo.title,
      description: photo.description,
      price: photo.price > 0 ? String(photo.price) : "",
      isHero: !!photo.isHero,
      isFeatured: !!photo.isFeatured,
    });
  }

  async function saveEdit() {
    if (!editing) return;
    const effectiveCategory =
      editing.category === "__new__" ? editing.customCategory : editing.category;
    if (!effectiveCategory.trim()) {
      toast.error("Category is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: editing.photo.publicId,
          category: effectiveCategory.trim(),
          title: editing.title,
          description: editing.description,
          price: editing.price || "0",
          isHero: editing.isHero,
          isFeatured: editing.isFeatured,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Photo updated");
      // Update local state immediately
      setPhotos((prev) =>
        prev.map((p) =>
          p.publicId === editing.photo.publicId
            ? {
                ...p,
                category: effectiveCategory.trim().toLowerCase(),
                title: editing.title,
                description: editing.description,
                price: parseFloat(editing.price || "0"),
                isHero: editing.isHero,
                isFeatured: editing.isFeatured,
              }
            : editing.isHero ? { ...p, isHero: false } : p
        )
      );
      setEditing(null);
      // Refresh categories in case a new one was added
      fetch("/api/categories")
        .then((r) => r.json())
        .then((d) => { if (Array.isArray(d)) setCategories(d); });
    } catch {
      toast.error("Failed to update photo");
    } finally {
      setSaving(false);
    }
  }

  async function renameCategory() {
    if (!renamingCat || !renameValue.trim()) return;
    const newCat = renameValue.toLowerCase().trim();
    if (newCat === renamingCat) { setRenamingCat(null); return; }
    setRenaming(true);
    try {
      const res = await fetch("/api/admin/rename-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldCategory: renamingCat, newCategory: newCat }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Renamed "${renamingCat}" → "${newCat}" (${data.updated} photos)`);
      if (activeCategory === renamingCat) setActiveCategory(newCat);
      setRenamingCat(null);
      setRenameValue("");
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Rename failed");
    } finally {
      setRenaming(false);
    }
  }

  const displayed =
    activeCategory === "all"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900";

  return (
    <div className="space-y-10">
      {/* Upload form */}
      <UploadForm existingCategories={categories} onSuccess={fetchData} />

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(null)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none"
            >
              <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl p-6 w-full md:max-w-lg pointer-events-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-2xl font-light">Edit Photo</h3>
                  <button
                    onClick={() => setEditing(null)}
                    className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-5 bg-neutral-100">
                  <Image
                    src={editing.photo.thumbnailUrl}
                    alt={editing.photo.title || editing.photo.category}
                    fill
                    className="object-cover"
                    sizes="480px"
                  />
                </div>

                <div className="space-y-4">
                  {/* Category */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
                        Category *
                      </label>
                      <select
                        value={editing.category}
                        onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                        className={inputClass}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{capitalize(c)}</option>
                        ))}
                        <option value="__new__">+ New category</option>
                      </select>
                    </div>
                    {editing.category === "__new__" && (
                      <div>
                        <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
                          New Category *
                        </label>
                        <input
                          type="text"
                          value={editing.customCategory}
                          onChange={(e) => setEditing({ ...editing, customCategory: e.target.value })}
                          placeholder="e.g. wedding"
                          className={inputClass}
                        />
                      </div>
                    )}
                  </div>

                  {/* Title + Price */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editing.title}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                        placeholder="Photo title"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editing.price}
                        onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                        placeholder="0 = not for sale"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      placeholder="Optional description…"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Hero + Featured toggles */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, isHero: !editing.isHero })}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                        editing.isHero
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-400"
                      }`}
                    >
                      <Home size={14} className="flex-shrink-0" />
                      <div>
                        <p className="font-body text-[10px] tracking-[0.15em] uppercase font-medium">
                          Hero Photo
                        </p>
                        <p className="font-body text-[9px] text-current opacity-50 mt-0.5">
                          Home page background
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, isFeatured: !editing.isFeatured })}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                        editing.isFeatured
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-400"
                      }`}
                    >
                      <Star size={14} className="flex-shrink-0" />
                      <div>
                        <p className="font-body text-[10px] tracking-[0.15em] uppercase font-medium">
                          Featured
                        </p>
                        <p className="font-body text-[9px] text-current opacity-50 mt-0.5">
                          Featured collection
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={saveEdit}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 text-white font-body text-xs tracking-[0.2em] uppercase py-3 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50"
                    >
                      <Check size={13} />
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="px-5 border border-neutral-200 font-body text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
        <div className="flex flex-wrap gap-2 items-center">
          {/* All tab */}
          <button
            onClick={() => setActiveCategory("all")}
            className={`font-body text-xs tracking-[0.15em] uppercase px-4 py-2 rounded-full border transition-all duration-200 ${
              activeCategory === "all"
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-400 border-neutral-200 hover:border-neutral-400"
            }`}
          >
            All ({photos.length})
          </button>

          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-1">
              {renamingCat === cat ? (
                /* Inline rename input */
                <div className="flex items-center gap-1">
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") renameCategory();
                      if (e.key === "Escape") { setRenamingCat(null); setRenameValue(""); }
                    }}
                    className="font-body text-xs border border-neutral-900 rounded-full px-3 py-1.5 w-28 focus:outline-none"
                    placeholder={capitalize(cat)}
                    disabled={renaming}
                  />
                  <button
                    onClick={renameCategory}
                    disabled={renaming}
                    className="p-1.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition-colors disabled:opacity-50"
                  >
                    <Check size={11} />
                  </button>
                  <button
                    onClick={() => { setRenamingCat(null); setRenameValue(""); }}
                    className="p-1.5 rounded-full border border-neutral-200 text-neutral-400 hover:border-neutral-400 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                /* Normal tab + rename button */
                <>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`font-body text-xs tracking-[0.15em] uppercase px-4 py-2 rounded-full border transition-all duration-200 ${
                      activeCategory === cat
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-400 border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    {capitalize(cat)} ({photos.filter((p) => p.category === cat).length})
                  </button>
                  <button
                    onClick={() => { setRenamingCat(cat); setRenameValue(cat); }}
                    className="p-1.5 rounded-full text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                    title={`Rename "${cat}"`}
                  >
                    <Pencil size={11} />
                  </button>
                </>
              )}
            </div>
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

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                  {/* Top actions */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(photo)}
                      className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deletePhoto(photo)}
                      disabled={deleting === photo.publicId}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Bottom info */}
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

                {/* Hero / Featured badges */}
                {(photo.isHero || photo.isFeatured) && (
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {photo.isHero && (
                      <span className="flex items-center gap-1 bg-neutral-900/80 text-white text-[9px] font-body tracking-widest uppercase px-2 py-0.5 rounded-full backdrop-blur-sm">
                        <Home size={8} /> Hero
                      </span>
                    )}
                    {photo.isFeatured && (
                      <span className="flex items-center gap-1 bg-neutral-900/80 text-white text-[9px] font-body tracking-widest uppercase px-2 py-0.5 rounded-full backdrop-blur-sm">
                        <Star size={8} /> Featured
                      </span>
                    )}
                  </div>
                )}

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
