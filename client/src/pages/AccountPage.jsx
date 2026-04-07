import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          <button onClick={handleLogout} className="mt-8 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-rose-600">
            Logout
          </button>
        </div>
      </div>
    </section>
  );
};
