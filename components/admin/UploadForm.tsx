"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, ImagePlus, X } from "lucide-react";

interface Props {
  existingCategories: string[];
  onSuccess: () => void;
}

export default function UploadForm({ existingCategories, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const effectiveCategory = category === "__new__" ? customCategory : category;

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !effectiveCategory.trim()) {
      toast.error("Image and category are required");
      return;
    }

    setUploading(true);

    try {
      // Step 1: get a signed upload URL from our server (keeps API secret safe)
      const sigRes = await fetch("/api/upload-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: effectiveCategory.trim(),
          title,
          description,
          price: price || "0",
        }),
      });
      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const sig = await sigRes.json();

      // Step 2: upload the file directly to Cloudinary (bypasses Vercel size limits)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", sig.signature);
      formData.append("timestamp", sig.timestamp);
      formData.append("api_key", sig.apiKey);
      formData.append("folder", "lumiq");
      formData.append("tags", sig.tags);
      formData.append("context", sig.context);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      if (!uploadRes.ok) {
        const errBody = await uploadRes.json().catch(() => ({}));
        throw new Error(errBody?.error?.message ?? "Cloudinary upload failed");
      }
      toast.success("Photo uploaded successfully!");
      // Reset form
      setFile(null);
      setPreview(null);
      setCategory("");
      setCustomCategory("");
      setTitle("");
      setDescription("");
      setPrice("");
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-5">
      <h2 className="font-display text-2xl font-light">Upload Photo</h2>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-neutral-200 rounded-2xl cursor-pointer hover:border-neutral-400 transition-colors overflow-hidden"
        style={{ minHeight: 180 }}
      >
        {preview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full max-h-64 object-contain" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
            <ImagePlus size={36} strokeWidth={1} />
            <p className="font-body text-sm mt-3">Drag & drop or click to select</p>
            <p className="font-body text-xs mt-1 text-neutral-300">JPG, PNG, WEBP, HEIC</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {/* Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          >
            <option value="">Select category…</option>
            {existingCategories.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
            <option value="__new__">+ Add new category</option>
          </select>
        </div>

        {category === "__new__" && (
          <div>
            <label className="block font-body text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
              New Category Name *
            </label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              required
              placeholder="e.g. wedding"
              className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        )}
      </div>

      {/* Title + Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Photo title"
            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <div>
          <label className="block font-body text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
            Print Price ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0 = not for sale"
            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block font-body text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Optional description…"
          className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={uploading || !file || !effectiveCategory.trim()}
        className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white font-body text-xs tracking-[0.25em] uppercase py-3.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload size={14} />
        {uploading ? "Uploading…" : "Upload Photo"}
      </button>
    </form>
  );
}
