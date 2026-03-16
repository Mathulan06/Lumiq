import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: { src: string; title: string }[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const LightboxModal = ({ images, currentIndex, onClose, onNext, onPrev }: LightboxProps) => {
  const img = images[currentIndex];
  if (!img) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10" aria-label="Close">
          <X size={24} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-10" aria-label="Previous">
          <ChevronLeft size={32} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-10" aria-label="Next">
          <ChevronRight size={32} />
        </button>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl max-h-[85vh] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={img.src} alt={img.title} className="max-w-full max-h-[85vh] object-contain" />
          <p className="text-center mt-4 font-display text-lg font-light text-white/70 tracking-wide">{img.title}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LightboxModal;
