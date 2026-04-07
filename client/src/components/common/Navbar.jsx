import { Menu, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/75 backdrop-blur-xl">
      <div className="shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-700 text-lg font-bold text-white">RE</div>
          <div>
            <p className="font-[Outfit] text-lg font-semibold text-slate-950">Residence Elite</p>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Luxury Real Estate</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? "text-teal-700" : "text-slate-600 hover:text-slate-950"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to={isAuthenticated ? "/account" : "/auth"}
            className="hidden rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700 md:inline-flex"
          >
            {isAuthenticated ? user?.name?.split(" ")[0] || "Account" : "Login"}
          </Link>
          {user?.role === "admin" ? (
            <a
              href={import.meta.env.VITE_ADMIN_URL || "http://localhost:5174"}
              className="hidden rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700 lg:inline-flex"
            >
              Dashboard
            </a>
          ) : null}
          <Link to="/properties" className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-700">
            Explore
          </Link>
          <button className="rounded-full border border-slate-200 p-2 md:hidden">
            <Menu size={18} />
          </button>
          <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 md:flex">
            <UserRound size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};
