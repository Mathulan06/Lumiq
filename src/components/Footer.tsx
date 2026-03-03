import { Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-background py-12">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <Link to="/" className="font-display text-lg font-bold tracking-wider text-gradient">
        LENS
      </Link>
      <p className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} LENS Photography. All rights reserved.
      </p>
      <div className="flex items-center gap-4">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
          <Instagram size={20} />
        </a>
        <a href="mailto:hello@lens.photo" className="text-muted-foreground hover:text-primary transition-colors">
          <Mail size={20} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
