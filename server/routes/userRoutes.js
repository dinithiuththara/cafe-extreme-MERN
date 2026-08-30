import express from "express";
import {
  updateProfile,
  changePassword,
  getFavorites,
  toggleFavorite,
  getAllUsers,
  updateUserStatus,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.put("/me", protect, updateProfile);
router.put("/me/password", protect, changePassword);
router.get("/favorites", protect, getFavorites);
router.post("/favorites/:productId", protect, toggleFavorite);

router.get("/admin/all", protect, adminOnly, getAllUsers);
router.put("/admin/:id/status", protect, adminOnly, updateUserStatus);

export default router;
