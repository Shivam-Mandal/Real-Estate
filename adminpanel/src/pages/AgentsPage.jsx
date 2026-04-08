import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

export const AgentsPage = () => {
  const { accessToken } = useAdminAuth();
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    adminApi.getAgents(accessToken).then(({ data }) => setAgents(data.items)).catch(() => setAgents([]));
  }, [accessToken]);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">Agents Module</p>
        <h1 className="mt-3 font-[Outfit] text-3xl font-semibold text-slate-950">Manage agents and their assigned inventory.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Use Users Management to create or edit agent accounts, then assign properties from Property Management. This view gives you a clean operational overview.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Total Agents</p>
          <p className="mt-2 font-[Outfit] text-3xl font-semibold text-slate-950">{agents.length}</p>
        </div>
        <div className="rounded-[24px] bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Active Agents</p>
          <p className="mt-2 font-[Outfit] text-3xl font-semibold text-slate-950">{agents.filter((agent) => agent.isActive).length}</p>
        </div>
        <div className="rounded-[24px] bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Assigned Properties</p>
          <p className="mt-2 font-[Outfit] text-3xl font-semibold text-slate-950">
            {agents.reduce((sum, agent) => sum + (agent.propertyCount || 0), 0)}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-3">Agent</th>
              <th className="py-3">Phone</th>
              <th className="py-3">Status</th>
              <th className="py-3">Properties</th>
              <th className="py-3">Featured</th>
              <th className="py-3">Pending Approval</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent._id} className="border-t border-slate-100">
                <td className="py-4">
                  <p className="font-medium text-slate-900">{agent.name}</p>
                  <p className="text-slate-500">{agent.email}</p>
                </td>
                <td className="py-4">{agent.phone || "Not provided"}</td>
                <td className="py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${agent.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {agent.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-4 font-medium text-slate-900">{agent.propertyCount || 0}</td>
                <td className="py-4">{agent.featuredCount || 0}</td>
                <td className="py-4">{agent.pendingApprovalCount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
