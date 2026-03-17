import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";

/* ── Dynamic image discovery ─────────────────────────────────── */
const landscapeModules = import.meta.glob(
  "../assets/my-photos/landscape/*.{jpg,jpeg,png,webp}", { eager: true }
) as Record<string, { default: string }>;

const natureModules = import.meta.glob(
  "../assets/my-photos/nature/*.{jpg,jpeg,png,webp}", { eager: true }
) as Record<string, { default: string }>;

const streetModules = import.meta.glob(
  "../assets/my-photos/street/*.{jpg,jpeg,png,webp}", { eager: true }
) as Record<string, { default: string }>;

function pick(modules: Record<string, { default: string }>, ...indices: number[]) {
  const all = Object.values(modules).map((m) => m.default);
  return indices.map((i) => all[i]).filter(Boolean) as string[];
}

/* ── Curated shop items ───────────────────────────────────────── */
const ALL_ITEMS = [
  { src: pick(landscapeModules, 0)[0], category: "Landscape", title: "Golden Horizon" },
  { src: pick(natureModules,    0)[0], category: "Nature",    title: "Into the Wild"  },
  { src: pick(streetModules,    0)[0], category: "Street",    title: "City Soul"       },
  { src: pick(landscapeModules, 1)[0], category: "Landscape", title: "Mountain Mist"  },
  { src: pick(natureModules,    1)[0], category: "Nature",    title: "Wild Bloom"      },
  { src: pick(streetModules,    1)[0], category: "Street",    title: "Rainy Walk"      },
  { src: pick(landscapeModules, 2)[0], category: "Landscape", title: "Open Skies"      },
  { src: pick(natureModules,    2)[0], category: "Nature",    title: "Morning Dew"     },
  { src: pick(landscapeModules, 3)[0], category: "Landscape", title: "Amber Dusk"      },
].filter((item) => item.src) as { src: string; category: string; title: string }[];

/* ── Print size options ───────────────────────────────────────── */
const SIZES = [
  { label: "Digital Download", detail: "Full resolution JPEG · Instant delivery", price: 15 },
  { label: "Small Print",      detail: '8" × 10" · Giclée archival paper',         price: 25 },
  { label: "Medium Print",     detail: '12" × 16" · Giclée archival paper',        price: 45 },
  { label: "Large Print",      detail: '16" × 20" · Giclée archival paper',        price: 75 },
];

const TABS = ["All", "Landscape", "Nature", "Street"];

type Item = (typeof ALL_ITEMS)[number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/* ── Component ────────────────────────────────────────────────── */
const Shop = () => {
  const [activeTab, setActiveTab]       = useState("All");
  const [selected, setSelected]         = useState<Item | null>(null);
  const [selectedSize, setSelectedSize] = useState(0);

  const displayed =
    activeTab === "All"
      ? ALL_ITEMS
      : ALL_ITEMS.filter((i) => i.category === activeTab);

  /* Close modal on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openModal = (item: Item) => {
    setSelected(item);
    setSelectedSize(0);
  };

  const handleOrder = () => {
    if (!selected) return;
    const size = SIZES[selectedSize];
    const text = encodeURIComponent(
      `Hi Mathulan! I'd like to order a print.\n\nPhoto: "${selected.title}" (${selected.category})\nSize: ${size.label} — ${size.detail}\nPrice: $${size.price}\n\nPlease let me know how to proceed!`
    );
    window.open(`https://wa.me/94774988686?text=${text}`, "_blank");
  };

  return (
    <div className="bg-white min-h-screen">

      {/* ══ HEADER ═════════════════════════════════════════════════ */}
      <div className="pt-28 pb-16 container mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-body text-[10px] tracking-[0.4em] uppercase text-neutral-400 mb-4"
        >
          Prints &amp; Digital Downloads
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-6xl md:text-8xl font-light leading-none"
        >
          Shop
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-body text-sm text-neutral-400 mt-5 max-w-md leading-relaxed"
        >
          Own a piece of light. Every print is produced on archival giclée paper
          and shipped worldwide. Digital downloads are delivered instantly.
        </motion.p>
      </div>

      {/* ══ FILTER TABS ════════════════════════════════════════════ */}
      <div className="container mx-auto px-6 md:px-10 mb-10">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-body text-xs tracking-[0.2em] uppercase px-5 py-2 rounded-full transition-all duration-300 ${
                activeTab === tab
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ══ PHOTO GRID ═════════════════════════════════════════════ */}
      <div className="container mx-auto px-6 md:px-10 pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((item, i) => (
            <motion.div
              key={item.src}
              {...fadeUp(i * 0.06)}
              className="group cursor-pointer"
              onClick={() => openModal(item)}
            >
              {/* Image card */}
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4 bg-neutral-100">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-400 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-black rounded-full px-6 py-2.5 font-body text-xs tracking-[0.2em] uppercase flex items-center gap-2 shadow-lg">
                    <ShoppingBag size={12} />
                    Buy Print
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg font-light">{item.title}</p>
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-neutral-400 mt-0.5">
                    {item.category}
                  </p>
                </div>
                <p className="font-body text-sm text-neutral-400 mt-1">From $15</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══ PURCHASE MODAL ═════════════════════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelected(null)}
            />

            {/* Centering wrapper */}
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl pointer-events-auto"
            >
              <div className="flex flex-col md:flex-row max-h-[85vh] overflow-y-auto">

                {/* Photo preview */}
                <div className="md:w-[42%] flex-shrink-0">
                  <img
                    src={selected.src}
                    alt={selected.title}
                    className="w-full h-56 md:h-full object-cover"
                  />
                </div>

                {/* Details panel */}
                <div className="flex-1 p-7 flex flex-col">
                  {/* Title + close */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="font-body text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-1">
                        {selected.category}
                      </p>
                      <h3 className="font-display text-2xl font-light">{selected.title}</h3>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="text-neutral-400 hover:text-neutral-900 transition-colors p-1"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Size selector */}
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-3">
                    Choose format
                  </p>
                  <div className="space-y-2 mb-7">
                    {SIZES.map((size, i) => (
                      <button
                        key={size.label}
                        onClick={() => setSelectedSize(i)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-left ${
                          selectedSize === i
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-100 hover:border-neutral-300"
                        }`}
                      >
                        <div>
                          <p className="font-body text-sm">{size.label}</p>
                          <p
                            className={`font-body text-[10px] tracking-wide mt-0.5 ${
                              selectedSize === i ? "text-white/50" : "text-neutral-400"
                            }`}
                          >
                            {size.detail}
                          </p>
                        </div>
                        <p className="font-body text-sm font-medium ml-4">${size.price}</p>
                      </button>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleOrder}
                    className="w-full font-body text-xs tracking-[0.25em] uppercase bg-neutral-900 text-white py-4 rounded-full hover:bg-neutral-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={13} />
                    Order via WhatsApp — ${SIZES[selectedSize].price}
                  </button>
                  <p className="font-body text-[10px] text-neutral-400 text-center mt-3">
                    Worldwide shipping · Archival quality · Secure payment
                  </p>
                </div>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Shop;
