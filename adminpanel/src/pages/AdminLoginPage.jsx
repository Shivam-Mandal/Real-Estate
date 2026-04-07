import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export const AdminLoginPage = () => {
  const { login, loading, isAuthenticated } = useAdminAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTarget = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={redirectTarget} replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate(redirectTarget, { replace: true });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || "Login failed");
    }
  };

  return (
    <section className="admin-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-8 lg:grid-cols-2">
        <div className="rounded-[36px] bg-slate-950 p-10 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-300">Admin Access</p>
          <h1 className="mt-4 font-[Outfit] text-5xl font-semibold">Manage listings, revenue visibility, and lead flow.</h1>
          <p className="mt-5 max-w-xl text-sm leading-8 text-slate-300">
            Secure role-based access for platform operators. Use the seed admin credentials after the backend seed step.
          </p>
        </div>
        <form onSubmit={submit} className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="font-[Outfit] text-3xl font-semibold text-slate-950">Sign in</h2>
          <div className="mt-6 grid gap-4">
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Admin email" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <button className="rounded-full bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-950">
              {loading ? "Signing in..." : "Login to dashboard"}
            </button>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          </div>
        </form>
      </div>
    </section>
  );
};
