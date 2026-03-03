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
    <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4">{title}</h2>
    {subtitle && <p className="text-muted-foreground text-lg max-w-xl mx-auto">{subtitle}</p>}
    <div className="w-16 h-0.5 bg-primary mx-auto mt-6" />
  </motion.div>
);

export default SectionHeading;
