import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

export const InquiriesPage = () => {
  const { accessToken, user } = useAdminAuth();
  const [inquiries, setInquiries] = useState([]);

  const load = useCallback(() => {
    adminApi.getInquiries(accessToken).then(({ data }) => setInquiries(data.items)).catch(() => setInquiries([]));
  }, [accessToken]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id, status) => {
    await adminApi.updateInquiryStatus(accessToken, id, status);
    load();
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">
          {user?.role === "admin" ? "All Property Messages" : "Agent Messages"}
        </p>
        <h1 className="mt-3 font-[Outfit] text-3xl font-semibold text-slate-950">
          {user?.role === "admin" ? "All leads across the platform." : "Leads assigned to your properties."}
        </h1>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-3">Prospect</th>
              <th className="py-3">Property</th>
              {user?.role === "admin" ? <th className="py-3">Assigned Agent</th> : null}
              <th className="py-3">Message</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((item) => (
              <tr key={item._id} className="border-t border-slate-100 align-top">
                <td className="py-4">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-slate-500">{item.email}</p>
                  <p className="text-slate-400">{item.phone || "No phone"}</p>
                </td>
                <td className="py-4">
                  <p className="font-medium text-slate-900">{item.property?.title}</p>
                  <p className="text-slate-500">{item.property?.city}</p>
                </td>
                {user?.role === "admin" ? (
                  <td className="py-4">
                    <p className="font-medium text-slate-900">{item.property?.owner?.name || "Unassigned"}</p>
                    <p className="text-slate-500">{item.property?.owner?.email || ""}</p>
                  </td>
                ) : null}
                <td className="py-4 max-w-md text-slate-600">{item.message}</td>
                <td className="py-4">
                  <select value={item.status} onChange={(e) => updateStatus(item._id, e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2">
                    {["new", "contacted", "closed"].map((status) => <option key={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
