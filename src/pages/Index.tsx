import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroSlider from "@/components/HeroSlider";
import SectionHeading from "@/components/SectionHeading";

// Dynamically pick one photo per available category for featured section
const landscapeModules = import.meta.glob(
  "../assets/my-photos/landscape/*.{jpg,jpeg,png,webp}", { eager: true }
) as Record<string, { default: string }>;

const portraitModules = import.meta.glob(
  "../assets/my-photos/portrait/*.{jpg,jpeg,png,webp}", { eager: true }
) as Record<string, { default: string }>;

const natureModules = import.meta.glob(
  "../assets/my-photos/nature/*.{jpg,jpeg,png,webp}", { eager: true }
) as Record<string, { default: string }>;

const streetModules = import.meta.glob(
  "../assets/my-photos/street/*.{jpg,jpeg,png,webp}", { eager: true }
) as Record<string, { default: string }>;

function firstOf(modules: Record<string, { default: string }>) {
  const vals = Object.values(modules);
  return vals.length > 0 ? vals[0].default : null;
}

const candidates = [
  { src: firstOf(landscapeModules), category: "Landscape", title: "Landscape" },
  { src: firstOf(portraitModules),  category: "Portrait",  title: "Portrait"  },
  { src: firstOf(natureModules),    category: "Nature",    title: "Nature"    },
  { src: firstOf(streetModules),    category: "Street",    title: "Street"    },
].filter((f) => f.src !== null) as { src: string; category: string; title: string }[];

const featured = candidates.slice(0, 3);

const Index = () => (
  <div>
    {/* Hero */}
    <div className="relative">
      <HeroSlider />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-body text-xs tracking-[0.35em] uppercase text-white/70 mb-6"
        >
          Photography Portfolio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="font-display text-5xl md:text-8xl font-light tracking-wide text-white mb-6 leading-none"
        >
          Capturing Light.
          <br />
          <span className="italic">Telling Stories.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="font-body text-sm text-white/60 max-w-md mb-10 leading-relaxed tracking-wide"
        >
          A passionate photographer dedicated to finding beauty in every frame,
          from sweeping landscapes to intimate portraits.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex gap-6"
        >
          <Link to="/gallery" className="font-body text-xs tracking-[0.2em] uppercase text-white border border-white/50 px-8 py-3 hover:bg-white hover:text-black transition-all duration-300">
            View Gallery
          </Link>
          <Link to="/contact" className="font-body text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors duration-300">
            Contact Me →
          </Link>
        </motion.div>
      </div>
    </div>

    {/* Featured Works */}
    {featured.length > 0 && (
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <SectionHeading title="Featured Works" subtitle="A curated selection from the collection" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((item, i) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="group relative aspect-[4/5] overflow-hidden cursor-pointer rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-500"
              >
                <motion.img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <motion.div
                    initial={false}
                    className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400"
                  >
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-white/70">{item.category}</p>
                    <p className="font-display text-2xl font-light text-white mt-1">{item.title}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link to="/gallery" className="font-body text-xs tracking-[0.2em] uppercase text-foreground border-b border-foreground pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors duration-200">
              Explore Full Gallery
            </Link>
          </div>
        </div>
      </section>
    )}

    {/* Quote strip */}
    <section className="py-24 bg-neutral-50 border-t border-neutral-100">
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-2xl md:text-4xl font-light leading-relaxed text-foreground"
        >
          "Light is everything. It shapes mood, depth, and emotion — and I spend my life chasing it."
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8"
        >
          <Link to="/about" className="font-body text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-foreground transition-colors duration-200">
            Learn More About Me →
          </Link>
        </motion.div>
      </div>
    </section>
  </div>
);

export default Index;
