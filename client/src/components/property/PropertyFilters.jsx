export const PropertyFilters = ({ filters, values, onChange, onReset }) => (
  <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="font-[Outfit] text-2xl font-semibold text-slate-950">Filters</h3>
      <button onClick={onReset} className="text-sm font-semibold text-teal-700">Reset</button>
    </div>
    <div className="mt-6 grid gap-4">
      <input type="text" placeholder="Search location or title" value={values.location} onChange={(e) => onChange("location", e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
      <select value={values.city} onChange={(e) => onChange("city", e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
        <option value="">All Cities</option>
        {filters.cities.map((city) => <option key={city} value={city}>{city}</option>)}
      </select>
      <select value={values.category} onChange={(e) => onChange("category", e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
        <option value="">All Categories</option>
        {filters.categories.map((category) => <option key={category} value={category}>{category}</option>)}
      </select>
      <select value={values.listingType} onChange={(e) => onChange("listingType", e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
        <option value="">Sale + Rent</option>
        {filters.types.map((type) => <option key={type} value={type}>{type}</option>)}
      </select>
      <select value={values.bedrooms} onChange={(e) => onChange("bedrooms", e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
        <option value="">Any Bedrooms</option>
        {[1, 2, 3, 4, 5].map((beds) => <option key={beds} value={beds}>{beds}+ Bedrooms</option>)}
      </select>
      <input type="number" placeholder="Minimum price" value={values.minPrice} onChange={(e) => onChange("minPrice", e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
      <input type="number" placeholder="Maximum price" value={values.maxPrice} onChange={(e) => onChange("maxPrice", e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
    </div>
  </aside>
);
