import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { orderService } from "../services/orderService.js";
import { formatPrice, formatDate } from "../utils/format.js";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getById(orderId)
      .then(setOrder)
      .catch(() => setError("We couldn't find that order."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream/20 border-t-copper" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-6 text-center">
        <p className="text-cream/60 mb-6">{error}</p>
        <Link to="/menu" className="btn-outline">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen pt-28 pb-24 px-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-copper/10 border border-copper/40 mb-6">
          <CheckCircle2 size={30} className="text-copper" />
        </div>
        <p className="eyebrow mb-2">Thank You</p>
        <h1 className="font-display text-3xl md:text-4xl text-cream mb-3">
          Your order has been confirmed.
        </h1>
        <p className="text-cream/50 mb-2">
          Order <span className="font-mono text-copper">#{order._id.slice(-8).toUpperCase()}</span>
        </p>
        <p className="text-cream/40 text-sm mb-10">Placed on {formatDate(order.createdAt)}</p>

        <div className="text-left rounded-sm border border-cream/10 bg-espresso/30 p-6 mb-8">
          <div className="space-y-3 mb-5">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-cream/70">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-mono">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-cream/10 pt-4">
            <div className="flex justify-between text-cream/60">
              <span>Subtotal</span>
              <span className="font-mono">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-cream/60">
              <span>Delivery Fee</span>
              <span className="font-mono">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-cream pt-2 border-t border-cream/10">
              <span className="font-medium">Total</span>
              <span className="font-mono text-copper text-lg">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="btn-primary">
            View Order Status
          </Link>
          <Link to="/menu" className="btn-outline">
            Order More
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default OrderConfirmation;
