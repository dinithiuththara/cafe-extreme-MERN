import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Truck } from "lucide-react";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import { orderService } from "../services/orderService.js";
import { paymentService } from "../services/paymentService.js";
import { formatPrice } from "../utils/format.js";

const Checkout = () => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.phone || !form.address) {
      setError("Please fill in all delivery details.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedAddOns: item.selectedAddOns,
        })),
        deliveryAddress: form,
        paymentMethod: paymentMethod === "card" ? "card" : "cash-on-delivery",
      };

      // Step 1: create the order (always starts as pending payment).
      const order = await orderService.create(payload);

      // Step 2: if paying by card, charge it immediately through the
      // payment service. This runs in demo mode unless the server has
      // real Stripe keys configured (see server/services/paymentService.js).
      if (paymentMethod === "card") {
        await paymentService.charge(order._id);
      }

      clearCart();
      navigate(`/order-confirmation/${order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong placing your order.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center pt-24 px-6 text-center">
        <p className="text-cream/50 mb-6">Your cart is empty — add something delicious first.</p>
        <button onClick={() => navigate("/menu")} className="btn-primary">
          Explore Menu
        </button>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-24 px-6 lg:px-12">
      <div className="container-premium">
        <h1 className="font-display text-4xl text-cream mb-10">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="eyebrow mb-5">Delivery Details</h2>
              {error && (
                <div className="mb-5 rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">Full Name</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream placeholder:text-cream/30 focus:border-copper focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream placeholder:text-cream/30 focus:border-copper focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="07X XXX XXXX"
                    className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream placeholder:text-cream/30 focus:border-copper focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wide text-cream/50 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Street, city, postal code"
                    className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-cream placeholder:text-cream/30 focus:border-copper focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="eyebrow mb-5">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash-on-delivery")}
                  className={`flex items-center gap-3 rounded-sm border p-4 text-left transition-colors ${
                    paymentMethod === "cash-on-delivery"
                      ? "border-copper bg-copper/10"
                      : "border-cream/20 hover:border-cream/40"
                  }`}
                >
                  <Truck size={20} className="text-copper" />
                  <div>
                    <p className="text-sm text-cream">Cash on Delivery</p>
                    <p className="text-xs text-cream/40">Pay when your order arrives</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center gap-3 rounded-sm border p-4 text-left transition-colors ${
                    paymentMethod === "card" ? "border-copper bg-copper/10" : "border-cream/20 hover:border-cream/40"
                  }`}
                >
                  <CreditCard size={20} className="text-copper" />
                  <div>
                    <p className="text-sm text-cream">Pay by Card</p>
                    <p className="text-xs text-cream/40">
                      Processed via Stripe when configured, demo mode otherwise
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-28 rounded-sm border border-cream/10 bg-espresso/30 p-6"
            >
              <h2 className="font-display text-xl text-cream mb-5">Order Summary</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-5">
                {items.map((item) => (
                  <div key={item.lineKey} className="flex justify-between text-sm text-cream/70">
                    <span className="truncate pr-3">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-mono shrink-0">{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t border-cream/10 pt-4">
                <div className="flex justify-between text-cream/60">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-cream/60">
                  <span>Delivery Fee</span>
                  <span className="font-mono">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-cream pt-2 border-t border-cream/10">
                  <span className="font-medium">Total</span>
                  <span className="font-mono text-copper text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full mt-6 disabled:opacity-60">
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </motion.div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
