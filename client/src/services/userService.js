import api from "./api.js";

export const userService = {
  updateProfile: (data) => api.put("/users/me", data).then((res) => res.data),
  changePassword: (data) => api.put("/users/me/password", data).then((res) => res.data),
  getFavorites: () => api.get("/users/favorites").then((res) => res.data),
  toggleFavorite: (productId) => api.post(`/users/favorites/${productId}`).then((res) => res.data),
};
