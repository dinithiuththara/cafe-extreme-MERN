import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CTASection = () => (
  <section className="relative section-padding overflow-hidden bg-charcoal">
    <div className="absolute inset-0 bg-gradient-to-r from-espresso/40 via-transparent to-espresso/40" />
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="relative container-premium text-center"
    >
      <h2 className="font-display text-3xl md:text-5xl text-cream mb-8">
        Your perfect coffee is waiting.
      </h2>
      <Link to="/menu" className="btn-primary">
        Order Now
      </Link>
    </motion.div>
  </section>
);

export default CTASection;
