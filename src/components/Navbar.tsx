import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/gear", label: "My Gear" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 px-4">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`flex items-center justify-between w-full max-w-2xl rounded-full px-3 py-2 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-xl shadow-black/8 border border-neutral-100"
            : "bg-white/85 backdrop-blur-sm shadow-lg shadow-black/5 border border-white/60"
        }`}
      >
        <Link
          to="/"
          className="font-display text-xl font-light tracking-[0.2em] text-foreground px-4 py-1"
        >
          Lumiq
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="relative px-4 py-1.5">
              {pathname === l.to && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-neutral-900"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                />
              )}
              <span
                className={`relative z-10 font-body text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${
                  pathname === l.to
                    ? "text-white"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                {l.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground p-2 rounded-full hover:bg-neutral-100 transition-colors mr-1"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-2 w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden"
          >
            <div className="flex flex-col p-3 gap-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`block font-body text-sm tracking-[0.15em] uppercase px-6 py-3 rounded-2xl text-center transition-all duration-200 ${
                      pathname === l.to
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-400 hover:text-foreground hover:bg-neutral-50"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
