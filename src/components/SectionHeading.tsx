import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ title, subtitle }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16"
  >
    <h2 className="font-display text-4xl md:text-6xl font-light tracking-wide mb-4">{title}</h2>
    {subtitle && <p className="font-body text-sm text-neutral-400 tracking-[0.1em] uppercase max-w-xl mx-auto">{subtitle}</p>}
    <div className="w-8 h-px bg-neutral-300 mx-auto mt-6" />
  </motion.div>
);

export default SectionHeading;
