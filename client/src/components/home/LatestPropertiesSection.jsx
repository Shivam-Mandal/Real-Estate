import { ArrowRight, LoaderCircle, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { propertyApi } from "../../api/propertyApi";
import { PropertyActionButtons } from "../property/PropertyActionButtons";
import { currency } from "../../utils/formatters";

const tabs = [
  { label: "All", value: "" },
  { label: "Buy", value: "sale" },
  { label: "Rent", value: "rent" },
];

export const LatestPropertiesSection = () => {
  const [activeTab, setActiveTab] = useState("");
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const sentinelRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    propertyApi
      .getAll({ page, limit: 6, listingType: activeTab })
      .then(({ data }) => {
        if (!mounted) return;
        setProperties((current) => (page === 1 ? data.items : [...current, ...data.items]));
        setPages(data.pagination.pages || 1);
      })
      .catch(() => {
        if (mounted && page === 1) {
          setProperties([]);
          setPages(1);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeTab, page]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || loading || page >= pages) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setLoading(true);
          setPage((current) => current + 1);
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loading, page, pages, properties.length]);

  const handleTabChange = (value) => {
    setLoading(true);
    setActiveTab(value);
    setPage(1);
    setProperties([]);
  };

  return (
    <section className="py-14 md:py-20">
      <div className="shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-amber-700">Latest Properties</p>
            <h2 className="section-title mt-3">Fresh inventory designed for browsing, comparing, and acting quickly.</h2>
            <p className="section-copy mt-4">
              Explore newly listed homes and investment-ready opportunities with dynamic filters and continuous loading.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeTab === tab.value ? "bg-slate-950 text-white" : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((item) => (
            <article key={item._id} className="group overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_30px_70px_rgba(15,23,42,0.08)]">
              <div className="relative overflow-hidden">
                <img src={item.images?.[0]?.url} alt={item.title} loading="lazy" decoding="async" className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">
                    {item.listingType === "sale" ? "For Sale" : "For Rent"}
                  </span>
                  <span className="rounded-full bg-slate-950/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-2xl font-bold text-slate-950">{currency(item.price, item.listingType)}</p>
                <h3 className="mt-3 font-[Outfit] text-2xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={16} />
                  {item.address}, {item.city}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    <span>{item.specs?.beds || 0} Beds</span>
                    <span>{item.specs?.baths || 0} Baths</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link to={`/properties/${item.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                      View <ArrowRight size={16} />
                    </Link>
                    <PropertyActionButtons property={item} compact />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 flex items-center justify-center gap-3 text-sm font-medium text-slate-500">
            <LoaderCircle size={18} className="animate-spin" />
            Loading more properties
          </div>
        ) : null}

        <div ref={sentinelRef} className="h-10" />
      </div>
    </section>
  );
};
