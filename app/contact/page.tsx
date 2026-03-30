"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Instagram, Phone, MapPin, Facebook } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const inputClass =
  "w-full font-body text-sm border-0 border-b border-neutral-200 bg-transparent py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors duration-200";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-white min-h-screen">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="pt-28 pb-16 container mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-body text-[10px] tracking-[0.4em] uppercase text-neutral-400 mb-4"
        >
          Let&apos;s create something together
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-6xl md:text-8xl font-light leading-none"
        >
          Contact
        </motion.h1>
      </div>

      <div className="container mx-auto px-6 md:px-10 pb-32 md:pb-24">
        <div className="grid md:grid-cols-5 gap-10 md:gap-20">

          {/* ── Left: Info ──────────────────────────────────── */}
          <div className="md:col-span-2 space-y-10">

            {/* Identity card */}
            <motion.div
              {...fadeUp(0.05)}
              className="bg-neutral-900 rounded-2xl p-8 text-white"
            >
              <p className="font-body text-[10px] tracking-[0.35em] uppercase text-white/30 mb-5">
                About the photographer
              </p>
              <h2 className="font-display text-3xl font-light mb-1">Mathulan Shanmugam</h2>
              <p className="font-body text-xs text-white/40 tracking-wide mb-6">
                Computer Science &amp; Engineering Undergraduate
              </p>
              <div className="w-8 h-px bg-white/20 mb-6" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin size={13} className="text-white/30 flex-shrink-0" />
                  <span className="font-body text-sm text-white/50">Colombo, Sri Lanka</span>
                </div>
              </div>
            </motion.div>

            {/* Contact links */}
            <motion.div {...fadeUp(0.12)} className="space-y-1">
              <p className="font-body text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-5">
                Reach out
              </p>

              {[
                {
                  icon: Mail,
                  label: "mathulanshanmugam@gmail.com",
                  href: "mailto:mathulanshanmugam@gmail.com",
                },
                {
                  icon: Phone,
                  label: "+94 77 498 8686",
                  href: "tel:+94774988686",
                },
                {
                  icon: Instagram,
                  label: "@mathulan.s",
                  href: "https://www.instagram.com/mathulan.s",
                  external: true,
                },
                {
                  icon: Facebook,
                  label: "Mathulan on Facebook",
                  href: "https://web.facebook.com/mtahh15",
                  external: true,
                },
              ].map(({ icon: Icon, label, href, external }, i) => (
                <motion.a
                  key={href}
                  {...fadeUp(0.15 + i * 0.07)}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 group py-3.5 border-b border-neutral-100 last:border-0 hover:border-neutral-300 transition-colors duration-200"
                >
                  <span className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-neutral-900 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <Icon size={13} className="text-neutral-500 group-hover:text-white transition-colors duration-300" />
                  </span>
                  <span className="font-body text-sm text-neutral-500 group-hover:text-neutral-900 transition-colors duration-200">
                    {label}
                  </span>
                </motion.a>
              ))}
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.div {...fadeUp(0.5)}>
              <a
                href={`https://wa.me/94774988686?text=${encodeURIComponent("Hi Mathulan! I'd love to discuss a photography project.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full font-body text-xs tracking-[0.2em] uppercase bg-neutral-900 text-white py-4 rounded-full hover:bg-neutral-700 transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Message on WhatsApp
              </a>
            </motion.div>
          </div>

          {/* ── Right: Form ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-3"
          >
            <p className="font-body text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-8">
              Send a message
            </p>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="py-12"
              >
                <p className="font-display text-3xl font-light text-neutral-900 mb-3">Message sent!</p>
                <p className="font-body text-sm text-neutral-500">Thank you for reaching out. I&apos;ll get back to you soon.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-8 font-body text-xs tracking-[0.2em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors duration-200"
                >
                  Send another →
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <input
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                </div>
                <div>
                  <input
                    placeholder="Your Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputClass} resize-none`}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1.5">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="font-body text-xs tracking-[0.25em] uppercase text-white bg-neutral-900 px-10 py-4 rounded-full hover:bg-neutral-700 transition-all duration-300 hover:px-12"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
