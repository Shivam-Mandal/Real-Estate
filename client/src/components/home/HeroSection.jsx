import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { heroStats } from "../../data/fallbackData";

export const HeroSection = () => (
  <section className="relative overflow-hidden py-16 md:py-24">
    <div className="shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div>
        <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-teal-700">
          Premium homes. Clear decisions.
        </span>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-slate-950 md:text-7xl">
          Find property experiences built for modern living and confident investing.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          Browse verified homes, track market-ready inventory, and move from discovery to decision with a refined digital workflow.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link to="/properties" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-teal-700">
            Browse Properties <ArrowRight size={18} />
          </Link>
          <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
            Talk to an Advisor
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="glass-card p-5">
              <p className="text-2xl font-bold text-slate-950">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="glass-card relative overflow-hidden p-5">
          <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80" alt="Modern luxury residence" className="h-[500px] w-full rounded-[24px] object-cover" />
          <div className="absolute inset-x-10 bottom-10 rounded-[26px] border border-white/70 bg-white/90 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal-700">Featured Residence</p>
                <p className="mt-2 font-[Outfit] text-2xl font-semibold text-slate-950">Skyline Horizon Penthouse</p>
              </div>
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-right text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">From</p>
                <p className="text-xl font-semibold">Rs 14.5M</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -left-4 top-12 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-700"><Search size={20} /></div>
            <div>
              <p className="font-semibold text-slate-900">Instant match search</p>
              <p className="text-xs text-slate-500">Smart filters by city, type, and price</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-4 right-4 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-teal-100 p-3 text-teal-700"><ShieldCheck size={20} /></div>
            <div>
              <p className="font-semibold text-slate-900">Verified inventory</p>
              <p className="text-xs text-slate-500">Trusted listings and guided viewing support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
