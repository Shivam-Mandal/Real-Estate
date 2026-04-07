import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const monthLabel = (value) => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][value - 1] || value;

export const RevenueChart = ({ data = [] }) => (
  <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="font-[Outfit] text-2xl font-semibold text-slate-950">Revenue Trend</h3>
    <div className="mt-6 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.map((item) => ({ ...item, name: monthLabel(item._id) }))}>
          <defs>
            <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="revenue" stroke="#0f766e" fill="url(#revenueFill)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);
