import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

const details = [
  { icon: MapPin, label: "Address", value: "123 Beach Road, Negombo, Sri Lanka" },
  { icon: Clock, label: "Hours", value: "Daily, 7:00 AM – 10:00 PM" },
  { icon: Phone, label: "Phone", value: "+94 77 123 4567" },
  { icon: Mail, label: "Email", value: "hello@cafeextreme.com" },
];

const LocationSection = () => (
  <section className="section-padding">
    <div className="container-premium">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="eyebrow mb-3">Visit Us</p>
        <h2 className="font-display text-3xl md:text-4xl text-cream">Find Café Extreme</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {details.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-sm border border-cream/10 bg-espresso/20 p-6 text-center"
          >
            <Icon size={20} className="mx-auto mb-3 text-copper" />
            <p className="text-xs uppercase tracking-wide text-cream/40 mb-2">{label}</p>
            <p className="text-sm text-cream/80">{value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default LocationSection;
