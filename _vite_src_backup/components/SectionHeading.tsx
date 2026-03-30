import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ title, subtitle }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="text-center mb-16"
  >
    <h2 className="font-display text-4xl md:text-6xl font-light tracking-wide mb-4">{title}</h2>
    {subtitle && (
      <p className="font-body text-sm text-neutral-400 tracking-[0.1em] uppercase max-w-xl mx-auto">
        {subtitle}
      </p>
    )}
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      className="w-12 h-px bg-neutral-300 mx-auto mt-6 origin-center"
    />
  </motion.div>
);

export default SectionHeading;
