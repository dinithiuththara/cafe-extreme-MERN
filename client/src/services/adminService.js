import api from "./api.js";

export const adminService = {
  getStats: () => api.get("/admin/stats").then((res) => res.data),
  getPayments: () => api.get("/admin/payments").then((res) => res.data),
  getAllUsers: () => api.get("/users/admin/all").then((res) => res.data),
  updateUserStatus: (id, isActive) =>
    api.put(`/users/admin/${id}/status`, { isActive }).then((res) => res.data),
};
