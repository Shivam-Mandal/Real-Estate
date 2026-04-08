import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

const emptyForm = {
  userId: "",
  planId: "",
  amount: "",
  currency: "INR",
  status: "paid",
  paymentMethod: "manual",
  transactionId: "",
  notes: "",
};

export const PaymentLogsPage = () => {
  const { accessToken } = useAdminAuth();
  const [logs, setLogs] = useState([]);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    adminApi.getPaymentLogs(accessToken).then(({ data }) => setLogs(data.items)).catch(() => setLogs([]));
    adminApi.getPlans(accessToken).then(({ data }) => setPlans(data.items)).catch(() => setPlans([]));
    adminApi.getUsers(accessToken).then(({ data }) => setUsers(data.items)).catch(() => setUsers([]));
  }, [accessToken]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await adminApi.createPaymentLog(accessToken, form);
      setForm(emptyForm);
      setMessage("Payment log created and subscription applied.");
      load();
    } catch (error) {
      setMessage(error?.response?.data?.message || "We couldn't create the payment log right now.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <form onSubmit={submit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-[Outfit] text-3xl font-semibold text-slate-950">Add payment log</h1>
        <p className="mt-2 text-sm text-slate-500">Manual payments are supported now. Stripe can be added later as a live integration.</p>
        <div className="mt-5 grid gap-4">
          <select required value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
            <option value="">Select user</option>
            {users.map((user) => <option key={user._id} value={user._id}>{user.name} ({user.email})</option>)}
          </select>
          <select required value={form.planId} onChange={(e) => setForm({ ...form, planId: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
            <option value="">Select plan</option>
            {plans.map((plan) => <option key={plan._id} value={plan._id}>{plan.name}</option>)}
          </select>
          <div className="grid gap-4 md:grid-cols-2">
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} placeholder="Currency" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              {["paid", "pending", "failed", "refunded"].map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              {["manual", "stripe"].map((method) => <option key={method} value={method}>{method}</option>)}
            </select>
          </div>
          <input value={form.transactionId} onChange={(e) => setForm({ ...form, transactionId: e.target.value })} placeholder="Transaction ID" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows="4" placeholder="Notes" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          <button className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-teal-700">
            Save payment log
          </button>
        </div>
      </form>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-[Outfit] text-2xl font-semibold text-slate-950">Payment logs</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-3">User</th>
                <th className="py-3">Plan</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Method</th>
                <th className="py-3">Status</th>
                <th className="py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((item) => (
                <tr key={item._id} className="border-t border-slate-100">
                  <td className="py-4">
                    <p className="font-medium text-slate-900">{item.user?.name}</p>
                    <p className="text-slate-500">{item.user?.email}</p>
                  </td>
                  <td className="py-4">{item.plan?.name}</td>
                  <td className="py-4">{item.currency} {item.amount}</td>
                  <td className="py-4 capitalize">{item.paymentMethod}</td>
                  <td className="py-4 capitalize">{item.status}</td>
                  <td className="py-4">{new Date(item.purchasedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
