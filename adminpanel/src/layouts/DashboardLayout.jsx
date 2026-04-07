import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/common/Sidebar";

export const DashboardLayout = () => (
  <div className="admin-shell py-6">
    <div className="grid min-h-[calc(100vh-3rem)] gap-6 lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="space-y-6">
        <Outlet />
      </div>
    </div>
  </div>
);
