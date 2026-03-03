import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Camera, Aperture, Plane, Monitor, Wrench } from "lucide-react";

const gearSections = [
  {
    title: "Camera Bodies",
    icon: Camera,
    items: [
      { name: "Sony A7 IV", desc: "Full-frame mirrorless, 33MP" },
      { name: "Canon EOS R6 Mark II", desc: "Hybrid photo/video workhorse" },
      { name: "Fujifilm X-T5", desc: "APS-C film simulation master" },
    ],
  },
  {
    title: "Lenses",
    icon: Aperture,
    items: [
      { name: "Sony 24-70mm f/2.8 GM II", desc: "Zoom — versatile everyday" },
      { name: "Sony 85mm f/1.4 GM", desc: "Prime — portrait king" },
      { name: "Sony 16-35mm f/2.8 GM", desc: "Wide zoom — landscapes" },
      { name: "Sony 50mm f/1.2 GM", desc: "Prime — low light beast" },
    ],
  },
  {
    title: "Drone",
    icon: Plane,
    items: [
      { name: "DJI Mavic 3 Pro", desc: "Triple-lens aerial photography" },
    ],
  },
  {
    title: "Editing Software",
    icon: Monitor,
    items: [
      { name: "Adobe Lightroom Classic", desc: "RAW processing & color grading" },
      { name: "Adobe Photoshop", desc: "Compositing & retouching" },
      { name: "DaVinci Resolve", desc: "Video editing & color" },
    ],
  },
  {
    title: "Accessories",
    icon: Wrench,
    items: [
      { name: "Peak Design Travel Tripod", desc: "Carbon fiber, ultra compact" },
      { name: "NiSi Filters", desc: "ND & polarizer system" },
      { name: "Godox V1 Flash", desc: "Round-head TTL speedlight" },
    ],
  },
];

const Gear = () => (
  <div className="pt-24 pb-20 bg-cinema-gradient min-h-screen">
    <div className="container mx-auto px-6">
      <SectionHeading title="My Gear" subtitle="The tools behind the images" />

      <div className="grid gap-8 max-w-4xl mx-auto">
        {gearSections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: si * 0.1, duration: 0.5 }}
            className="bg-card/60 backdrop-blur border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <section.icon className="text-primary" size={22} />
              <h3 className="font-display text-lg font-semibold tracking-wide">{section.title}</h3>
            </div>
            <div className="grid gap-3">
              {section.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">{item.desc}</span>
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
