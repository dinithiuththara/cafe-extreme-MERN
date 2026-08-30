import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { formatPrice } from "../utils/format.js";
import { useCart } from "../hooks/useCart.js";

// The extraction ring: a partial circular tick-arc (SVG) that draws itself
// on hover, echoing a pressure gauge / crema swirl — this card's signature.
const ExtractionRing = () => (
  <svg
    className="absolute top-3 right-3 h-9 w-9 pointer-events-none"
    viewBox="0 0 90 90"
    fill="none"
  >
    <circle cx="45" cy="45" r="40" stroke="#C9A15A" strokeOpacity="0.15" strokeWidth="1.5" />
    <circle
      className="extraction-ring"
      cx="45"
      cy="45"
      r="40"
      stroke="#C9A15A"
      strokeWidth="1.5"
      strokeLinecap="round"
      transform="rotate(-90 45 45)"
    />
  </svg>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Quick-add uses default add-on selections (first option in each required group)
  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultAddOns = (product.addOns || [])
      .filter((group) => group.type === "required-single")
      .map((group) => ({
        groupName: group.name,
        optionLabel: group.options[0].label,
        priceDelta: group.options[0].priceDelta,
      }));
    addToCart(product, defaultAddOns, 1);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-cream/10 bg-espresso/40 transition-all duration-500 hover:border-copper/40 hover:shadow-card"
    >
      <div className="relative aspect-square overflow-hidden bg-charcoal-light">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <ExtractionRing />
        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/70">
            <span className="text-xs uppercase tracking-widest2 text-cream/70">Unavailable</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg text-cream mb-1">{product.name}</h3>
        <p className="text-sm text-cream/50 line-clamp-2 flex-1">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-copper text-sm">{formatPrice(product.price)}</span>
          <button
            onClick={handleQuickAdd}
            disabled={!product.isAvailable}
            aria-label={`Add ${product.name} to cart`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-colors duration-300 hover:border-copper hover:bg-copper hover:text-charcoal disabled:opacity-30 disabled:pointer-events-none"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
