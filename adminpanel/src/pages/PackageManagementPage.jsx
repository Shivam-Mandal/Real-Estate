import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  currency: "INR",
  listingLimit: "",
  featuredListingsAllowed: false,
  isCustom: false,
  isActive: true,
};

export const PackageManagementPage = () => {
  const { accessToken } = useAdminAuth();
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const loadPlans = useCallback(() => {
    adminApi.getPlans(accessToken).then(({ data }) => setPlans(data.items)).catch(() => setPlans([]));
  }, [accessToken]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      if (editingId) {
        await adminApi.updatePlan(accessToken, editingId, form);
        setMessage("Plan updated successfully.");
      } else {
        await adminApi.createPlan(accessToken, form);
        setMessage("Plan created successfully.");
      }
      resetForm();
      loadPlans();
    } catch (error) {
      setMessage(error?.response?.data?.message || "We couldn't save the plan right now.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={submit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-[Outfit] text-3xl font-semibold text-slate-950">{editingId ? "Edit plan" : "Create plan"}</h1>
        <p className="mt-2 text-sm text-slate-500">Manage Basic, Premium, and Custom plan rules including listing limits and featured eligibility.</p>
        <div className="mt-5 grid gap-4">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Plan name" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows="4" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <div className="grid gap-4 md:grid-cols-3">
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} placeholder="Currency" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input type="number" value={form.listingLimit} onChange={(e) => setForm({ ...form, listingLimit: e.target.value })} placeholder="Listing limit" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
            <input type="checkbox" checked={form.featuredListingsAllowed} onChange={(e) => setForm({ ...form, featuredListingsAllowed: e.target.checked })} />
            Allow featured listings
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
              <input type="checkbox" checked={form.isCustom} onChange={(e) => setForm({ ...form, isCustom: e.target.checked })} />
              Custom plan
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active plan
            </label>
          </div>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          <div className="flex gap-3">
            <button className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-teal-700">
              {editingId ? "Update plan" : "Create plan"}
            </button>
            {editingId ? (
              <button type="button" onClick={resetForm} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </form>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950">Available plans</h2>
        <div className="mt-5 space-y-4">
          {plans.map((plan) => (
            <article key={plan._id} className="rounded-[24px] border border-slate-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">{plan.name}</p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">{plan.slug}</span>
                    {plan.isCustom ? <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase text-orange-700">Custom</span> : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{plan.description || "No description added yet."}</p>
                </div>
                <button type="button" onClick={() => { setEditingId(plan._id); setForm({ ...plan, price: plan.price, listingLimit: plan.listingLimit }); }} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                  Edit
                </button>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-4 text-sm text-slate-600">
                <div><span className="font-semibold text-slate-900">Price:</span> {plan.currency} {plan.price}</div>
                <div><span className="font-semibold text-slate-900">Limit:</span> {plan.listingLimit}</div>
                <div><span className="font-semibold text-slate-900">Featured:</span> {plan.featuredListingsAllowed ? "Yes" : "No"}</div>
                <div><span className="font-semibold text-slate-900">Status:</span> {plan.isActive ? "Active" : "Inactive"}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
