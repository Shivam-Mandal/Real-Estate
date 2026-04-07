import { services } from "../../data/fallbackData";

export const ServicesSection = () => (
  <section className="py-12 md:py-16">
    <div className="shell grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-orange-700">Why Choose Us</p>
        <h2 className="section-title mt-3">A sharper digital layer for real estate teams and serious buyers.</h2>
        <p className="section-copy mt-4">
          We designed the experience to feel editorial, trustworthy, and operationally useful, not just visually attractive.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {services.map((service, index) => (
          <article key={service.title} className={`rounded-[28px] border p-6 shadow-sm ${index === 1 ? "border-teal-200 bg-teal-50" : "border-slate-200 bg-white"}`}>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white">0{index + 1}</div>
            <h3 className="font-[Outfit] text-xl font-semibold text-slate-950">{service.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
