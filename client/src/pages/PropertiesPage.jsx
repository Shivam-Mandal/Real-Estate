import { useEffect, useState } from "react";
import { propertyApi } from "../api/propertyApi";
import { PropertyFilters } from "../components/property/PropertyFilters";
import { PropertyGrid } from "../components/property/PropertyGrid";

const defaultFilters = { city: "", category: "", listingType: "", minPrice: "", maxPrice: "" };

export const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ cities: [], categories: [], types: [] });
  const [values, setValues] = useState(defaultFilters);

  useEffect(() => {
    propertyApi.getFilters().then(({ data }) => setFilters(data)).catch(() => setFilters({ cities: [], categories: [], types: [] }));
  }, []);

  useEffect(() => {
    propertyApi.getAll(values).then(({ data }) => setProperties(data.items)).catch(() => setProperties([]));
  }, [values]);

  const handleFilter = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  return (
    <section className="py-16">
      <div className="shell">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">Property Directory</p>
          <h1 className="section-title mt-3">Browse high-intent listings with clean filters and strong presentation.</h1>
          <p className="section-copy mt-4">
            Search across verified inventory by city, category, and budget, then review each property with detailed specs and inquiry flow.
          </p>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
          <PropertyFilters filters={filters} values={values} onChange={handleFilter} onReset={() => setValues(defaultFilters)} />
          <PropertyGrid properties={properties} />
        </div>
      </div>
    </section>
  );
};
