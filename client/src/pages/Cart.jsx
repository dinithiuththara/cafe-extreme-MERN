import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import { formatPrice } from "../utils/format.js";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center pt-24 px-6 text-center">
        <ShoppingBag size={36} className="text-cream/20 mb-5" />
        <h1 className="font-display text-3xl text-cream mb-3">Your Cart is Empty</h1>
        <p className="text-cream/50 mb-8 max-w-sm">
          Looks like you haven't added anything yet. Explore the menu to find your next favorite cup.
        </p>
        <Link to="/menu" className="btn-primary">
          Explore Menu
        </Link>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-24 px-6 lg:px-12">
      <div className="container-premium">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-4xl text-cream">Your Cart</h1>
          <button onClick={clearCart} className="text-sm text-cream/40 hover:text-red-400 transition-colors">
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.lineKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 rounded-sm border border-cream/10 bg-espresso/30 p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 shrink-0 rounded-sm object-cover bg-charcoal-light"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-cream truncate">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.lineKey)}
                      aria-label={`Remove ${item.name}`}
                      className="shrink-0 text-cream/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {item.selectedAddOns?.length > 0 && (
                    <p className="text-xs text-cream/40 mt-1">
                      {item.selectedAddOns.map((a) => a.optionLabel).join(" · ")}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-sm border border-cream/20 px-3 py-1.5">
                      <button
                        onClick={() => updateQuantity(item.lineKey, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="text-cream/60 hover:text-copper disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-5 text-center font-mono text-sm text-cream">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.lineKey, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="text-cream/60 hover:text-copper"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-mono text-copper text-sm">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-sm border border-cream/10 bg-espresso/30 p-6">
              <h2 className="font-display text-xl text-cream mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-cream/60">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-cream/60">
                  <span>Delivery Fee</span>
                  <span className="font-mono">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="border-t border-cream/10 pt-3 flex justify-between text-cream">
                  <span className="font-medium">Total</span>
                  <span className="font-mono text-copper text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <button onClick={handleCheckout} className="btn-primary w-full mt-6">
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <Link
                to="/menu"
                className="block text-center text-sm text-cream/40 hover:text-cream mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
