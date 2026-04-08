import { api, authorizedApi } from "./axios";

export const adminApi = {
  login: (payload) => api.post("/auth/login", payload),
  refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
  logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),
  me: (token) => authorizedApi(token).get("/auth/me"),
  getDashboard: (token) => authorizedApi(token).get("/admin/dashboard"),
  getUsers: (token) => authorizedApi(token).get("/users"),
  getAgents: (token) => authorizedApi(token).get("/agents"),
  getPropertySpecifications: (token) => authorizedApi(token).get("/admin/property-specifications"),
  updatePropertySpecification: (token, id, payload) => authorizedApi(token).patch(`/admin/property-specifications/${id}`, payload),
  getPlans: (token) => authorizedApi(token).get("/payments/plans"),
  createPlan: (token, payload) => authorizedApi(token).post("/payments/plans", payload),
  updatePlan: (token, id, payload) => authorizedApi(token).patch(`/payments/plans/${id}`, payload),
  getPaymentLogs: (token) => authorizedApi(token).get("/payments/logs"),
  createPaymentLog: (token, payload) => authorizedApi(token).post("/payments/logs", payload),
  createUser: (token, payload) => authorizedApi(token).post("/users", payload),
  updateUser: (token, id, payload) => authorizedApi(token).patch(`/users/${id}`, payload),
  getProperties: (token) => authorizedApi(token).get("/properties/admin/all"),
  createProperty: (token, payload) => authorizedApi(token).post("/properties", payload),
  updateProperty: (token, id, payload) => authorizedApi(token).put(`/properties/${id}`, payload),
  deleteProperty: (token, id) => authorizedApi(token).delete(`/properties/${id}`),
  updatePropertyApproval: (token, id, approvalStatus) =>
    authorizedApi(token).patch(`/properties/${id}/approval`, { approvalStatus }),
  uploadImages: (token, formData) =>
    authorizedApi(token).post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getInquiries: (token) => authorizedApi(token).get("/messages"),
  updateInquiryStatus: (token, id, status) => authorizedApi(token).patch(`/messages/${id}/status`, { status }),
};
