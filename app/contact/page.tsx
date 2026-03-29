export default function ContactPage() {
  return (
    <div className="pt-28 pb-32 md:pb-16 min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-12 max-w-2xl">
        <p className="font-body text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-3">
          Get in Touch
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-light mb-10">
          Contact <em>Me</em>
        </h1>
        <p className="font-body text-sm text-neutral-500 leading-relaxed">
          For print orders, collaborations, or enquiries, reach out via WhatsApp or email.
        </p>
        <div className="mt-10 space-y-4">
          <a
            href="https://wa.me/60123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-body text-sm text-neutral-900 border border-neutral-200 rounded-full px-6 py-3 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
