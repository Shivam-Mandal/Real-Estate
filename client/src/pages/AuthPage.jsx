import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSeo } from "../hooks/useSeo";
import { useToast } from "../hooks/useToast";

export const AuthPage = () => {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTarget = location.state?.from?.pathname || "/account";
  const initialMode = useMemo(() => (token ? "reset" : "login"), [token]);
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "user", confirmPassword: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [generatedResetToken, setGeneratedResetToken] = useState("");
  const { login, register, loading, forgotPassword, resetPassword } = useAuth();
  const { showToast } = useToast();

  useSeo({
    title: token ? "Reset Password | Residence Elite" : "Login or Register | Residence Elite",
    description: "Sign in, create an account, or recover access to manage saved properties and inquiries.",
  });

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setNotice("");
    setGeneratedResetToken("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
        showToast({ title: "Welcome back", message: "Your session is ready.", tone: "success" });
        navigate(redirectTarget, { replace: true });
        return;
      }

      if (mode === "register") {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: form.role,
        });
        showToast({ title: "Account created", message: "You're signed in and ready to go.", tone: "success" });
        navigate(redirectTarget, { replace: true });
        return;
      }

      if (mode === "forgot") {
        const data = await forgotPassword(form.email);
        setNotice(data.message);
        setGeneratedResetToken(data.resetToken || "");
        showToast({ title: "Reset link generated", message: "Use the token below to reset the password.", tone: "info" });
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      await resetPassword(token, form.password);
      showToast({ title: "Password reset", message: "Your password has been updated.", tone: "success" });
      navigate("/account", { replace: true });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Authentication failed");
      showToast({ title: "Authentication failed", message: requestError?.response?.data?.message || "Authentication failed", tone: "error" });
    }
  };

  return (
    <section className="py-16">
      <div className="shell grid gap-10 lg:grid-cols-2">
        <div className="rounded-[32px] bg-slate-950 p-10 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-300">Member Access</p>
          <h1 className="mt-4 font-[Outfit] text-4xl font-semibold">Secure access for clients, agents, and admins.</h1>
          <p className="mt-5 max-w-xl text-sm leading-8 text-slate-300">
            Sign in to save favorites, manage your inquiries, and operate the platform with role-based access. Admins can use the dashboard portal, while users and agents authenticate here.
          </p>
        </div>
        <form onSubmit={submit} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {["login", "register", "forgot"].map((item) => (
              <button key={item} type="button" onClick={() => switchMode(item)} className={`rounded-full px-5 py-2 text-sm font-semibold ${mode === item ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-4">
            {mode === "register" ? <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" /> : null}
            {mode === "register" ? <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" /> : null}
            {mode === "register" ? (
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                <option value="user">User</option>
                <option value="agent">Agent</option>
              </select>
            ) : null}
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            {mode !== "forgot" ? (
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            ) : null}
            {mode === "reset" ? (
              <input required type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Confirm password" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            ) : null}
            <button disabled={loading} className="rounded-full bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-950">
              {loading ? "Processing..." : mode === "login" ? "Login" : mode === "register" ? "Create account" : mode === "forgot" ? "Generate reset token" : "Reset password"}
            </button>
            {mode === "login" ? (
              <button type="button" onClick={() => switchMode("forgot")} className="text-left text-sm font-medium text-teal-700">
                Forgot your password?
              </button>
            ) : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {notice ? <p className="text-sm text-emerald-700">{notice}</p> : null}
            {generatedResetToken ? (
              <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                Reset link: {window.location.origin}/reset-password/{generatedResetToken}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
};
