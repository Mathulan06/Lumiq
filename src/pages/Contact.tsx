import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import SectionHeading from "@/components/SectionHeading";
import { useToast } from "@/hooks/use-toast";
import { Mail, Instagram, MessageCircle } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast({ title: "Message sent!", description: "Thank you for reaching out. I'll get back to you soon." });
    setForm({ name: "", email: "", message: "" });
  };

  const inputClass = "w-full font-body text-sm border-0 border-b border-neutral-200 bg-transparent py-3 text-foreground placeholder:text-neutral-400 focus:outline-none focus:border-foreground transition-colors duration-200";

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <SectionHeading title="Get in Touch" subtitle="Let's create something beautiful together" />

        <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <input
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                placeholder="Your Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <textarea
                placeholder="Your Message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputClass} resize-none`}
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>
            <button
              type="submit"
              className="font-body text-xs tracking-[0.2em] uppercase text-white bg-foreground px-10 py-4 hover:bg-neutral-700 transition-colors duration-200"
            >
              Send Message
            </button>
          </motion.form>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-10 pt-2"
          >
            <div>
              <h3 className="font-body text-xs tracking-[0.15em] uppercase text-neutral-400 mb-6">Connect with me</h3>
              <div className="space-y-5">
                <a href="mailto:hello@lens.photo" className="flex items-center gap-4 font-body text-sm text-neutral-500 hover:text-foreground transition-colors">
                  <Mail size={16} />
                  <span>hello@lens.photo</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 font-body text-sm text-neutral-500 hover:text-foreground transition-colors">
                  <Instagram size={16} />
                  <span>@lens.photography</span>
                </a>
                <a href={`https://wa.me/1234567890?text=${encodeURIComponent("Hi! I'd love to discuss a photography project.")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 font-body text-sm text-neutral-500 hover:text-foreground transition-colors">
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-8">
              <p className="font-body text-sm text-neutral-400 leading-relaxed">
                Whether it's a commercial project, a personal portrait session, or an event — I'd love to hear about it. Drop me a message and let's bring your vision to life.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
