"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Images, ShoppingBag, User, Mail } from "lucide-react";

const links = [
  { to: "/",        label: "Home",    icon: Home        },
  { to: "/gallery", label: "Gallery", icon: Images      },
  { to: "/shop",    label: "Shop",    icon: ShoppingBag },
  { to: "/about",   label: "About",   icon: User        },
  { to: "/contact", label: "Contact", icon: Mail        },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* Desktop: floating pill */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 z-50 justify-center pt-4 px-4">
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
            href="/"
            className="font-display text-xl font-light tracking-[0.2em] text-neutral-900 px-4 py-1"
          >
            Lumiq
          </Link>

          <div className="flex items-center gap-0.5">
            {links.map((l) => (
              <Link key={l.to} href={l.to} className="relative px-4 py-1.5">
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
        </motion.nav>
      </div>

      {/* Mobile: bottom tab bar */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-100 shadow-[0_-4px_24px_rgba(0,0,0,0.07)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                href={l.to}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 relative"
              >
                <AnimatePresence>
                  {active && (
                    <motion.span
                      layoutId="bottom-dot"
                      className="absolute top-1.5 w-1 h-1 rounded-full bg-neutral-900"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                    />
                  )}
                </AnimatePresence>
                <motion.div animate={{ scale: active ? 1.1 : 1 }} transition={{ duration: 0.2 }}>
                  <l.icon
                    size={20}
                    strokeWidth={active ? 2 : 1.5}
                    className={`transition-colors duration-200 ${active ? "text-neutral-900" : "text-neutral-400"}`}
                  />
                </motion.div>
                <span
                  className={`font-body text-[9px] tracking-[0.12em] uppercase transition-colors duration-200 ${
                    active ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {l.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
