export const MetricCard = ({ label, value, accent }) => (
  <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <div className={`h-2 w-16 rounded-full ${accent}`} />
    <p className="mt-5 text-sm text-slate-500">{label}</p>
    <p className="mt-3 font-[Outfit] text-4xl font-semibold text-slate-950">{value}</p>
  </div>
);
