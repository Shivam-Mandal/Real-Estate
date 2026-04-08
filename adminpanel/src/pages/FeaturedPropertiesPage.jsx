import { Star, StarOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

export const FeaturedPropertiesPage = () => {
  const { accessToken } = useAdminAuth();
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState("");

  const loadProperties = useCallback(() => {
    adminApi.getProperties(accessToken).then(({ data }) => setProperties(data.items || [])).catch(() => setProperties([]));
  }, [accessToken]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const toggleFeatured = async (property) => {
    setMessage("");
    try {
      await adminApi.updateProperty(accessToken, property._id, {
        featured: !property.featured,
      });
      setMessage(property.featured ? "Property removed from featured listings." : "Property added to featured listings.");
      loadProperties();
    } catch (error) {
      setMessage(error?.response?.data?.message || "We couldn't update the featured status right now.");
    }
  };

  const featuredItems = properties.filter((item) => item.featured);
  const candidateItems = properties.filter((item) => !item.featured && item.approvalStatus === "approved" && item.status === "active");

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">Featured Properties</p>
        <h1 className="mt-3 font-[Outfit] text-3xl font-semibold text-slate-950">Curate the featured inventory shown on the public site.</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Only approved and active properties should be highlighted. Changes here are reflected in the live featured listings feed.
        </p>
        {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}

        <div className="mt-6 space-y-4">
          {featuredItems.length ? featuredItems.map((item) => (
            <article key={item._id} className="rounded-[24px] border border-slate-200 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <img src={item.images?.[0]?.url} alt={item.title} className="h-24 w-full rounded-2xl object-cover md:w-32" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.city} • {item.listingType} • Rs {item.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFeatured(item)}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700"
                >
                  <StarOff size={16} />
                  Remove
                </button>
              </div>
            </article>
          )) : (
            <div className="rounded-[24px] border border-dashed border-slate-300 p-5 text-sm text-slate-500">
              No featured properties selected yet.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950">Eligible properties</h2>
        <p className="mt-2 text-sm text-slate-500">Approved and active listings that can be promoted to the featured carousel.</p>
        <div className="mt-6 space-y-4">
          {candidateItems.length ? candidateItems.map((item) => (
            <article key={item._id} className="rounded-[24px] border border-slate-200 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <img src={item.images?.[0]?.url} alt={item.title} className="h-24 w-full rounded-2xl object-cover md:w-32" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.city} • {item.listingType} • Rs {item.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFeatured(item)}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  <Star size={16} />
                  Feature
                </button>
              </div>
            </article>
          )) : (
            <div className="rounded-[24px] border border-dashed border-slate-300 p-5 text-sm text-slate-500">
              No additional eligible properties are available right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
