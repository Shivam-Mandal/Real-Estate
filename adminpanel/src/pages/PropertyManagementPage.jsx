import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
  zipCode: "",
  beds: "",
  baths: "",
  area: "",
  parking: "",
  yearBuilt: "",
  amenities: "",
  featured: false,
  status: "active",
  approvalStatus: "approved",
  owner: "",
  images: [],
};

const approvalTone = {
  approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-rose-50 text-rose-700",
};

export const PropertyManagementPage = () => {
  const { accessToken } = useAdminAuth();
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadProperties = useCallback(() => {
    adminApi.getProperties(accessToken).then(({ data }) => setProperties(data.items)).catch(() => setProperties([]));
  }, [accessToken]);

  useEffect(() => {
    loadProperties();
    adminApi.getAgents(accessToken).then(({ data }) => setAgents(data.availableAgents || [])).catch(() => setAgents([]));
    adminApi.getPropertySpecifications(accessToken).then(({ data }) => setSpecifications(data.items || [])).catch(() => setSpecifications([]));
  }, [accessToken, loadProperties]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
    setSelectedFiles([]);
  };

  const uploadSelectedFiles = async () => {
    if (!selectedFiles.length) {
      return [];
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));
    const { data } = await adminApi.uploadImages(accessToken, formData);
    return data.files || [];
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const uploadedImages = await uploadSelectedFiles();
      const payload = {
        ...form,
        images: [...form.images, ...uploadedImages],
        amenities: form.amenities.split(",").map((item) => item.trim()).filter(Boolean),
      };

      if (editingId) {
        await adminApi.updateProperty(accessToken, editingId, payload);
        setMessage("Property updated successfully.");
      } else {
        await adminApi.createProperty(accessToken, payload);
        setMessage("Property created successfully.");
      }

      resetForm();
      loadProperties();
    } catch (error) {
      setMessage(error?.response?.data?.message || "We couldn't save the property right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const editItem = (item) => {
    setEditingId(item._id);
    setMessage("");
    setSelectedFiles([]);
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
      zipCode: item.zipCode || "",
      beds: item.specs?.beds || "",
      baths: item.specs?.baths || "",
      area: item.specs?.area || "",
      parking: item.specs?.parking ?? item.specs?.garage ?? "",
      yearBuilt: item.specs?.yearBuilt || "",
      amenities: item.amenities?.join(", ") || "",
      featured: item.featured,
      status: item.status,
      approvalStatus: item.approvalStatus || "pending",
      owner: item.owner?._id || "",
      images: item.images || [],
    });
  };

  const removeItem = async (id) => {
    await adminApi.deleteProperty(accessToken, id);
    loadProperties();
    if (editingId === id) {
      resetForm();
    }
  };

  const updateApproval = async (id, approvalStatus) => {
    await adminApi.updatePropertyApproval(accessToken, id, approvalStatus);
    loadProperties();
    if (editingId === id) {
      setForm((current) => ({ ...current, approvalStatus }));
    }
  };

  const removeImage = (url) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((image) => image.url !== url),
    }));
  };

  const activeSpecifications = specifications.filter((item) => item.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.08fr]">
      <form onSubmit={submit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950">{editingId ? "Update property" : "Add property"}</h2>
            <p className="mt-2 text-sm text-slate-500">Manage listing details, dynamic specifications, multiple images, featured status, and admin approval.</p>
          </div>
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              New property
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Property title" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <textarea required rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Property description" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />

          <div className="grid gap-4 md:grid-cols-2">
            <select value={form.listingType} onChange={(e) => setForm({ ...form, listingType: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              <option value="sale">Buy</option>
              <option value="rent">Rent</option>
            </select>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              {["apartment", "villa", "commercial", "penthouse", "land"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              {["active", "draft", "sold", "rented"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <select value={form.owner || ""} onChange={(e) => setForm({ ...form, owner: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
            <option value="">Assign agent</option>
            {agents.map((agent) => <option key={agent._id} value={agent._id}>{agent.name} ({agent.email})</option>)}
          </select>

          <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />

          <div className="grid gap-4 md:grid-cols-4">
            <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} placeholder="Zip code" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          </div>

          <div className={`grid gap-4 ${activeSpecifications.length >= 4 ? "md:grid-cols-4" : activeSpecifications.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {activeSpecifications.map((specification) => (
              <input
                key={specification.key}
                type="number"
                value={form[specification.key] ?? ""}
                onChange={(e) => setForm({ ...form, [specification.key]: e.target.value })}
                placeholder={`${specification.label}${specification.unit ? ` (${specification.unit})` : ""}`}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            ))}
          </div>

          <input type="number" value={form.yearBuilt} onChange={(e) => setForm({ ...form, yearBuilt: e.target.value })} placeholder="Year built" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="Amenities separated by commas" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Mark as featured
            </label>
            <select value={form.approvalStatus} onChange={(e) => setForm({ ...form, approvalStatus: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              {["approved", "pending", "rejected"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div className="rounded-[24px] border border-dashed border-slate-300 p-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
              <ImagePlus size={18} />
              Upload property images
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
              />
            </label>
            <p className="mt-2 text-xs text-slate-500">You can upload multiple JPG, PNG, or WEBP files at once.</p>
            {selectedFiles.length ? (
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                {selectedFiles.map((file) => (
                  <span key={`${file.name}-${file.size}`} className="rounded-full bg-slate-100 px-3 py-1">
                    {file.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {form.images.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {form.images.map((image) => (
                <div key={image.url} className="relative overflow-hidden rounded-[20px] border border-slate-200">
                  <img src={image.url} alt="Property" className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(image.url)}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-rose-600 shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {message ? <p className="text-sm text-slate-600">{message}</p> : null}

          <button disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-70">
            {submitting ? <LoaderCircle size={18} className="animate-spin" /> : null}
            {editingId ? "Update property" : "Create property"}
          </button>
        </div>
      </form>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950">Property inventory</h2>
        <div className="mt-5 space-y-4">
          {properties.map((item) => (
            <article key={item._id} className="flex flex-col gap-4 rounded-[24px] border border-slate-200 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <img src={item.images?.[0]?.url} alt={item.title} className="h-24 w-full rounded-2xl object-cover md:w-32" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">{item.title}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${approvalTone[item.approvalStatus] || "bg-slate-100 text-slate-600"}`}>
                      {item.approvalStatus}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                      {item.featured ? "Featured" : "Normal"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.city} • {item.listingType} • Rs {item.price} • {item.status}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Owner: {item.owner?.name || "N/A"}{item.approvedBy?.name ? ` • Approved by ${item.approvedBy.name}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => editItem(item)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Edit</button>
                <button onClick={() => updateApproval(item._id, "approved")} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">Approve</button>
                <button onClick={() => updateApproval(item._id, "pending")} className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">Mark Pending</button>
                <button onClick={() => updateApproval(item._id, "rejected")} className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">Reject</button>
                <button onClick={() => removeItem(item._id)} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
