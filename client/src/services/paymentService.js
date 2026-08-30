import api from "./api.js";

export const paymentService = {
  // Initiates payment for an order. Demo mode (no Stripe keys configured
  // on the server) completes instantly; Stripe mode returns a clientSecret
  // meant for a real card form (@stripe/react-stripe-js).
  charge: (orderId) => api.post(`/payments/${orderId}/charge`).then((res) => res.data),
  confirm: (orderId) => api.post(`/payments/${orderId}/confirm`).then((res) => res.data),
};
