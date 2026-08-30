import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);

// Specific routes must come before the generic "/:id" route below,
// otherwise Express would try to treat "admin" as an order id.
router.get("/admin/all", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

router.get("/:id", protect, getOrderById);

export default router;
