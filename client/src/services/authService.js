import api from "./api.js";

export const authService = {
  register: (data) => api.post("/auth/register", data).then((res) => res.data),
  login: (data) => api.post("/auth/login", data).then((res) => res.data),
  getCurrentUser: () => api.get("/auth/me").then((res) => res.data),
};
