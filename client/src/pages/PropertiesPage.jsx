import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PropertyFilters } from "../components/property/PropertyFilters";
import { PropertyGrid } from "../components/property/PropertyGrid";
import { PropertyGridSkeleton } from "../components/property/PropertyGridSkeleton";
import { useSeo } from "../hooks/useSeo";
import { useToast } from "../hooks/useToast";
import { propertyService } from "../services/propertyService";

const defaultFilters = { city: "", category: "", listingType: "", minPrice: "", maxPrice: "", location: "", bedrooms: "" };

export const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ cities: [], categories: [], types: [] });
  const [values, setValues] = useState(() => ({
    ...defaultFilters,
    city: searchParams.get("city") || "",
    category: searchParams.get("category") || "",
    listingType: searchParams.get("listingType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    location: searchParams.get("location") || "",
    bedrooms: searchParams.get("bedrooms") || "",
  }));
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 9 });

  useSeo({
    title: "Browse Properties | Residence Elite",
    description: "Search approved real-estate listings by city, budget, bedrooms, category, and listing type.",
  });

  useEffect(() => {
    propertyService.getFilters().then((data) => setFilters(data)).catch(() => {
      setFilters({ cities: [], categories: [], types: [] });
      showToast({
        title: "Filters unavailable",
        message: "We couldn't load property filters right now.",
        tone: "error",
      });
    });
  }, [showToast]);

  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries({ ...values, page }).filter(([, value]) => value !== ""),
    );

    queueMicrotask(() => setLoading(true));
    setSearchParams(params);

    propertyService.getAll(params).then((data) => {
      setProperties(data.items);
      setPagination(data.pagination);
    }).catch(() => {
      setProperties([]);
      setPagination({ page: 1, pages: 1, total: 0, limit: 9 });
      showToast({
        title: "Properties unavailable",
        message: "We couldn't load the property listings right now.",
        tone: "error",
      });
    }).finally(() => setLoading(false));
  }, [page, setSearchParams, showToast, values]);

  const handleFilter = (key, value) => {
    setLoading(true);
    setPage(1);
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleReset = () => {
    setLoading(true);
    setPage(1);
    setValues(defaultFilters);
  };

  return (
    <section className="py-16">
      <div className="shell">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">Property Directory</p>
          <h1 className="section-title mt-3">Browse high-intent listings with search, filters, and clean pagination.</h1>
          <p className="section-copy mt-4">
            Search across verified inventory by location, buy or rent intent, bedrooms, category, and budget, then review each property with full details and inquiry flow.
          </p>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
          <PropertyFilters filters={filters} values={values} onChange={handleFilter} onReset={handleReset} />
          <div>
            <div className="mb-6 flex flex-col gap-3 rounded-[24px] bg-white/70 px-5 py-4 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between dark:bg-slate-900/70 dark:ring-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing page {pagination.page} of {pagination.pages} with {pagination.total} listings
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {values.listingType ? (values.listingType === "sale" ? "Buy" : "Rent") : "All"} properties
              </p>
            </div>
            {loading ? <PropertyGridSkeleton /> : <PropertyGrid properties={properties} />}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  setLoading(true);
                  setPage((current) => Math.max(1, current - 1));
                }}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              >
                Previous
              </button>
              <span className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                {pagination.page} / {pagination.pages || 1}
              </span>
              <button
                type="button"
                disabled={page >= pagination.pages}
                onClick={() => {
                  setLoading(true);
                  setPage((current) => current + 1);
                }}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
