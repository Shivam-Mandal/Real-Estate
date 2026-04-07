import { Bath, BedDouble, Calendar1, MapPin, Ruler } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { propertyApi } from "../api/propertyApi";
import { currency } from "../utils/formatters";

export const PropertyDetailsPage = () => {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", property: "" });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    propertyApi.getBySlug(slug).then(({ data }) => {
      setProperty(data.item);
      setForm((current) => ({ ...current, property: data.item._id }));
    });
    propertyApi.getSimilar(slug).then(({ data }) => setSimilar(data.items)).catch(() => setSimilar([]));
  }, [slug]);

  if (!property) {
    return <div className="shell py-20 text-center text-slate-500">Loading property...</div>;
  }

  const submitInquiry = async (event) => {
    event.preventDefault();
    try {
      await propertyApi.submitInquiry(form);
      setNotice("Inquiry submitted successfully. Our team will contact you shortly.");
      setForm({ name: "", email: "", phone: "", message: "", property: property._id });
    } catch {
      setNotice("We could not submit your inquiry right now.");
    }
  };

  return (
    <section className="py-16">
      <div className="shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <img src={property.images?.[0]?.url} alt={property.title} className="h-[480px] w-full rounded-[32px] object-cover" />
          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">{property.listingType}</p>
              <h1 className="mt-3 font-[Outfit] text-4xl font-semibold text-slate-950 md:text-5xl">{property.title}</h1>
              <p className="mt-4 flex items-center gap-2 text-slate-500"><MapPin size={18} /> {property.address}, {property.city}</p>
            </div>
            <p className="rounded-full bg-slate-950 px-5 py-3 text-lg font-semibold text-white">{currency(property.price, property.listingType)}</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-[28px] bg-white p-6 shadow-sm md:grid-cols-4">
            <div className="flex items-center gap-3"><BedDouble size={18} className="text-teal-700" /> {property.specs?.beds} Beds</div>
            <div className="flex items-center gap-3"><Bath size={18} className="text-teal-700" /> {property.specs?.baths} Baths</div>
            <div className="flex items-center gap-3"><Ruler size={18} className="text-teal-700" /> {property.specs?.area} sqft</div>
            <div className="flex items-center gap-3"><Calendar1 size={18} className="text-teal-700" /> {property.specs?.yearBuilt}</div>
          </div>
          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-8">
            <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950">Overview</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">{property.description}</p>
            <div className="mt-8">
              <h3 className="font-semibold text-slate-950">Amenities</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {property.amenities?.map((amenity) => <span key={amenity} className="rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">{amenity}</span>)}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950">Similar Properties</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {similar.map((item) => (
                <article key={item._id} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                  <img src={item.images?.[0]?.url} alt={item.title} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-500">{item.city}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-orange-700">Agent</p>
            <h3 className="mt-3 font-[Outfit] text-2xl font-semibold text-slate-950">{property.owner?.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{property.owner?.email}</p>
            <p className="text-sm text-slate-500">{property.owner?.phone}</p>
          </div>
          <form onSubmit={submitInquiry} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-[Outfit] text-2xl font-semibold text-slate-950">Request a viewing</h3>
            <div className="mt-5 grid gap-4">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
              <textarea required rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you want to know or when you would like to visit." className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
              <button type="submit" className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-teal-700">Send Inquiry</button>
              {notice ? <p className="text-sm text-slate-500">{notice}</p> : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
