import { useState } from "react";
import { motion } from "framer-motion";

const AboutSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="section-padding">
      <div className="container-premium grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/5] overflow-hidden rounded-sm bg-espresso/40"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setVideoLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src="/videos/about-cafe.mp4" type="video/mp4" />
          </video>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow mb-4">Our Story</p>
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-6 leading-tight">
            Coffee, treated with intent.
          </h2>
          <p className="text-cream/60 leading-relaxed mb-4">
            Café Extreme was founded on a simple belief: coffee deserves attention. From bean to
            cup, every step is deliberate — sourced with care, roasted for character, and pulled
            with precision.
          </p>
          <p className="text-cream/60 leading-relaxed">
            We're not chasing trends. We're chasing the perfect extraction, the right pour, the
            moment a cup meets a quiet morning. That's the extreme we care about.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;