import { getPhotos } from "@/lib/cloudinary";
import ShopGrid from "./ShopGrid";

export const revalidate = 60;

export default async function ShopPage() {
  const photos = await getPhotos().catch(() => []);
  const printPhotos = photos.filter((p) => p.price > 0);

  return (
    <div className="pt-28 pb-32 md:pb-16 min-h-screen bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <p className="font-body text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-3">
            Fine Art Prints
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-light dark:text-white">
            The <em>Shop</em>
          </h1>
          <p className="font-body text-sm text-neutral-400 mt-3 max-w-xl">
            High-quality fine art prints, personally selected and fulfilled.
            Order via WhatsApp for a personal touch.
          </p>
        </div>

        <ShopGrid photos={printPhotos} />
      </div>
    </div>
  );
}
