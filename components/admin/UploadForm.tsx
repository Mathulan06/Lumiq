"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, ImagePlus, X } from "lucide-react";

interface Props {
  existingCategories: string[];
  onSuccess: () => void;
}

interface FileEntry {
  file: File;
  preview: string;
}

async function uploadOne(
  entry: FileEntry,
  opts: { category: string; title: string; description: string; price: string }
) {
  const sigRes = await fetch("/api/upload-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: opts.category,
      title: opts.title,
      description: opts.description,
      price: opts.price || "0",
    }),
  });
  if (!sigRes.ok) throw new Error("Failed to get upload signature");
  const sig = await sigRes.json();

  const formData = new FormData();
  formData.append("file", entry.file);
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
}

export default function UploadForm({ existingCategories, onSuccess }: Props) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const effectiveCategory = category === "__new__" ? customCategory : category;

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const valid: FileEntry[] = [];
    Array.from(incoming).forEach((f) => {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name} is not an image — skipped`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setFiles((prev) => {
          // deduplicate by name+size
          if (prev.some((x) => x.file.name === f.name && x.file.size === f.size)) return prev;
          return [...prev, { file: f, preview: e.target?.result as string }];
        });
      };
      reader.readAsDataURL(f);
      valid.push({ file: f, preview: "" }); // preview filled async above
    });
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0 || !effectiveCategory.trim()) {
      toast.error("Select at least one image and choose a category");
      return;
    }

    setUploading(true);
    setProgress({ done: 0, total: files.length });

    let failed = 0;
    for (let i = 0; i < files.length; i++) {
      try {
        await uploadOne(files[i], {
          category: effectiveCategory.trim(),
          title,
          description,
          price,
        });
        setProgress({ done: i + 1, total: files.length });
      } catch (err) {
        failed++;
        console.error(`Failed to upload ${files[i].file.name}:`, err);
      }
    }

    // Revalidate once after all uploads
    await fetch("/api/revalidate", { method: "POST" });

    if (failed === 0) {
      toast.success(
        files.length === 1
          ? "Photo uploaded!"
          : `${files.length} photos uploaded!`
      );
    } else {
      toast.error(`${failed} of ${files.length} failed — check console`);
    }

    setFiles([]);
    setCategory("");
    setCustomCategory("");
    setTitle("");
    setDescription("");
    setPrice("");
    setProgress(null);
    setUploading(false);
    onSuccess();
  }

  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-5">
      <h2 className="font-display text-2xl font-light">Upload Photos</h2>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition-colors overflow-hidden ${
          uploading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-neutral-400"
        } ${files.length > 0 ? "border-neutral-300" : "border-neutral-200"}`}
        style={{ minHeight: 180 }}
      >
        {files.length > 0 ? (
          <div className="p-3">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {files.map((entry, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.preview}
                    alt={entry.file.name}
                    className="w-full h-full object-cover"
                  />
                  {!uploading && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                    >
                      <X size={11} />
                    </button>
                  )}
                  {/* Upload progress tint */}
                  {uploading && progress && idx < progress.done && (
                    <div className="absolute inset-0 bg-neutral-900/40 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-white/80" />
                    </div>
                  )}
                </div>
              ))}
              {/* Add more button */}
              {!uploading && (
                <div
                  className="aspect-square rounded-xl border-2 border-dashed border-neutral-200 flex items-center justify-center text-neutral-300 hover:border-neutral-400 hover:text-neutral-400 transition-colors"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                >
                  <ImagePlus size={20} strokeWidth={1.5} />
                </div>
              )}
            </div>
            <p className="font-body text-xs text-neutral-400 mt-2 px-1">
              {files.length} image{files.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
            <ImagePlus size={36} strokeWidth={1} />
            <p className="font-body text-sm mt-3">Drag & drop or click to select</p>
            <p className="font-body text-xs mt-1 text-neutral-300">JPG, PNG, WEBP, HEIC · Multiple files OK</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
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
            className={inputClass}
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
              className={inputClass}
            />
          </div>
        )}
      </div>

      {/* Title + Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
            Title <span className="normal-case tracking-normal">(applies to all)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Photo title"
            className={inputClass}
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
            className={inputClass}
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
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={uploading || files.length === 0 || !effectiveCategory.trim()}
        className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white font-body text-xs tracking-[0.25em] uppercase py-3.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload size={14} />
        {uploading && progress
          ? `Uploading ${progress.done} / ${progress.total}…`
          : `Upload ${files.length > 1 ? `${files.length} Photos` : "Photo"}`}
      </button>
    </form>
  );
}
