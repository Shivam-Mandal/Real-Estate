import { authApi } from "../api/authApi";

export const authService = {
  login: async (payload) => (await authApi.login(payload)).data,
  register: async (payload) => (await authApi.register(payload)).data,
  refresh: async (refreshToken) => (await authApi.refresh(refreshToken)).data,
  logout: async (refreshToken) => (await authApi.logout(refreshToken)).data,
  me: async (accessToken) => (await authApi.me(accessToken)).data,
  forgotPassword: async (email) => (await authApi.forgotPassword(email)).data,
  resetPassword: async (token, password) => (await authApi.resetPassword(token, password)).data,
};
