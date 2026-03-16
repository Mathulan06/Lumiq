import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import aboutPhoto from "@/assets/hero-3.jpg";

const About = () => (
  <div className="pt-24 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-6">
      <SectionHeading title="About Me" subtitle="The person behind the lens" />

      <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto items-start">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden"
        >
          <img src={aboutPhoto} alt="Photographer portrait" className="w-full aspect-[3/4] object-cover" loading="lazy" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-7 pt-4"
        >
          <h3 className="font-display text-3xl font-light leading-snug">
            Chasing light,<br /><em>one frame at a time</em>
          </h3>
          <p className="font-body text-sm text-neutral-500 leading-relaxed">
            Photography has been my language for over a decade. What began as a childhood fascination with my father's old film camera has evolved into a lifelong pursuit of visual storytelling. I believe every moment holds a story — it just takes patience, perspective, and the right light to reveal it.
          </p>
          <p className="font-body text-sm text-neutral-500 leading-relaxed">
            My philosophy is simple: <span className="text-foreground font-medium">light is everything.</span> It shapes mood, depth, and emotion. Whether I'm capturing the raw energy of a bustling street market or the quiet solitude of a mountain sunrise, I strive to find that perfect interplay between shadow and illumination.
          </p>

          <div className="border-l border-neutral-200 pl-6 mt-8">
            <h4 className="font-body text-xs tracking-[0.15em] uppercase text-neutral-400 mb-4">Highlights</h4>
            <ul className="space-y-3 font-body text-sm text-neutral-500">
              <li>Featured in National Geographic Traveler</li>
              <li>Solo exhibition — "Chiaroscuro" at Metro Art Gallery</li>
              <li>50K+ followers across photography platforms</li>
              <li>Workshop instructor — landscape & street photography</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default About;
