import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0f766e", "#c2410c", "#1d4ed8"];

export const PipelineChart = ({ data = [] }) => (
  <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="font-[Outfit] text-2xl font-semibold text-slate-950">Inquiry Pipeline</h3>
    <div className="mt-6 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="_id" innerRadius={70} outerRadius={110} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry._id} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);
