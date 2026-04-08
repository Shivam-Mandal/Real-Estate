import { GitCompareArrows, X } from "lucide-react";
import { Link } from "react-router-dom";
import { usePropertyTools } from "../../context/PropertyToolsContext";
import { currency } from "../../utils/formatters";

export const CompareDrawer = () => {
  const { compare, clearCompare, toggleCompare } = usePropertyTools();

  if (!compare.length) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
            <GitCompareArrows size={16} />
            Compare properties
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {compare.map((item) => (
              <div key={item._id} className="flex items-center gap-3 rounded-2xl bg-slate-100 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{currency(item.price, item.listingType)}</p>
                </div>
                <button type="button" onClick={() => toggleCompare(item)} className="text-slate-500 hover:text-rose-600">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={clearCompare} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
            Clear
          </button>
          <Link to="/compare" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700">
            Compare now
          </Link>
        </div>
      </div>
    </div>
  );
};
