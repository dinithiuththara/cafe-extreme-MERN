import express from "express";
import { getDashboardStats, getAllPayments } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/payments", protect, adminOnly, getAllPayments);

export default router;
