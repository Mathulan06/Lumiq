import { Instagram, Mail, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-neutral-100 bg-white py-10">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <Link to="/" className="font-display text-xl font-light tracking-[0.2em] text-foreground">
        Lumiq
      </Link>
      <p className="font-body text-xs text-neutral-400 tracking-wide">
        © {new Date().getFullYear()} Mathulan Shanmugam. All rights reserved.
      </p>
      <div className="flex items-center gap-5">
        <a
          href="https://www.instagram.com/mathulan.s"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 hover:text-foreground transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={17} />
        </a>
        <a
          href="https://web.facebook.com/mtahh15"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 hover:text-foreground transition-colors"
          aria-label="Facebook"
        >
          <Facebook size={17} />
        </a>
        <a
          href="mailto:mathulanshanmugam@gmail.com"
          className="text-neutral-400 hover:text-foreground transition-colors"
          aria-label="Email"
        >
          <Mail size={17} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
