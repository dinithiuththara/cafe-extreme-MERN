import Stripe from "stripe";

// Whether real Stripe credentials are present. If not, the app runs in
// DEMO mode automatically — this is the "safe test payment mode" the
// project requires when real credentials are unavailable.
const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

let stripeClient = null;
const getStripe = () => {
  if (!stripeClient && isStripeConfigured()) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
};

export const isDemoMode = () => !isStripeConfigured();

// Initiates payment for an order's total.
//
// STRIPE MODE (STRIPE_SECRET_KEY set): creates a real PaymentIntent and
// returns its clientSecret. The frontend would use @stripe/react-stripe-js
// with that clientSecret to collect real card details — that UI is the
// natural next extension point and isn't included here since it requires
// live Stripe keys to test. The order stays "pending" until confirmed
// (ideally via a Stripe webhook in production, or confirmPayment below).
//
// DEMO MODE (no keys configured): the "charge" succeeds instantly so the
// full checkout flow is testable end-to-end without any real credentials.
export const chargeOrder = async (order) => {
  if (isStripeConfigured()) {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Stripe expects the smallest currency unit (cents)
      currency: "lkr",
      metadata: { orderId: order._id.toString() },
    });
    return {
      gateway: "stripe",
      gatewayReferenceId: intent.id,
      clientSecret: intent.client_secret,
      status: "pending",
    };
  }

  // --- DEMO MODE ---
  return {
    gateway: "demo",
    gatewayReferenceId: `demo_${order._id}_${Date.now()}`,
    clientSecret: null,
    status: "succeeded",
  };
};

// Re-checks a payment's status directly with the gateway rather than
// trusting the client. In production, prefer a Stripe webhook
// (payment_intent.succeeded) over a client-triggered confirm call.
export const confirmPayment = async (gateway, gatewayReferenceId) => {
  if (gateway === "stripe") {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(gatewayReferenceId);
    return intent.status === "succeeded";
  }
  return true; // demo mode always succeeds
};
