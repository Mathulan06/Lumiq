import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroSlider from "@/components/HeroSlider";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import galleryLandscape from "@/assets/gallery-landscape-1.jpg";
import galleryStreet from "@/assets/gallery-street-1.jpg";
import galleryPortrait from "@/assets/gallery-portrait-1.jpg";

const featured = [
  { src: galleryLandscape, title: "Golden Valley", category: "Landscape" },
  { src: galleryStreet, title: "City Pulse", category: "Street" },
  { src: galleryPortrait, title: "Amber Light", category: "Portrait" },
];

const Index = () => (
  <div>
    {/* Hero */}
    <div className="relative">
      <HeroSlider />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-display text-sm md:text-base tracking-[0.3em] uppercase text-primary mb-4"
        >
          Photography Portfolio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-display text-4xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Capturing Light.
          <br />
          <span className="text-gradient">Telling Stories.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-muted-foreground text-lg md:text-xl max-w-lg mb-8"
        >
          A passionate photographer dedicated to finding beauty in every frame,
          from sweeping landscapes to intimate portraits.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex gap-4"
        >
          <Button asChild size="lg" className="font-display tracking-wider">
            <Link to="/gallery">View Gallery</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-display tracking-wider border-primary/30 text-foreground hover:bg-primary/10">
            <Link to="/contact">Contact Me</Link>
          </Button>
        </motion.div>
      </div>
    </div>

    {/* Featured Works */}
    <section className="py-24 bg-cinema-gradient">
      <div className="container mx-auto px-6">
        <SectionHeading title="Featured Works" subtitle="A curated selection of my recent photography" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg image-watermark"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <p className="text-xs uppercase tracking-widest text-primary font-display">{item.category}</p>
                <p className="font-display text-xl font-semibold mt-1">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="font-display tracking-wider border-primary/30 text-foreground hover:bg-primary/10">
            <Link to="/gallery">Explore Full Gallery →</Link>
          </Button>
        </div>
      </div>
    </section>
  </div>
);

export default Index;
