import { createContext, useState, useEffect, useMemo, useCallback } from "react";

export const CartContext = createContext(null);

const CART_KEY = "cafe_extreme_cart";
const DELIVERY_FEE = 300; // flat delivery fee in Rs; adjust as needed

// Builds a stable key for a cart line so the same product with different
// add-on selections (e.g. Latte + Coconut Milk vs Latte + Cow Milk) is
// tracked as two separate lines, but identical selections merge quantities.
const buildLineKey = (productId, selectedAddOns) => {
  const addOnKey = selectedAddOns
    .map((a) => `${a.groupName}:${a.optionLabel}`)
    .sort()
    .join("|");
  return `${productId}__${addOnKey}`;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  // product: the Product document. selectedAddOns: [{groupName, optionLabel, priceDelta}]
  const addToCart = useCallback((product, selectedAddOns = [], quantity = 1) => {
    const addOnTotal = selectedAddOns.reduce((sum, a) => sum + (a.priceDelta || 0), 0);
    const unitPrice = product.price + addOnTotal;
    const lineKey = buildLineKey(product._id, selectedAddOns);

    setItems((prev) => {
      const existing = prev.find((item) => item.lineKey === lineKey);
      if (existing) {
        return prev.map((item) =>
          item.lineKey === lineKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          lineKey,
          productId: product._id,
          name: product.name,
          image: product.image,
          unitPrice,
          quantity,
          selectedAddOns,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((lineKey, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((item) => (item.lineKey === lineKey ? { ...item, quantity } : item)));
  }, []);

  const removeFromCart = useCallback((lineKey) => {
    setItems((prev) => prev.filter((item) => item.lineKey !== lineKey));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
