import { motion } from "framer-motion";
import { Sprout, Flame, Timer } from "lucide-react";

const steps = [
  {
    icon: Sprout,
    title: "Sourced with Care",
    description: "Beans selected from growers who share our standard for quality.",
  },
  {
    icon: Flame,
    title: "Roasted for Character",
    description: "Small-batch roasting that draws out each bean's true profile.",
  },
  {
    icon: Timer,
    title: "Extracted with Precision",
    description: "Every shot pulled to an exact time, temperature and pressure.",
  },
];

const ExperienceSection = () => (
  <section className="section-padding bg-espresso/20">
    <div className="container-premium">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="eyebrow mb-3">Craftsmanship</p>
        <h2 className="font-display text-3xl md:text-4xl text-cream">The Coffee Experience</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        {steps.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="text-center"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-copper/30 text-copper">
              <Icon size={22} />
            </div>
            <h3 className="font-display text-lg text-cream mb-2">{title}</h3>
            <p className="text-sm text-cream/50 leading-relaxed">{description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ExperienceSection;
