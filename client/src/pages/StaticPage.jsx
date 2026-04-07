export const StaticPage = ({ title, eyebrow, description }) => (
  <section className="py-16">
    <div className="shell">
      <div className="glass-card p-10">
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">{eyebrow}</p>
        <h1 className="mt-3 font-[Outfit] text-4xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{description}</p>
      </div>
    </div>
  </section>
);
