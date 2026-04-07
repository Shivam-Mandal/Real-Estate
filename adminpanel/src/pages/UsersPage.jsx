import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

export const UsersPage = () => {
  const { accessToken } = useAdminAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    adminApi.getUsers(accessToken).then(({ data }) => setUsers(data.items)).catch(() => setUsers([]));
  }, [accessToken]);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="font-[Outfit] text-3xl font-semibold text-slate-950">Users</h1>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-3">Name</th>
              <th className="py-3">Email</th>
              <th className="py-3">Phone</th>
              <th className="py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-slate-100">
                <td className="py-4 font-medium text-slate-900">{user.name}</td>
                <td className="py-4">{user.email}</td>
                <td className="py-4">{user.phone || "Not provided"}</td>
                <td className="py-4 capitalize">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
