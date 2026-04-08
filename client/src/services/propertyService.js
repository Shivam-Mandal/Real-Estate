import { propertyApi } from "../api/propertyApi";

export const propertyService = {
  getFeatured: async () => (await propertyApi.getFeatured()).data,
  getAll: async (params) => (await propertyApi.getAll(params)).data,
  getFilters: async () => (await propertyApi.getFilters()).data,
  getBySlug: async (slug) => (await propertyApi.getBySlug(slug)).data,
  getSimilar: async (slug) => (await propertyApi.getSimilar(slug)).data,
  submitInquiry: async (payload) => (await propertyApi.submitInquiry(payload)).data,
};
