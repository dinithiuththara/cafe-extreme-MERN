import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import { chargeOrder, confirmPayment, isDemoMode } from "../services/paymentService.js";

const assertOwnership = (order, userId) => order.user.toString() === userId.toString();

// @route  POST /api/payments/:orderId/charge
// @desc   Initiates payment for a pending order. Demo mode completes instantly;
//         Stripe mode returns a clientSecret for the frontend to finish.
// @access Private (order owner only)
export const chargeOrderPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!assertOwnership(order, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "This order has already been paid" });
    }

    const result = await chargeOrder(order);

    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      gateway: result.gateway,
      gatewayReferenceId: result.gatewayReferenceId,
      amount: order.total,
      currency: "lkr",
      status: result.status,
    });

    order.payment = payment._id;
    order.paymentMethod = "card";
    if (result.status === "succeeded") {
      order.paymentStatus = "paid";
      if (order.status === "Pending") order.status = "Confirmed";
    }
    await order.save();

    res.json({
      order,
      clientSecret: result.clientSecret, // null in demo mode
      demoMode: isDemoMode(),
    });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/payments/:orderId/confirm
// @desc   Confirms a payment with the gateway (used after client-side Stripe
//         confirmation in Stripe mode; a no-op success in demo mode).
// @access Private (order owner only)
export const confirmOrderPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("payment");
    if (!order || !order.payment) {
      return res.status(404).json({ message: "No payment found for this order" });
    }
    if (!assertOwnership(order, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const succeeded = await confirmPayment(order.payment.gateway, order.payment.gatewayReferenceId);

    if (succeeded) {
      order.payment.status = "succeeded";
      order.paymentStatus = "paid";
      if (order.status === "Pending") order.status = "Confirmed";
      await order.payment.save();
      await order.save();
    }

    res.json({ order, paid: succeeded });
  } catch (error) {
    next(error);
  }
};
