import { testimonials } from "../../data/fallbackData";

export const TestimonialSection = () => (
  <section className="py-12 md:py-16">
    <div className="shell">
      <div className="glass-card grid gap-8 p-8 md:grid-cols-2 md:p-12">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">Client Trust</p>
          <h2 className="section-title mt-3">A platform that feels premium and still stays practical.</h2>
          <p className="section-copy mt-4">
            Every surface is designed to move users from discovery to action while keeping the admin workflow clear and scalable.
          </p>
        </div>
        <div className="grid gap-5">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm leading-7 text-slate-700">“{item.quote}”</p>
              <div className="mt-5">
                <p className="font-semibold text-slate-950">{item.name}</p>
                <p className="text-sm text-slate-500">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);
