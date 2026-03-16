import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import aboutPhoto from "@/assets/hero-3.jpg";

const About = () => (
  <div className="pt-28 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-6">
      <SectionHeading title="About Me" subtitle="The person behind the lens" />

      <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto items-start">
        <motion.div
          initial={{ opacity: 0, x: -32, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-lg shadow-xl"
        >
          <motion.img
            src={aboutPhoto}
            alt="Photographer portrait"
            className="w-full aspect-[3/4] object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            loading="lazy"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-7 pt-4"
        >
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-display text-3xl font-light leading-snug"
          >
            Chasing light,<br /><em>one frame at a time</em>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-body text-sm text-neutral-500 leading-relaxed"
          >
            Photography has been my language for over a decade. What began as a childhood fascination with my father's old film camera has evolved into a lifelong pursuit of visual storytelling. I believe every moment holds a story — it just takes patience, perspective, and the right light to reveal it.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="font-body text-sm text-neutral-500 leading-relaxed"
          >
            My philosophy is simple: <span className="text-foreground font-medium">light is everything.</span> It shapes mood, depth, and emotion. Whether I'm capturing the raw energy of a bustling street market or the quiet solitude of a mountain sunrise, I strive to find that perfect interplay between shadow and illumination.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="border-l-2 border-neutral-200 pl-6 mt-8"
          >
            <h4 className="font-body text-xs tracking-[0.15em] uppercase text-neutral-400 mb-4">Highlights</h4>
            <ul className="space-y-3 font-body text-sm text-neutral-500">
              {[
                "Featured in National Geographic Traveler",
                'Solo exhibition — "Chiaroscuro" at Metro Art Gallery',
                "50K+ followers across photography platforms",
                "Workshop instructor — landscape & street photography",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.65 + i * 0.08 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default About;
