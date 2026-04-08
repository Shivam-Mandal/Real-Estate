import {
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Compass,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Scale,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "../components/common/Skeleton";
import { PropertyActionButtons } from "../components/property/PropertyActionButtons";
import { useSeo } from "../hooks/useSeo";
import { useToast } from "../hooks/useToast";
import { propertyService } from "../services/propertyService";
import { currency } from "../utils/formatters";

const defaultForm = { name: "", email: "", phone: "", message: "", property: "" };

const PropertyDetailsSkeleton = () => (
  <section className="py-14 md:py-18">
    <div className="shell">
      <div className="grid gap-12 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Skeleton className="h-[540px] w-full rounded-[36px]" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-24 w-full rounded-[22px]" />)}
          </div>
          <Skeleton className="h-36 w-full rounded-[28px]" />
          <Skeleton className="h-64 w-full rounded-[28px]" />
          <Skeleton className="h-[360px] w-full rounded-[28px]" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-[28px]" />
          <Skeleton className="h-96 w-full rounded-[28px]" />
          <Skeleton className="h-64 w-full rounded-[28px]" />
        </div>
      </div>
    </div>
  </section>
);

export const PropertyDetailsPage = () => {
  const { slug } = useParams();
  const { showToast } = useToast();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useSeo({
    title: property ? `${property.title} | Residence Elite` : "Property Details | Residence Elite",
    description:
      property?.description?.slice(0, 155) ||
      "Explore property details, amenities, location, and agent contact information.",
    image: property?.images?.[0]?.url,
  });

  useEffect(() => {
    let mounted = true;
    queueMicrotask(() => {
      if (mounted) {
        setLoading(true);
      }
    });

    Promise.all([
      propertyService.getBySlug(slug),
      propertyService.getSimilar(slug).catch(() => ({ items: [] })),
    ])
      .then(([propertyData, similarData]) => {
        if (!mounted) {
          return;
        }

        setProperty(propertyData.item);
        setForm({ ...defaultForm, property: propertyData.item._id });
        setSimilar(similarData.items || []);
        setActiveImage(0);
      })
      .catch(() => {
        if (mounted) {
          showToast({
            title: "Property unavailable",
            message: "We couldn't load this property right now.",
            tone: "error",
          });
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [showToast, slug]);

  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (!property) {
    return <div className="shell py-20 text-center text-slate-500 dark:text-slate-300">Property not available.</div>;
  }

  const images = property.images?.length
    ? property.images
    : [{ url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80" }];
  const mapQuery = encodeURIComponent(`${property.address}, ${property.city}, ${property.state}, ${property.country}`);

  const changeImage = (direction) => {
    setActiveImage((current) => (current + direction + images.length) % images.length);
  };

  const submitInquiry = async (event) => {
    event.preventDefault();
    try {
      await propertyService.submitInquiry(form);
      showToast({
        title: "Inquiry sent",
        message: "The assigned agent will contact you shortly.",
        tone: "success",
      });
      setForm({ ...defaultForm, property: property._id });
    } catch {
      showToast({
        title: "Inquiry failed",
        message: "We could not submit your inquiry right now.",
        tone: "error",
      });
    }
  };

  return (
    <section className="py-14 md:py-18">
      <div className="shell">
        <div className="grid gap-12 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="panel-surface relative overflow-hidden rounded-[36px] p-4 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
              <img src={images[activeImage]?.url} alt={property.title} fetchPriority="high" className="h-[380px] w-full rounded-[28px] object-cover md:h-[540px]" />
              <div className="absolute inset-x-8 top-8 flex items-center justify-between">
                <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">
                  {property.listingType === "sale" ? "For Sale" : "For Rent"}
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => changeImage(-1)} className="rounded-full bg-white/90 p-3 text-slate-900 shadow-sm">
                    <ChevronLeft size={18} />
                  </button>
                  <button type="button" onClick={() => changeImage(1)} className="rounded-full bg-white/90 p-3 text-slate-900 shadow-sm">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-[22px] border-2 ${activeImage === index ? "border-slate-950 dark:border-white" : "border-transparent"}`}
                >
                  <img src={image.url} alt={`${property.title} ${index + 1}`} loading="lazy" decoding="async" className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">{property.category}</p>
                <h1 className="mt-3 font-[Outfit] text-4xl font-semibold text-slate-950 dark:text-white md:text-5xl">{property.title}</h1>
                <p className="mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-300">
                  <MapPin size={18} />
                  {property.address}, {property.city}, {property.state}
                </p>
                <div className="mt-5">
                  <PropertyActionButtons property={property} />
                </div>
              </div>
              <div className="rounded-[28px] bg-slate-950 px-6 py-5 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Price</p>
                <p className="mt-2 text-3xl font-semibold">{currency(property.price, property.listingType)}</p>
              </div>
            </div>

            <div className="panel-surface mt-8 grid grid-cols-2 gap-4 rounded-[28px] p-6 shadow-sm md:grid-cols-4">
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100"><BedDouble size={18} className="text-teal-700" /> {property.specs?.beds} Beds</div>
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100"><Bath size={18} className="text-teal-700" /> {property.specs?.baths} Baths</div>
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100"><Ruler size={18} className="text-teal-700" /> {property.specs?.area} sqft</div>
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100"><Compass size={18} className="text-teal-700" /> Built {property.specs?.yearBuilt}</div>
            </div>

            <div className="panel-surface mt-8 rounded-[28px] p-8">
              <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950 dark:text-white">Property overview</h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">{property.description}</p>
              <div className="mt-8">
                <h3 className="font-semibold text-slate-950 dark:text-white">Amenities</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {property.amenities?.map((amenity) => (
                    <span key={amenity} className="rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel-surface mt-8 rounded-[28px] p-4 shadow-sm">
              <div className="mb-4 px-4 pt-4">
                <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950 dark:text-white">Map location</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Embedded map view for quick area context and commute planning.</p>
              </div>
              <iframe
                title={`Map for ${property.title}`}
                src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                className="h-[360px] w-full rounded-[24px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="panel-surface rounded-[28px] p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-orange-700">Agent Info</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  {property.owner?.name?.charAt(0) || "A"}
                </div>
                <div>
                  <h3 className="font-[Outfit] text-2xl font-semibold text-slate-950 dark:text-white">{property.owner?.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-300">Listing advisor</p>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-3"><Mail size={16} className="text-teal-700" /> {property.owner?.email}</p>
                <p className="flex items-center gap-3"><Phone size={16} className="text-teal-700" /> {property.owner?.phone || "Contact on request"}</p>
              </div>
            </div>

            <form onSubmit={submitInquiry} className="panel-surface rounded-[28px] p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"><HeartHandshake size={20} /></div>
                <div>
                  <h3 className="font-[Outfit] text-2xl font-semibold text-slate-950 dark:text-white">Contact agent</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-300">Request a viewing, pricing details, or a callback.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-slate-700 dark:text-white" />
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-slate-700 dark:text-white" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-slate-700 dark:text-white" />
                <textarea required rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you need, when you want to visit, or what kind of financing help you need." className="rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-slate-700 dark:text-white" />
                <button type="submit" className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-teal-700">Send Inquiry</button>
              </div>
            </form>

            <div className="panel-surface rounded-[28px] p-6 shadow-sm">
              <h3 className="font-[Outfit] text-2xl font-semibold text-slate-950 dark:text-white">Similar properties</h3>
              <div className="mt-5 space-y-4">
                {similar.map((item) => (
                  <Link key={item._id} to={`/properties/${item.slug}`} className="flex gap-4 rounded-[22px] bg-slate-50 p-3 transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700">
                    <img src={item.images?.[0]?.url} alt={item.title} loading="lazy" decoding="async" className="h-22 w-22 rounded-[16px] object-cover" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{item.city}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{currency(item.price, item.listingType)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {similar.length ? (
                <div className="pt-2">
                  <Link to="/compare" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                    <Scale size={16} />
                    Review comparison shortlist
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
