export default function AboutPage() {
  return (
    <div className="pt-28 pb-32 md:pb-16 min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-12 max-w-2xl">
        <p className="font-body text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-3">
          The Photographer
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-light mb-10">
          About <em>Me</em>
        </h1>
        <p className="font-display text-2xl font-light leading-relaxed text-neutral-600 italic">
          "I chase light. Every sunrise, every golden hour — there's always a frame worth capturing."
        </p>
        <p className="font-body text-sm text-neutral-500 mt-8 leading-relaxed">
          Lumiq is a photography portfolio showcasing landscapes, nature, street, and portrait work.
          Every image is a story told through light and composition.
        </p>
      </div>
    </div>
  );
}
