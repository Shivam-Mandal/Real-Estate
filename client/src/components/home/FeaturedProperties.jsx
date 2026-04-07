import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import { currency } from "../../utils/formatters";

export const FeaturedProperties = ({ properties = [] }) => (
  <section className="py-12 md:py-16">
    <div className="shell">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">Curated Selection</p>
          <h2 className="section-title mt-3">Featured properties that feel elevated from the first click.</h2>
        </div>
        <Link to="/properties" className="text-sm font-semibold text-slate-700 hover:text-teal-700">See all listings</Link>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {properties.map((item) => (
          <article key={item._id} className="glass-card overflow-hidden">
            <img src={item.images?.[0]?.url} alt={item.title} className="h-72 w-full object-cover" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">{item.listingType}</span>
                  <h3 className="mt-4 font-[Outfit] text-2xl font-semibold text-slate-950">{item.title}</h3>
                </div>
                <p className="text-lg font-bold text-slate-950">{currency(item.price, item.listingType)}</p>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><MapPin size={16} /> {item.city}, {item.state}</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
              <div className="mt-5 grid grid-cols-3 gap-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                <span className="flex items-center gap-2"><BedDouble size={16} /> {item.specs?.beds} Beds</span>
                <span className="flex items-center gap-2"><Bath size={16} /> {item.specs?.baths} Baths</span>
                <span className="flex items-center gap-2"><Ruler size={16} /> {item.specs?.area} sqft</span>
              </div>
              <Link to={`/properties/${item.slug}`} className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700">
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
