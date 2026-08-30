import express from "express";
import { chargeOrderPayment, confirmOrderPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/:orderId/charge", protect, chargeOrderPayment);
router.post("/:orderId/confirm", protect, confirmOrderPayment);

export default router;
