import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import CategoryVideoIntro from "../components/menu/CategoryVideoIntro.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useProducts } from "../hooks/useProducts.js";

// Shared by HotCoffee.jsx and IcedCoffee.jsx. Product cards here use the
// same ProductCard component as the rest of the site, so "Add to Cart"
// flows into the existing CartContext -> Checkout -> Payment pipeline
// (including "Pay by Card") automatically -- no separate checkout needed.
const CategoryMenuPage = ({ categorySlug, title, tagline, otherCategory, videoSrc }) => {
  const { products, loading, error } = useProducts({ category: categorySlug });

  return (
    <>
      <CategoryVideoIntro title={title} videoSrc={videoSrc} />

      <section className="section-padding">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="eyebrow mb-3">Café Extreme</p>
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">{title}</h1>
            <p className="text-cream/50 max-w-xl mx-auto">{tagline}</p>
          </motion.div>

          {loading && (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream/20 border-t-copper" />
            </div>
          )}

          {!loading && error && <p className="text-center text-cream/50 py-16">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-16">
              <Coffee size={32} className="mx-auto mb-4 text-cream/20" />
              <p className="text-cream/50">No items available in this category yet.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.4) }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            {otherCategory && (
              <Link to={otherCategory.to} className="text-sm text-copper hover:text-copper-light transition-colors">
                Looking for {otherCategory.label}?
              </Link>
            )}
            <Link to="/menu" className="text-sm text-cream/40 hover:text-cream transition-colors">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryMenuPage;