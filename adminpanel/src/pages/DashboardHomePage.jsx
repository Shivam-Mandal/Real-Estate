import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { MetricCard } from "../components/dashboard/MetricCard";
import { PipelineChart } from "../components/dashboard/PipelineChart";
import { RevenueChart } from "../components/dashboard/RevenueChart";
import { useAdminAuth } from "../context/AdminAuthContext";

export const DashboardHomePage = () => {
  const { accessToken } = useAdminAuth();
  const [dashboard, setDashboard] = useState({ metrics: {}, monthlyRevenue: [], pipeline: [], latestUsers: [] });

  useEffect(() => {
    adminApi.getDashboard(accessToken).then(({ data }) => setDashboard(data)).catch(() => {});
  }, [accessToken]);

  const metrics = [
    { label: "Users", value: dashboard.metrics.totalUsers || 0, accent: "bg-teal-500" },
    { label: "Properties", value: dashboard.metrics.totalProperties || 0, accent: "bg-orange-500" },
    { label: "Inquiries", value: dashboard.metrics.totalInquiries || 0, accent: "bg-blue-500" },
    { label: "Featured", value: dashboard.metrics.featuredProperties || 0, accent: "bg-slate-900" },
  ];

  return (
    <>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">Overview</p>
        <h1 className="mt-3 font-[Outfit] text-4xl font-semibold text-slate-950">Portfolio health at a glance.</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RevenueChart data={dashboard.monthlyRevenue} />
        <PipelineChart data={dashboard.pipeline} />
      </div>
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-[Outfit] text-2xl font-semibold text-slate-950">Latest Users</h3>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Role</th>
                <th className="py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.latestUsers.map((user) => (
                <tr key={user._id} className="border-t border-slate-100">
                  <td className="py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="py-4">{user.email}</td>
                  <td className="py-4 capitalize">{user.role}</td>
                  <td className="py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
