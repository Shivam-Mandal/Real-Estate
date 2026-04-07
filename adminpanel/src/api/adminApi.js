import { api, authorizedApi } from "./axios";

export const adminApi = {
  login: (payload) => api.post("/auth/login", payload),
  refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
  logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),
  me: (token) => authorizedApi(token).get("/auth/me"),
  getDashboard: (token) => authorizedApi(token).get("/admin/dashboard"),
  getUsers: (token) => authorizedApi(token).get("/admin/users"),
  getProperties: (token) => authorizedApi(token).get("/properties/admin/all"),
  createProperty: (token, payload) => authorizedApi(token).post("/properties", payload),
  updateProperty: (token, id, payload) => authorizedApi(token).put(`/properties/${id}`, payload),
  deleteProperty: (token, id) => authorizedApi(token).delete(`/properties/${id}`),
  getInquiries: (token) => authorizedApi(token).get("/inquiries/admin/all"),
  updateInquiryStatus: (token, id, status) => authorizedApi(token).patch(`/inquiries/${id}/status`, { status }),
};
