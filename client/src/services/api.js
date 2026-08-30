import axios from "axios";

// In dev, Vite proxies "/api" to the backend (see vite.config.js).
// In production, set VITE_API_URL to your deployed backend URL.
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL });

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cafe_extreme_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize "session expired" handling: if the API ever rejects our
// token, clear it so the app falls back to the logged-out state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cafe_extreme_token");
    }
    return Promise.reject(error);
  }
);

export default api;
