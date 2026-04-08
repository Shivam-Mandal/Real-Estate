import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePropertyTools } from "../context/PropertyToolsContext";
import { useSeo } from "../hooks/useSeo";
import { currency } from "../utils/formatters";

export const AccountPage = () => {
  const { user, logout } = useAuth();
  const { wishlist } = usePropertyTools();
  const navigate = useNavigate();

  useSeo({
    title: "Your Account | Residence Elite",
    description: "Manage your profile, review your saved properties, and continue your real-estate journey.",
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <section className="py-16">
      <div className="shell">
        <div className="glass-card p-8">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">Account</p>
          <h1 className="mt-3 font-[Outfit] text-4xl font-semibold text-slate-950">Welcome back, {user?.name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Your session is protected by JWT authentication and your access level is controlled by your assigned role.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-2 font-semibold text-slate-900">{user?.email}</p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Phone</p>
              <p className="mt-2 font-semibold text-slate-900">{user?.phone || "Not added"}</p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Role</p>
              <p className="mt-2 font-semibold capitalize text-slate-900">{user?.role}</p>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950">Wishlist</h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {wishlist.length ? wishlist.map((item) => (
                <div key={item._id} className="rounded-[24px] bg-slate-50 p-5">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-500">{item.city}, {item.state}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{currency(item.price, item.listingType)}</p>
                  {item.slug ? (
                    <Link to={`/properties/${item.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
                      View property
                    </Link>
                  ) : null}
                </div>
              )) : (
                <div className="rounded-[24px] border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                  No saved properties yet. Use the wishlist buttons on listings to save favorites here.
                </div>
              )}
            </div>
          </div>
          <button onClick={handleLogout} className="mt-8 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-rose-600">
            Logout
          </button>
        </div>
      </div>
    </section>
  );
};
