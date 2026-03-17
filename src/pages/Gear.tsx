import { motion } from "framer-motion";
import { Smartphone, Aperture, Camera, Monitor, Wrench } from "lucide-react";

const gearSections = [
  {
    icon: Smartphone,
    title: "Camera",
    items: [
      { name: "iPhone 15 Pro", desc: "48MP main · 12MP ultrawide · 12MP 5× telephoto" },
      { name: "ProRAW Capture", desc: "Full RAW file control & dynamic range" },
      { name: "Photonic Engine", desc: "Apple's computational photography pipeline" },
    ],
  },
  {
    icon: Aperture,
    title: "Lenses & Optics",
    items: [
      { name: "Main — 24mm f/1.78", desc: "Primary wide lens, everyday shooting" },
      { name: "Ultrawide — 13mm f/2.2", desc: "Landscapes & architecture" },
      { name: "Telephoto — 120mm f/2.8", desc: "5× optical zoom, portraits & details" },
    ],
  },
  {
    icon: Camera,
    title: "Video",
    items: [
      { name: "4K ProRes 120fps", desc: "Cinema-grade video capture" },
      { name: "Log Encoding", desc: "Apple Log for maximum grading latitude" },
      { name: "Action Mode", desc: "Gimbal-level stabilisation" },
    ],
  },
  {
    icon: Monitor,
    title: "Editing Apps",
    items: [
      { name: "Lightroom Mobile", desc: "RAW processing & presets" },
      { name: "VSCO", desc: "Film-style colour grading" },
      { name: "Snapseed", desc: "Selective adjustments & healing" },
    ],
  },
  {
    icon: Wrench,
    title: "Accessories",
    items: [
      { name: "Moment Case", desc: "Lens-mount compatible protection" },
      { name: "Moment Anamorphic Lens", desc: "1.33× widescreen cinematic look" },
      { name: "Joby GorillaPod Mobile", desc: "Flexible mini tripod" },
    ],
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const Gear = () => (
  <div className="bg-white min-h-screen">

    {/* ── Header ────────────────────────────────────────────── */}
    <div className="pt-28 pb-16 container mx-auto px-6 md:px-10">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-body text-[10px] tracking-[0.4em] uppercase text-neutral-400 mb-4"
      >
        Tools of the craft
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-6xl md:text-8xl font-light leading-none"
      >
        My Gear
      </motion.h1>
    </div>

    {/* ── Hero device card ──────────────────────────────────── */}
    <div className="container mx-auto px-6 md:px-10 mb-16">
      <motion.div
        {...fadeUp()}
        className="relative bg-neutral-900 rounded-3xl px-10 py-14 md:px-20 md:py-20 overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4">
              Primary device
            </p>
            <h2 className="font-display text-5xl md:text-7xl font-light text-white leading-none mb-4">
              iPhone 15 Pro
            </h2>
            <p className="font-body text-sm text-white/50 max-w-sm leading-relaxed">
              Every photo in this portfolio was captured on a single device —
              proof that the best camera is the one you have with you.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            {["48MP Main Camera", "ProRAW + ProRes", "Titanium Build"].map((feat) => (
              <span
                key={feat}
                className="font-body text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-full border border-white/15 text-white/50 w-fit"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>

    {/* ── Gear sections grid ────────────────────────────────── */}
    <div className="container mx-auto px-6 md:px-10 pb-24">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {gearSections.map((section, si) => (
          <motion.div
            key={section.title}
            {...fadeUp(si * 0.08)}
            className="bg-neutral-50 rounded-2xl p-7 hover:bg-neutral-100 transition-colors duration-300"
          >
            {/* Card header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                <section.icon size={15} className="text-neutral-600" />
              </div>
              <h3 className="font-body text-xs tracking-[0.18em] uppercase text-neutral-500 font-medium">
                {section.title}
              </h3>
            </div>

            {/* Items */}
            <div className="space-y-1">
              {section.items.map((item, ii) => (
                <motion.div
                  key={item.name}
                  {...fadeUp(si * 0.08 + ii * 0.05)}
                  className="py-3 border-b border-neutral-200 last:border-0"
                >
                  <p className="font-display text-lg font-light text-neutral-900 mb-0.5">
                    {item.name}
                  </p>
                  <p className="font-body text-xs text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>

  </div>
);

export default Gear;
