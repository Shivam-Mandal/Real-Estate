import { api } from "./axios";

export const userApi = {
  getWishlist: (accessToken) =>
    api.get("/users/me/wishlist", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  addToWishlist: (accessToken, propertyId) =>
    api.post(
      `/users/me/wishlist/${propertyId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ),
  removeFromWishlist: (accessToken, propertyId) =>
    api.delete(`/users/me/wishlist/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
};
