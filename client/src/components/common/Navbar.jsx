import { Menu, Moon, Sun, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePropertyTools } from "../../context/PropertyToolsContext";
import { useTheme } from "../../hooks/useTheme";

const links = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { wishlist, compare } = usePropertyTools();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/75 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-700 text-lg font-bold text-white">RE</div>
          <div>
            <p className="font-[Outfit] text-lg font-semibold text-slate-950 dark:text-white">Residence Elite</p>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Luxury Real Estate</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? "text-teal-700" : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-teal-200 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to={isAuthenticated ? "/account" : "/auth"}
            className="hidden rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 md:inline-flex"
          >
            {isAuthenticated ? user?.name?.split(" ")[0] || "Account" : "Login"}
          </Link>
          <Link to="/compare" className="hidden rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 md:inline-flex">
            Compare {compare.length ? `(${compare.length})` : ""}
          </Link>
          {user?.role === "admin" ? (
            <a
              href={import.meta.env.VITE_ADMIN_URL || "http://localhost:5174"}
              className="hidden rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 lg:inline-flex"
            >
              Dashboard
            </a>
          ) : null}
          <Link to="/properties" className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-700">
            Explore
          </Link>
          <button type="button" onClick={() => setIsOpen((current) => !current)} className="rounded-full border border-slate-200 p-2 dark:border-slate-700 md:hidden">
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200 md:flex">
            <UserRound size={18} />
          </div>
        </div>
      </div>
      {isOpen ? (
        <div className="border-t border-slate-200 bg-white/95 md:hidden dark:border-slate-800 dark:bg-slate-950/95">
          <div className="shell grid gap-3 py-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-teal-50 text-teal-700" : "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to={isAuthenticated ? "/account" : "/auth"} onClick={() => setIsOpen(false)} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {isAuthenticated ? "Account" : "Login"}
            </Link>
            <Link to="/compare" onClick={() => setIsOpen(false)} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              Compare {compare.length ? `(${compare.length})` : ""}
            </Link>
            <p className="px-1 text-xs uppercase tracking-[0.24em] text-slate-500">
              Wishlist {wishlist.length ? `(${wishlist.length})` : "(0)"}
            </p>
          </div>
        </div>
      ) : null}
    </header>
  );
};
