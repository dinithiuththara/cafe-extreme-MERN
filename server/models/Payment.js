import mongoose from "mongoose";

// Kept separate from Order so we can support multiple gateways
// (Stripe now, others later) without changing the Order schema.
const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gateway: {
      type: String,
      enum: ["stripe", "demo"],
      required: true,
    },
    // Stripe PaymentIntent/Session id, or "demo-xxxx" for test mode
    gatewayReferenceId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "lkr",
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
