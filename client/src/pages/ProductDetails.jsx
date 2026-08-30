import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Heart, ArrowLeft, ShoppingBag } from "lucide-react";
import { productService } from "../services/productService.js";
import { userService } from "../services/userService.js";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import { formatPrice } from "../utils/format.js";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState({}); // { groupName: { label, priceDelta } }
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    productService
      .getById(id)
      .then((data) => {
        setProduct(data);
        // Pre-select the first option of every required add-on group
        const defaults = {};
        (data.addOns || [])
          .filter((g) => g.type === "required-single")
          .forEach((g) => {
            defaults[g.name] = { label: g.options[0].label, priceDelta: g.options[0].priceDelta };
          });
        setSelections(defaults);
        setIsFavorite((user?.favorites || []).includes(data._id));
      })
      .catch(() => setError("This item couldn't be found."))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleSelect = (groupName, option) => {
    setSelections((prev) => ({
      ...prev,
      [groupName]: { label: option.label, priceDelta: option.priceDelta },
    }));
  };

  const addOnTotal = Object.values(selections).reduce((sum, s) => sum + (s.priceDelta || 0), 0);
  const unitPrice = product ? product.price + addOnTotal : 0;

  const handleAddToCart = () => {
    const selectedAddOns = Object.entries(selections).map(([groupName, s]) => ({
      groupName,
      optionLabel: s.label,
      priceDelta: s.priceDelta,
    }));
    addToCart(product, selectedAddOns, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream/20 border-t-copper" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-6 text-center">
        <p className="text-cream/60 mb-6">{error || "Product not found."}</p>
        <Link to="/menu" className="btn-outline">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <section className="pt-28 pb-24 px-6 lg:px-12">
      <div className="container-premium">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-sm text-cream/50 hover:text-cream transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-14"
        >
          {/* Image */}
          <div className="aspect-square overflow-hidden rounded-sm bg-charcoal-light">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {product.category?.name && <p className="eyebrow mb-3">{product.category.name}</p>}
            <h1 className="font-display text-4xl text-cream mb-4">{product.name}</h1>
            <p className="text-cream/60 leading-relaxed mb-6">{product.description}</p>
            <p className="font-mono text-2xl text-copper mb-8">{formatPrice(unitPrice)}</p>

            {/* Add-on groups */}
            {(product.addOns || []).map((group) => (
              <div key={group.name} className="mb-6">
                <p className="text-xs uppercase tracking-wide text-cream/50 mb-3">
                  {group.name}
                  {group.type === "required-single" && <span className="text-copper"> *</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const isSelected = selections[group.name]?.label === option.label;
                    return (
                      <button
                        key={option.label}
                        onClick={() => handleSelect(group.name, option)}
                        className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                          isSelected
                            ? "border-copper bg-copper text-charcoal"
                            : "border-cream/20 text-cream/70 hover:border-cream/40"
                        }`}
                      >
                        {option.label}
                        {option.priceDelta > 0 && ` (+${formatPrice(option.priceDelta)})`}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity + actions */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-4 rounded-sm border border-cream/20 px-4 py-2.5">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="text-cream/60 hover:text-copper"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-mono text-cream">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="text-cream/60 hover:text-copper"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={async () => {
                  if (!isAuthenticated) {
                    navigate("/signin", { state: { from: { pathname: `/product/${id}` } } });
                    return;
                  }
                  setIsFavorite((v) => !v); // optimistic update
                  try {
                    await userService.toggleFavorite(product._id);
                  } catch {
                    setIsFavorite((v) => !v); // revert on failure
                  }
                }}
                aria-label="Toggle favorite"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                  isFavorite ? "border-copper text-copper" : "border-cream/20 text-cream/60 hover:text-copper"
                }`}
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className="btn-primary mt-6 w-full sm:w-auto disabled:opacity-50 disabled:pointer-events-none"
            >
              <ShoppingBag size={17} />
              {justAdded ? "Added to Cart" : product.isAvailable ? "Add to Cart" : "Currently Unavailable"}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductDetails;
