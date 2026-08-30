import api from "./api.js";

export const productService = {
  getAll: (params = {}) => api.get("/products", { params }).then((res) => res.data),
  getById: (id) => api.get(`/products/${id}`).then((res) => res.data),
  create: (data) => api.post("/products", data).then((res) => res.data),
  update: (id, data) => api.put(`/products/${id}`, data).then((res) => res.data),
  remove: (id) => api.delete(`/products/${id}`).then((res) => res.data),
};

export const categoryService = {
  getAll: () => api.get("/categories").then((res) => res.data),
  create: (data) => api.post("/categories", data).then((res) => res.data),
  update: (id, data) => api.put(`/categories/${id}`, data).then((res) => res.data),
  remove: (id) => api.delete(`/categories/${id}`).then((res) => res.data),
};
