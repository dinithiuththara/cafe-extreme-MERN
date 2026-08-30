import { motion } from "framer-motion";
import ProductCard from "../ProductCard.jsx";

const ProductShowcase = ({ eyebrow, title, subtitle, products, loading }) => {
  if (!loading && products.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-3">{title}</h2>
          {subtitle && <p className="text-cream/50 max-w-xl mx-auto">{subtitle}</p>}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream/20 border-t-copper" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;
