import { GitCompareArrows, Heart } from "lucide-react";
import { usePropertyTools } from "../../context/PropertyToolsContext";

export const PropertyActionButtons = ({ property, compact = false }) => {
  const { isCompared, isWishlisted, toggleCompare, toggleWishlist } = usePropertyTools();
  const saved = isWishlisted(property?._id);
  const compared = isCompared(property?._id);

  const baseClass = compact
    ? "rounded-full border px-3 py-2 text-xs font-semibold"
    : "rounded-full border px-4 py-3 text-sm font-semibold";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => toggleWishlist(property)}
        className={`${baseClass} ${
          saved
            ? "border-rose-200 bg-rose-50 text-rose-700"
            : "border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:text-rose-700"
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <Heart size={compact ? 14 : 16} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved" : "Wishlist"}
        </span>
      </button>
      <button
        type="button"
        onClick={() => toggleCompare(property)}
        className={`${baseClass} ${
          compared
            ? "border-teal-200 bg-teal-50 text-teal-700"
            : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:text-teal-700"
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <GitCompareArrows size={compact ? 14 : 16} />
          {compared ? "Compared" : "Compare"}
        </span>
      </button>
    </div>
  );
};
