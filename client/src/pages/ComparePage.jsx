import { Link } from "react-router-dom";
import { usePropertyTools } from "../context/PropertyToolsContext";
import { useSeo } from "../hooks/useSeo";
import { currency } from "../utils/formatters";

export const ComparePage = () => {
  const { compare, clearCompare } = usePropertyTools();

  useSeo({
    title: "Compare Properties | Residence Elite",
    description: "Compare shortlisted real-estate listings side by side by price, location, and core specifications.",
  });

  if (!compare.length) {
    return (
      <section className="py-16">
        <div className="shell">
          <div className="glass-card p-10 text-center">
            <h1 className="font-[Outfit] text-4xl font-semibold text-slate-950">No properties selected for comparison</h1>
            <p className="mt-4 text-slate-600">Add up to three listings from the directory or property detail page to compare them side by side.</p>
            <Link to="/properties" className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 font-semibold text-white">
              Browse properties
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">Compare</p>
            <h1 className="mt-3 font-[Outfit] text-4xl font-semibold text-slate-950">Compare shortlisted properties side by side.</h1>
          </div>
          <button type="button" onClick={clearCompare} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
            Clear comparison
          </button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-500">Field</th>
                {compare.map((property) => (
                  <th key={property._id} className="min-w-[260px] px-5 py-4 text-left">
                    <p className="font-[Outfit] text-xl font-semibold text-slate-950">{property.title}</p>
                    <p className="mt-2 text-sm text-slate-500">{property.city}, {property.state}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Price", (property) => currency(property.price, property.listingType)],
                ["Category", (property) => property.category],
                ["Listing Type", (property) => property.listingType],
                ["Address", (property) => `${property.address}, ${property.city}`],
                ["Bedrooms", (property) => property.specs?.beds || 0],
                ["Bathrooms", (property) => property.specs?.baths || 0],
                ["Area", (property) => `${property.specs?.area || 0} sqft`],
                ["Year Built", (property) => property.specs?.yearBuilt || "N/A"],
              ].map(([label, formatter]) => (
                <tr key={label} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-5 py-4 text-sm font-semibold text-slate-600">{label}</td>
                  {compare.map((property) => (
                    <td key={`${property._id}-${label}`} className="px-5 py-4 text-sm text-slate-800">{formatter(property)}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-5 py-4 text-sm font-semibold text-slate-600">Actions</td>
                {compare.map((property) => (
                  <td key={`${property._id}-action`} className="px-5 py-4">
                    <Link to={`/properties/${property.slug}`} className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                      View property
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
