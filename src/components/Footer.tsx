import { Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-neutral-100 bg-white py-10">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <Link to="/" className="font-display text-xl font-light tracking-[0.2em] text-foreground">
        Lumiq
      </Link>
      <p className="font-body text-xs text-neutral-400 tracking-wide">
        © {new Date().getFullYear()} Lumiq Photography. All rights reserved.
      </p>
      <div className="flex items-center gap-5">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-foreground transition-colors">
          <Instagram size={17} />
        </a>
        <a href="mailto:hello@lens.photo" className="text-neutral-400 hover:text-foreground transition-colors">
          <Mail size={17} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
