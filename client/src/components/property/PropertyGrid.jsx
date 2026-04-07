import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import { currency } from "../../utils/formatters";

export const PropertyGrid = ({ properties = [] }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {properties.map((item) => (
      <article key={item._id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <img src={item.images?.[0]?.url} alt={item.title} className="h-72 w-full object-cover" />
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">{item.category}</span>
            <p className="text-lg font-bold text-slate-950">{currency(item.price, item.listingType)}</p>
          </div>
          <h3 className="mt-4 font-[Outfit] text-2xl font-semibold text-slate-950">{item.title}</h3>
          <p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><MapPin size={16} /> {item.city}, {item.state}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="flex items-center gap-2"><BedDouble size={16} /> {item.specs?.beds}</span>
            <span className="flex items-center gap-2"><Bath size={16} /> {item.specs?.baths}</span>
            <span className="flex items-center gap-2"><Ruler size={16} /> {item.specs?.area} sqft</span>
          </div>
          <Link to={`/properties/${item.slug}`} className="mt-6 inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
            View Property
          </Link>
        </div>
      </article>
    ))}
  </div>
);
