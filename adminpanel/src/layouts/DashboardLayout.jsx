import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/common/Sidebar";

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-shell py-6">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Admin console</p>
          <h1 className="font-[Outfit] text-2xl font-semibold text-slate-950">Residence Elite</h1>
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm"
        >
          <Menu size={20} />
        </button>
      </div>
      <div className="grid min-h-[calc(100vh-3rem)] gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
