import { api } from "./axios";

export const propertyApi = {
  getFeatured: () => api.get("/properties/featured"),
  getAll: (params) => api.get("/properties", { params }),
  getFilters: () => api.get("/properties/filters"),
  getBySlug: (slug) => api.get(`/properties/${slug}`),
  getSimilar: (slug) => api.get(`/properties/${slug}/similar`),
  submitInquiry: (payload) => api.post("/messages", payload),
};
