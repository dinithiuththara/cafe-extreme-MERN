import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Coffee, Snowflake, Leaf } from "lucide-react";

// Maps known category slugs to an icon, short description, and a
// dedicated route (for the two primary categories, which get their own
// cinematic scroll-animation pages). Any category not listed here falls
// back to a generic icon and the general filtered menu view.
const CATEGORY_META = {
  "hot-coffee": {
    icon: Coffee,
    description: "Rich, bold espresso-based classics.",
    to: "/menu/hot-coffee",
  },
  "iced-coffee": {
    icon: Snowflake,
    description: "Chilled coffee, brewed for warm days.",
    to: "/menu/iced-coffee",
  },
  "iced-tea": { icon: Leaf, description: "Refreshing infusions, steeped fresh." },
};

const CategoryExplorer = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="section-padding bg-espresso/20">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="eyebrow mb-3">Discover</p>
          <h2 className="font-display text-3xl md:text-4xl text-cream">Explore Our Menu</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const meta = CATEGORY_META[cat.slug] || { icon: Coffee, description: cat.description };
            const Icon = meta.icon;
            return (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={meta.to || `/menu?category=${cat.slug}`}
                  className="group flex flex-col items-center rounded-sm border border-cream/10 bg-charcoal/40 p-10 text-center transition-all duration-500 hover:border-copper/40 hover:shadow-card"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-copper/30 text-copper transition-transform duration-500 group-hover:scale-110">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display text-xl text-cream mb-2">{cat.name}</h3>
                  <p className="text-sm text-cream/50">{meta.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryExplorer;
