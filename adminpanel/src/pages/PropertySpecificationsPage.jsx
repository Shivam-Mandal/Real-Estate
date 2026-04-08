import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

export const PropertySpecificationsPage = () => {
  const { accessToken } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    adminApi.getPropertySpecifications(accessToken).then(({ data }) => setItems(data.items)).catch(() => setItems([]));
  }, [accessToken]);

  useEffect(() => {
    load();
  }, [load]);

  const updateItem = async (id, payload) => {
    try {
      await adminApi.updatePropertySpecification(accessToken, id, payload);
      setMessage("Property specifications updated.");
      load();
    } catch (error) {
      setMessage(error?.response?.data?.message || "We couldn't update the specification right now.");
    }
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-700">Property Specifications</p>
        <h1 className="mt-3 font-[Outfit] text-3xl font-semibold text-slate-950">Manage dynamic property fields.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Control which specification fields appear in property forms and how they are labeled. Current supported fields are bedrooms, bathrooms, area, and parking.
        </p>
      </div>

      {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-3">Key</th>
              <th className="py-3">Label</th>
              <th className="py-3">Unit</th>
              <th className="py-3">Order</th>
              <th className="py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t border-slate-100">
                <td className="py-4 font-medium text-slate-900">{item.key}</td>
                <td className="py-4">
                  <input
                    defaultValue={item.label}
                    onBlur={(e) => updateItem(item._id, { label: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </td>
                <td className="py-4">
                  <input
                    defaultValue={item.unit}
                    onBlur={(e) => updateItem(item._id, { unit: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </td>
                <td className="py-4">
                  <input
                    type="number"
                    defaultValue={item.sortOrder}
                    onBlur={(e) => updateItem(item._id, { sortOrder: e.target.value })}
                    className="w-24 rounded-xl border border-slate-200 px-3 py-2"
                  />
                </td>
                <td className="py-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={(e) => updateItem(item._id, { isActive: e.target.checked })}
                    />
                    <span>{item.isActive ? "Enabled" : "Disabled"}</span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
