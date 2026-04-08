export const PlaceholderPage = ({ title, description }) => (
  <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
    <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">Module</p>
    <h1 className="mt-3 font-[Outfit] text-3xl font-semibold text-slate-950">{title}</h1>
    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
  </div>
);
