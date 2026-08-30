import api from "./api.js";

export const orderService = {
  create: (data) => api.post("/orders", data).then((res) => res.data),
  getMyOrders: () => api.get("/orders").then((res) => res.data),
  getById: (id) => api.get(`/orders/${id}`).then((res) => res.data),
  // Admin
  getAllAdmin: () => api.get("/orders/admin/all").then((res) => res.data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }).then((res) => res.data),
};
