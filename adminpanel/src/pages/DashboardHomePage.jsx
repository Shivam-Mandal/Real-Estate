import { Clock3, ReceiptText, UserPlus, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { MetricCard } from "../components/dashboard/MetricCard";
import { SimpleAreaChart } from "../components/dashboard/SimpleAreaChart";
import { useAdminAuth } from "../context/AdminAuthContext";

const activityIcon = {
  user: UserPlus,
  property: Wrench,
  message: ReceiptText,
};

export const DashboardHomePage = () => {
  const { accessToken } = useAdminAuth();
  const [dashboard, setDashboard] = useState({
    metrics: {},
    monthlyPackagePurchase: [],
    registeredUsersByMonth: [],
    recentActivities: [],
  });

  useEffect(() => {
    adminApi.getDashboard(accessToken).then(({ data }) => setDashboard(data)).catch(() => {});
  }, [accessToken]);

  const metrics = [
    { label: "Payment Logs", value: dashboard.metrics.paymentLogsCount || 0, accent: "bg-teal-500" },
    { label: "Properties", value: dashboard.metrics.propertiesCount || 0, accent: "bg-orange-500" },
    { label: "Featured", value: dashboard.metrics.featuredPropertiesCount || 0, accent: "bg-amber-500" },
    { label: "Vendors", value: dashboard.metrics.vendorsCount || 0, accent: "bg-blue-500" },
    { label: "Users", value: dashboard.metrics.usersCount || 0, accent: "bg-slate-900" },
    { label: "Subscribers", value: dashboard.metrics.subscribersCount || 0, accent: "bg-emerald-500" },
  ];

  return (
    <>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">Overview</p>
        <h1 className="mt-3 font-[Outfit] text-4xl font-semibold text-slate-950">Control center for the admin panel.</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SimpleAreaChart title="Monthly Package Purchase" accent="#0f766e" data={dashboard.monthlyPackagePurchase} />
        <SimpleAreaChart title="Month-wise Registered Users" accent="#1d4ed8" data={dashboard.registeredUsersByMonth} />
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <Clock3 size={18} />
          </div>
          <div>
            <h3 className="font-[Outfit] text-2xl font-semibold text-slate-950">Recent Activities</h3>
            <p className="text-sm text-slate-500">Latest admin-relevant events from users, properties, and messages.</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {dashboard.recentActivities.map((activity) => {
            const Icon = activityIcon[activity.type] || Clock3;
            return (
              <div key={activity.id} className="flex items-start gap-4 rounded-[22px] border border-slate-100 bg-slate-50 p-4">
                <div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-950">{activity.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{activity.subtitle}</p>
                </div>
                <p className="text-xs font-medium text-slate-400">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
