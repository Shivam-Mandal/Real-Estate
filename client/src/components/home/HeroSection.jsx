import { ArrowRight, BedDouble, MapPin, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { heroStats } from "../../data/fallbackData";

const defaultFilters = {
  location: "",
  listingType: "",
  maxPrice: "",
  bedrooms: "",
};

export const HeroSection = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const navigate = useNavigate();

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const search = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        search.set(key, value);
      }
    });

    navigate(`/properties${search.toString() ? `?${search.toString()}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="shell grid gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-teal-700">
            Premium homes. Clear decisions.
          </span>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-slate-950 md:text-7xl">
            Find a home that feels edited, not overwhelming.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            Search luxury-ready inventory with location, buy or rent intent, budget, and bedroom filters built into the first interaction.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/properties" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-teal-700">
              Browse Properties <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
              Schedule a Consultation
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
            <img
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80"
              alt="Modern luxury residence"
              fetchPriority="high"
              className="h-[560px] w-full rounded-[24px] object-cover"
            />
            <div className="absolute inset-x-8 bottom-8 rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-2xl backdrop-blur-xl">
              <form onSubmit={handleSubmit} className="grid gap-4 xl:grid-cols-2">
                <label className="rounded-[24px] bg-slate-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                    <MapPin size={14} />
                    Location
                  </span>
                  <input
                    value={filters.location}
                    onChange={(event) => updateFilter("location", event.target.value)}
                    placeholder="Mumbai, Bengaluru, Goa"
                    className="mt-2 w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                  />
                </label>
                <label className="rounded-[24px] bg-slate-50 px-4 py-3">
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Property Type</span>
                  <select
                    value={filters.listingType}
                    onChange={(event) => updateFilter("listingType", event.target.value)}
                    className="mt-2 w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                  >
                    <option value="">Buy or Rent</option>
                    <option value="sale">Buy</option>
                    <option value="rent">Rent</option>
                  </select>
                </label>
                <label className="rounded-[24px] bg-slate-50 px-4 py-3">
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Price Range</span>
                  <select
                    value={filters.maxPrice}
                    onChange={(event) => updateFilter("maxPrice", event.target.value)}
                    className="mt-2 w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                  >
                    <option value="">Any price</option>
                    <option value="5000000">Up to Rs 50L</option>
                    <option value="15000000">Up to Rs 1.5Cr</option>
                    <option value="30000000">Up to Rs 3Cr</option>
                    <option value="60000000">Up to Rs 6Cr</option>
                  </select>
                </label>
                <label className="rounded-[24px] bg-slate-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                    <BedDouble size={14} />
                    Bedrooms
                  </span>
                  <select
                    value={filters.bedrooms}
                    onChange={(event) => updateFilter("bedrooms", event.target.value)}
                    className="mt-2 w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </label>
                <div className="xl:col-span-2 flex flex-col gap-3 sm:flex-row">
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-teal-700">
                    Search homes <Search size={18} />
                  </button>
                  <Link to="/properties" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
                    Explore all listings
                  </Link>
                </div>
              </form>
            </div>
          </div>
          <div className="absolute -left-4 top-12 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-xl backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-700"><Search size={20} /></div>
              <div>
                <p className="font-semibold text-slate-900">Intent-first search</p>
                <p className="text-xs text-slate-500">Location, budget, buy or rent, bedrooms</p>
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
};
