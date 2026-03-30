import { v2 as cloudinary } from "cloudinary";
import type { Photo } from "./types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/** Build an optimised Cloudinary URL */
export function buildUrl(
  publicId: string,
  opts: { width?: number; height?: number; quality?: string | number } = {}
) {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: opts.quality ?? "auto",
    width: opts.width,
    height: opts.height,
    crop: opts.width || opts.height ? "limit" : undefined,
    secure: true,
  });
}

/** Map a raw Cloudinary resource to our Photo type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPhoto(r: any): Photo {
  const tags: string[] = r.tags ?? [];
  return {
    id: r.asset_id,
    publicId: r.public_id,
    url: buildUrl(r.public_id),
    thumbnailUrl: buildUrl(r.public_id, { width: 900 }),
    // category = first non-special tag
    category: tags.find((t) => !t.startsWith("_")) ?? "uncategorized",
    title: r.context?.custom?.title ?? r.context?.title ?? "",
    description: r.context?.custom?.description ?? r.context?.description ?? "",
    price: parseFloat(r.context?.custom?.price ?? r.context?.price ?? "0"),
    createdAt: r.created_at,
    isHero: tags.includes("_hero"),
    isFeatured: tags.includes("_featured"),
  };
}

/** Fetch photos, optionally filtered by category tag */
export async function getPhotos(category?: string): Promise<Photo[]> {
  const expr = category
    ? `tags=${category} AND folder=lumiq`
    : `folder=lumiq`;

  const result = await cloudinary.search
    .expression(expr)
    .with_field("context")
    .with_field("tags")
    .sort_by("created_at", "desc")
    .max_results(200)
    .execute();

  return (result.resources ?? []).map(toPhoto);
}

/** Return hero photos (tag: _hero), up to 3 */
export async function getHeroPhotos(): Promise<Photo[]> {
  const result = await cloudinary.search
    .expression("tags=_hero AND folder=lumiq")
    .with_field("context")
    .with_field("tags")
    .sort_by("created_at", "desc")
    .max_results(3)
    .execute();

  return (result.resources ?? []).map(toPhoto);
}

/** Return featured photos (tag: _featured) */
export async function getFeaturedPhotos(): Promise<Photo[]> {
  const result = await cloudinary.search
    .expression("tags=_featured AND folder=lumiq")
    .with_field("context")
    .with_field("tags")
    .sort_by("created_at", "desc")
    .max_results(20)
    .execute();

  return (result.resources ?? []).map(toPhoto);
}

/** Return all unique category tags (excludes internal _tags) */
export async function getCategories(): Promise<string[]> {
  const result = await cloudinary.search
    .expression("folder=lumiq")
    .with_field("tags")
    .max_results(500)
    .execute();

  const set = new Set<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (result.resources ?? []).forEach((r: any) =>
    (r.tags ?? []).forEach((t: string) => {
      if (!t.startsWith("_")) set.add(t);
    })
  );
  return Array.from(set).sort();
}

/** Upload a file buffer to Cloudinary with metadata */
export function uploadPhoto(
  buffer: Buffer,
  opts: { category: string; title: string; description: string; price: number }
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "lumiq",
          tags: [opts.category.toLowerCase().trim()],
          context: `title=${opts.title}|description=${opts.description}|price=${opts.price}`,
        },
        (err, result) => (err ? reject(err) : resolve(result))
      )
      .end(buffer);
  });
}

/** Delete a photo by public_id */
export function deletePhoto(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
