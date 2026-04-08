import { userApi } from "../api/userApi";

export const userService = {
  getWishlist: async (accessToken) => (await userApi.getWishlist(accessToken)).data,
  addToWishlist: async (accessToken, propertyId) => (await userApi.addToWishlist(accessToken, propertyId)).data,
  removeFromWishlist: async (accessToken, propertyId) => (await userApi.removeFromWishlist(accessToken, propertyId)).data,
};
