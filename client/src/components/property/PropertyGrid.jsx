import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import { PropertyActionButtons } from "./PropertyActionButtons";
import { currency } from "../../utils/formatters";

export const PropertyGrid = ({ properties = [] }) => {
  if (!properties.length) {
    return (
      <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
        No properties matched the current filters.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((item) => (
        <article key={item._id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="relative">
            <img src={item.images?.[0]?.url} alt={item.title} loading="lazy" decoding="async" className="h-72 w-full object-cover" />
            <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">
                {item.listingType === "sale" ? "For Sale" : "For Rent"}
              </span>
              <span className="rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                {item.category}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-lg font-bold text-slate-950">{currency(item.price, item.listingType)}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{item.status}</p>
            </div>
            <h3 className="mt-4 font-[Outfit] text-2xl font-semibold text-slate-950">{item.title}</h3>
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><MapPin size={16} /> {item.address}, {item.city}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="flex items-center gap-2"><BedDouble size={16} /> {item.specs?.beds}</span>
              <span className="flex items-center gap-2"><Bath size={16} /> {item.specs?.baths}</span>
              <span className="flex items-center gap-2"><Ruler size={16} /> {item.specs?.area} sqft</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to={`/properties/${item.slug}`} className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
                View Property
              </Link>
              <PropertyActionButtons property={item} compact />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
