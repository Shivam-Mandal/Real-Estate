import {
  BadgeDollarSign,
  Building2,
  FileText,
  LayoutDashboard,
  LayoutList,
  LogOut,
  MessageSquareText,
  Package,
  ShieldCheck,
  Sparkles,
  Users,
  UserSquare2,
  Wrench,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/property-specifications", label: "Property Specifications", icon: FileText },
  { to: "/dashboard/properties", label: "Property Management", icon: Building2 },
  { to: "/dashboard/featured-properties", label: "Featured Properties", icon: Sparkles },
  { to: "/dashboard/property-messages", label: "Property Messages", icon: MessageSquareText },
  { to: "/dashboard/agents", label: "Agents", icon: UserSquare2 },
  { to: "/dashboard/package-management", label: "Package Management", icon: Package },
  { to: "/dashboard/payment-logs", label: "Payment Logs", icon: BadgeDollarSign },
  { to: "/dashboard/users", label: "Users Management", icon: Users },
  { to: "/dashboard/vendors", label: "Vendors Management", icon: Wrench },
];

export const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { user, logout } = useAdminAuth();

  return (
    <>
      {isOpen ? <button type="button" onClick={onClose} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" aria-label="Close sidebar" /> : null}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[280px] -translate-x-full bg-slate-950 p-6 text-slate-300 transition-transform lg:static lg:h-full lg:w-auto lg:translate-x-0 lg:rounded-[32px] ${isOpen ? "translate-x-0" : ""}`}>
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-teal-300">Residence Elite</p>
            <h2 className="mt-3 font-[Outfit] text-2xl font-semibold text-white">Admin Panel</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-800 p-2 text-slate-400 lg:hidden">
            <X size={18} />
          </button>
        </div>
        <nav className="space-y-2 overflow-y-auto pr-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
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
        <div className="mt-6 rounded-[24px] border border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-800 p-3 text-teal-300">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="mt-1 text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="mt-4 flex items-center gap-2 text-sm font-semibold text-rose-300">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};
