import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "vendor",
  isActive: true,
};

export const VendorsPage = () => {
  const { accessToken } = useAdminAuth();
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadVendors = useCallback(() => {
    adminApi.getUsers(accessToken)
      .then(({ data }) => setVendors((data.items || []).filter((item) => item.role === "vendor")))
      .catch(() => setVendors([]));
  }, [accessToken]);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const handleCreateVendor = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      await adminApi.createUser(accessToken, form);
      setForm(emptyForm);
      setMessage("Vendor created successfully.");
      loadVendors();
    } catch (error) {
      setMessage(error?.response?.data?.message || "We couldn't create the vendor right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateVendor = async (id, payload) => {
    try {
      await adminApi.updateUser(accessToken, id, payload);
      loadVendors();
    } catch (error) {
      setMessage(error?.response?.data?.message || "We couldn't update the vendor right now.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <form onSubmit={handleCreateVendor} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-[Outfit] text-3xl font-semibold text-slate-950">Create vendor</h1>
        <p className="mt-2 text-sm text-slate-500">Onboard vendor accounts for service providers, partners, and external contributors.</p>
        <div className="mt-5 grid gap-4">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Vendor name" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Vendor email" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Temporary password" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <select value={String(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          <button disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-70">
            {submitting ? <LoaderCircle size={18} className="animate-spin" /> : null}
            Create vendor
          </button>
        </div>
      </form>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950">Vendor directory</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-3">Vendor</th>
                <th className="py-3">Phone</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="border-t border-slate-100">
                  <td className="py-4">
                    <p className="font-medium text-slate-900">{vendor.name}</p>
                    <p className="text-slate-500">{vendor.email}</p>
                  </td>
                  <td className="py-4">{vendor.phone || "Not provided"}</td>
                  <td className="py-4">
                    <button
                      type="button"
                      onClick={() => updateVendor(vendor._id, { isActive: !vendor.isActive })}
                      className={`rounded-full px-4 py-2 text-xs font-semibold ${
                        vendor.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {vendor.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
