import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import aboutPhoto from "@/assets/hero-3.jpg";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const About = () => (
  <div className="bg-white min-h-screen">

    {/* ── Header ────────────────────────────────────────────── */}
    <div className="pt-28 pb-16 container mx-auto px-6 md:px-10">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-body text-[10px] tracking-[0.4em] uppercase text-neutral-400 mb-4"
      >
        The person behind the lens
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-6xl md:text-8xl font-light leading-none"
      >
        About Me
      </motion.h1>
    </div>

    {/* ── Photo + Text ──────────────────────────────────────── */}
    <div className="container mx-auto px-6 md:px-10">
      <div className="grid md:grid-cols-5 gap-8 md:gap-16 items-start">

        {/* Photo — takes 3/5 width */}
        <motion.div
          {...fadeUp()}
          className="md:col-span-3 overflow-hidden rounded-2xl shadow-2xl"
        >
          <motion.img
            src={aboutPhoto}
            alt="Photographer"
            className="w-full object-cover"
            style={{ maxHeight: "80vh" }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>

        {/* Text — takes 2/5 width */}
        <div className="md:col-span-2 space-y-8 md:pt-10 md:sticky md:top-28">

          <motion.h2
            {...fadeUp(0.15)}
            className="font-display text-4xl md:text-5xl font-light leading-snug"
          >
            Chasing light,<br />
            <em>one frame at a time.</em>
          </motion.h2>

          <motion.div {...fadeUp(0.25)} className="w-10 h-px bg-neutral-200" />

          <motion.p {...fadeUp(0.3)} className="font-body text-sm text-neutral-500 leading-loose">
            Photography has been my language for over a decade. What began as a childhood
            fascination with my father's old film camera has evolved into a lifelong pursuit
            of visual storytelling. I believe every moment holds a story — it just takes
            patience, perspective, and the right light to reveal it.
          </motion.p>

          <motion.p {...fadeUp(0.38)} className="font-body text-sm text-neutral-500 leading-loose">
            My philosophy is simple:{" "}
            <span className="text-neutral-900 font-medium">light is everything.</span>{" "}
            It shapes mood, depth, and emotion. Whether capturing the raw energy of a
            bustling street market or the quiet solitude of a mountain sunrise, I strive
            to find that perfect interplay between shadow and illumination.
          </motion.p>

          {/* Pull quote */}
          <motion.blockquote
            {...fadeUp(0.46)}
            className="border-l-2 border-neutral-900 pl-5 py-1"
          >
            <p className="font-display text-xl font-light italic leading-relaxed text-neutral-700">
              "Every frame is a decision — what to include, what to leave out, and where
              the light falls."
            </p>
          </motion.blockquote>

          {/* Tags */}
          <motion.div {...fadeUp(0.54)} className="flex flex-wrap gap-2 pt-2">
            {["Landscape", "Nature", "Street", "iPhone Photography"].map((tag) => (
              <span
                key={tag}
                className="font-body text-[10px] tracking-[0.15em] uppercase px-4 py-1.5 rounded-full bg-neutral-100 text-neutral-500"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeUp(0.62)} className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 font-body text-xs tracking-[0.2em] uppercase bg-neutral-900 text-white px-7 py-3.5 rounded-full hover:bg-neutral-700 transition-all duration-300 hover:gap-4"
            >
              Get in Touch <span>→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>

    {/* ── Bottom spacer ─────────────────────────────────────── */}
    <div className="pb-24" />
  </div>
);

export default About;
