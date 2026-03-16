import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Smartphone, Camera, Monitor, Aperture, Wrench } from "lucide-react";

const gearSections = [
  {
    title: "Camera",
    icon: Smartphone,
    items: [
      { name: "iPhone 15 Pro", desc: "48MP main · 12MP ultrawide · 12MP 5× telephoto" },
      { name: "ProRAW capture", desc: "Full RAW file control & dynamic range" },
      { name: "Photonic Engine", desc: "Apple's computational photography pipeline" },
    ],
  },
  {
    title: "Lenses & Optics",
    icon: Aperture,
    items: [
      { name: "Main — 24mm f/1.78", desc: "Primary wide lens, everyday shooting" },
      { name: "Ultrawide — 13mm f/2.2", desc: "Landscapes & architecture" },
      { name: "Telephoto — 120mm f/2.8", desc: "5× optical zoom, portraits & details" },
    ],
  },
  {
    title: "Video",
    icon: Camera,
    items: [
      { name: "4K ProRes 120fps", desc: "Cinema-grade video capture" },
      { name: "Log encoding", desc: "Apple Log for maximum grading latitude" },
      { name: "Action mode", desc: "Gimbal-level stabilisation" },
    ],
  },
  {
    title: "Editing Apps",
    icon: Monitor,
    items: [
      { name: "Lightroom Mobile", desc: "RAW processing & presets" },
      { name: "VSCO", desc: "Film-style colour grading" },
      { name: "Snapseed", desc: "Selective adjustments & healing" },
    ],
  },
  {
    title: "Accessories",
    icon: Wrench,
    items: [
      { name: "Moment Case", desc: "Lens-mount compatible protection" },
      { name: "Moment Anamorphic Lens", desc: "1.33× widescreen cinematic look" },
      { name: "Joby GorillaPod Mobile", desc: "Flexible mini tripod" },
    ],
  },
];

const Gear = () => (
  <div className="pt-28 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-6">
      <SectionHeading title="My Gear" subtitle="Shot entirely on iPhone 15 Pro" />

      <div className="grid gap-10 max-w-3xl mx-auto">
        {gearSections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: si * 0.08, duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-100">
              <section.icon size={16} className="text-neutral-400" />
              <h3 className="font-body text-xs tracking-[0.15em] uppercase text-neutral-500">{section.title}</h3>
            </div>
            <div>
              {section.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-4 border-b border-neutral-50 last:border-0">
                  <span className="font-display text-lg font-light">{item.name}</span>
                  <span className="font-body text-xs text-neutral-400">{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default Gear;
