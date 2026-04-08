import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "user",
  isActive: true,
};

export const UsersPage = () => {
  const { accessToken, user: currentUser } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadUsers = useCallback(() => {
    adminApi.getUsers(accessToken).then(({ data }) => setUsers(data.items)).catch(() => setUsers([]));
  }, [accessToken]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      await adminApi.createUser(accessToken, form);
      setForm(emptyForm);
      setMessage("User created successfully.");
      loadUsers();
    } catch (error) {
      setMessage(error?.response?.data?.message || "We couldn't create the user right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickUpdate = async (id, payload) => {
    try {
      await adminApi.updateUser(accessToken, id, payload);
      loadUsers();
    } catch (error) {
      setMessage(error?.response?.data?.message || "We couldn't update the user right now.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <form onSubmit={handleCreateUser} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-[Outfit] text-3xl font-semibold text-slate-950">Create user</h1>
        <p className="mt-2 text-sm text-slate-500">Admins can create accounts, assign roles, and control account activation.</p>
        <div className="mt-5 grid gap-4">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Temporary password" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <div className="grid gap-4 md:grid-cols-2">
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              {["admin", "agent", "user", "vendor"].map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
            <select value={String(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          <button disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-70">
            {submitting ? <LoaderCircle size={18} className="animate-spin" /> : null}
            Create user
          </button>
        </div>
      </form>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950">Users & roles</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Phone</th>
                <th className="py-3">Role</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-slate-100">
                  <td className="py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="py-4">{user.email}</td>
                  <td className="py-4">{user.phone || "Not provided"}</td>
                  <td className="py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleQuickUpdate(user._id, { role: e.target.value })}
                      className="rounded-xl border border-slate-200 px-3 py-2 capitalize"
                    >
                      {["admin", "agent", "user", "vendor"].map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </td>
                  <td className="py-4">
                    <button
                      disabled={currentUser?.id === user._id && user.isActive}
                      onClick={() => handleQuickUpdate(user._id, { isActive: !user.isActive })}
                      className={`rounded-full px-4 py-2 text-xs font-semibold ${
                        user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
