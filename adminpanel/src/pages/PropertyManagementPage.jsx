import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

const emptyForm = {
  title: "",
  description: "",
  category: "apartment",
  listingType: "sale",
  price: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  beds: "",
  baths: "",
  area: "",
  yearBuilt: "",
  amenities: "",
  featured: false,
  images: [{ url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80", publicId: "manual" }],
};

export const PropertyManagementPage = () => {
  const { accessToken } = useAdminAuth();
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const loadProperties = () => {
    adminApi.getProperties(accessToken).then(({ data }) => setProperties(data.items)).catch(() => setProperties([]));
  };

  useEffect(() => {
    loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      amenities: form.amenities.split(",").map((item) => item.trim()).filter(Boolean),
    };

    if (editingId) {
      await adminApi.updateProperty(accessToken, editingId, payload);
    } else {
      await adminApi.createProperty(accessToken, payload);
    }

    setForm(emptyForm);
    setEditingId("");
    loadProperties();
  };

  const editItem = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      listingType: item.listingType,
      price: item.price,
      address: item.address,
      city: item.city,
      state: item.state,
      country: item.country,
      beds: item.specs?.beds,
      baths: item.specs?.baths,
      area: item.specs?.area,
      yearBuilt: item.specs?.yearBuilt,
      amenities: item.amenities?.join(", "),
      featured: item.featured,
      images: item.images,
    });
  };

  const removeItem = async (id) => {
    await adminApi.deleteProperty(accessToken, id);
    loadProperties();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={submit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950">{editingId ? "Edit property" : "Add new property"}</h2>
        <div className="mt-5 grid gap-4">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <textarea required rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <div className="grid gap-4 md:grid-cols-2">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              {["apartment", "villa", "commercial", "penthouse", "land"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={form.listingType} onChange={(e) => setForm({ ...form, listingType: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              {["sale", "rent"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <input type="number" value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} placeholder="Beds" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input type="number" value={form.baths} onChange={(e) => setForm({ ...form, baths: e.target.value })} placeholder="Baths" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Area" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input type="number" value={form.yearBuilt} onChange={(e) => setForm({ ...form, yearBuilt: e.target.value })} placeholder="Year" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          </div>
          <input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="Amenities separated by commas" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Feature this property
          </label>
          <button className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-teal-700">
            {editingId ? "Update property" : "Create property"}
          </button>
        </div>
      </form>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950">Listing inventory</h2>
        <div className="mt-5 space-y-4">
          {properties.map((item) => (
            <article key={item._id} className="flex flex-col gap-4 rounded-[24px] border border-slate-200 p-4 md:flex-row md:items-center">
              <img src={item.images?.[0]?.url} alt={item.title} className="h-24 w-full rounded-2xl object-cover md:w-32" />
              <div className="flex-1">
                <p className="font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.city} • {item.listingType} • Rs {item.price}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => editItem(item)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Edit</button>
                <button onClick={() => removeItem(item._id)} className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
