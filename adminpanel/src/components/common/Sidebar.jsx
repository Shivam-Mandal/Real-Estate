import { Building2, LayoutDashboard, LogOut, MessageSquareText, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/properties", label: "Properties", icon: Building2 },
  { to: "/dashboard/inquiries", label: "Inquiries", icon: MessageSquareText },
  { to: "/dashboard/users", label: "Users", icon: Users },
];

export const Sidebar = () => {
  const { user, logout } = useAdminAuth();

  return (
    <aside className="flex h-full flex-col rounded-[32px] bg-slate-950 p-6 text-slate-300">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.32em] text-teal-300">Residence Elite</p>
        <h2 className="mt-3 font-[Outfit] text-2xl font-semibold text-white">Admin Panel</h2>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive ? "bg-white text-slate-950" : "hover:bg-slate-800"
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-[24px] border border-slate-800 p-4">
        <p className="font-semibold text-white">{user?.name}</p>
        <p className="mt-1 text-xs text-slate-400">{user?.email}</p>
        <button onClick={logout} className="mt-4 flex items-center gap-2 text-sm font-semibold text-rose-300">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};
